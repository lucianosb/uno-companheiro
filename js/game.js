/**
 * UNO COMPANHEIRO - Game Logic Engine
 * Implements standard Uno rules plus all custom cards & political satire mechanics.
 */

class UnoGame {
  constructor(options = {}) {
    this.playerCount = options.playerCount || 4;
    this.players = [];
    this.deck = [];
    this.discardPile = [];
    this.currentTurn = 0;
    this.hasDrawnThisTurn = false;
    this.direction = 1; // 1 = clockwise, -1 = counter-clockwise
    this.currentColor = null;
    this.currentCard = null;
    this.isGameOver = false;
    this.winner = null;
    
    // Status flags
    this.waitingForColorSelection = false;
    this.waitingForSigiloSelection = false;
    this.fazOLActive = false;
    this.unoShouted = {}; // playerId -> boolean
    this.turnHistory = [];
    this.onStateChange = options.onStateChange || (() => {});
    this.onActionLog = options.onActionLog || (() => {});
    this.onFazOLTrigger = options.onFazOLTrigger || (() => {});
    this.onSigiloTrigger = options.onSigiloTrigger || (() => {});
    this.onColorPrompt = options.onColorPrompt || (() => {});

    this.initPlayers();
  }

  initPlayers() {
    this.players = [
      {
        id: 0,
        name: 'Companheiro(a)',
        isHuman: true,
        hand: [],
        avatar: '🧑',
        quote: 'A esperança venceu o medo!',
        quotes: [
          'A esperança venceu o medo!',
          'Trabalhadores e trabalhadoras do baralho, uni-vos!',
          'Nunca antes na história deste Uno se jogou tão bem!',
          'Companheirismo e democracia nesta mesa!',
          'Não há força maior que a união de uma mão vencedora!'
        ]
      },
      {
        id: 1,
        name: 'Fernando Haddad',
        isHuman: false,
        hand: [],
        avatar: '📚',
        quote: 'Ajustando as alíquotas do baralho!',
        quotes: [
          'Ajustando as alíquotas do baralho!',
          'Essa compra de cartas está sujeita ao imposto de importação!',
          'Déficit zero de cartas na minha mão até o final do ano!',
          'Reforma tributária nesta mesa: cartas só com nota fiscal!',
          'Taxando cada descarte com muito amor e responsabilidade fiscal!'
        ]
      },
      {
        id: 2,
        name: 'Geraldo Alckmin',
        isHuman: false,
        hand: [],
        avatar: '🥣',
        quote: 'Com calma e chuchu, a gente vence a mesa.',
        quotes: [
          'Com calma e chuchu, a gente vence a mesa.',
          'Uma aliança ampla e democrática contra a sua vitória!',
          'Como médico, receito repouso e mais duas cartas para você.',
          'Sem radicalismos, companheiro: jogada moderada e certeira.',
          'Dizem que sou insosso, mas no Uno sou pura emoção!'
        ]
      },
      {
        id: 3,
        name: 'Janja Lula da Silva',
        isHuman: false,
        hand: [],
        avatar: '✨',
        quote: 'Companheirismo e alegria em cada jogada!',
        quotes: [
          'Companheirismo e alegria em cada jogada!',
          'A Resistência e a Paris aprovaram esse descarte!',
          'Subindo a rampa do Uno com muito orgulho e elegância!',
          'Comprei a gravata do presidente e agora compro a vitória na mesa!',
          'Festival do Futuro: música boa e cartas voando na oposição!'
        ]
      }
    ];
  }

  startNewGame() {
    this.isGameOver = false;
    this.winner = null;
    this.direction = 1;
    this.turnHistory = [];
    this.unoShouted = { 0: false, 1: false, 2: false, 3: false };
    this.hasDrawnThisTurn = false;
    
    // Reset hands
    this.players.forEach(p => p.hand = []);
    
    // Build & shuffle deck
    this.buildDeck();
    this.shuffle(this.deck);

    // Deal 7 cards to each player
    for (let i = 0; i < 7; i++) {
      for (let p = 0; p < this.players.length; p++) {
        this.players[p].hand.push(this.drawCardFromDeck());
      }
    }

    // Flip first card to discard pile (ensure it's not a wild card)
    let firstCard = this.drawCardFromDeck();
    while (firstCard.color === CardColors.WILD) {
      this.deck.push(firstCard);
      this.shuffle(this.deck);
      firstCard = this.drawCardFromDeck();
    }

    this.discardPile = [firstCard];
    this.currentCard = firstCard;
    this.currentColor = firstCard.color;
    this.currentTurn = 0;

    this.logAction(`🎲 Jogo iniciado! Carta na mesa: ${this.getCardName(firstCard)} (${ColorNamesPt[firstCard.color]})`);
    this.notifyState();
  }

  buildDeck() {
    this.deck = [];
    let idCounter = 1;
    const colors = [CardColors.RED, CardColors.BLUE, CardColors.GREEN, CardColors.YELLOW];

    colors.forEach(color => {
      // One 0 card
      this.deck.push({
        id: idCounter++,
        color,
        type: CardTypes.NUMBER,
        value: 0,
        name: `0 ${ColorNamesPt[color]}`
      });

      // Two of each 1-9
      for (let v = 1; v <= 9; v++) {
        for (let copy = 0; copy < 2; copy++) {
          this.deck.push({
            id: idCounter++,
            color,
            type: CardTypes.NUMBER,
            value: v,
            name: `${v} ${ColorNamesPt[color]}`
          });
        }
      }

      // One "13" PT Star card per color
      this.deck.push({
        id: idCounter++,
        color,
        type: CardTypes.STAR_13,
        value: 13,
        name: `13 Estrela ${ColorNamesPt[color]}`
      });

      // Two "Companheiras e Companheiros!" (Reverse) per color
      for (let copy = 0; copy < 2; copy++) {
        this.deck.push({
          id: idCounter++,
          color,
          type: CardTypes.REVERSE,
          name: `Companheiras e Companheiros! (${ColorNamesPt[color]})`,
          desc: 'Inverte o sentido do jogo. Muda a direção do discurso e faz a roda girar para o outro lado!'
        });
      }

      // Two "Recesso da Mesa" (Skip) per color
      for (let copy = 0; copy < 2; copy++) {
        this.deck.push({
          id: idCounter++,
          color,
          type: CardTypes.SKIP,
          name: `Recesso da Mesa (${ColorNamesPt[color]})`,
          desc: 'Pula a vez do próximo jogador. O colega da frente entra em recesso e perde o turno.'
        });
      }

      // Two "Picanha e Cervejinha" (+2) per color
      for (let copy = 0; copy < 2; copy++) {
        this.deck.push({
          id: idCounter++,
          color,
          type: CardTypes.DRAW_TWO,
          value: '+2',
          name: `Picanha e Cervejinha +2 (${ColorNamesPt[color]})`,
          desc: 'O próximo jogador deve comprar 2 cartas da pilha. Uma fartura de cartas direto para a mão do adversário!'
        });
      }
    });

    // Four "Bolsa Família" (Wild +4)
    for (let i = 0; i < 4; i++) {
      this.deck.push({
        id: idCounter++,
        color: CardColors.WILD,
        type: CardTypes.WILD_DRAW_FOUR,
        value: '+4',
        name: 'Bolsa Família (+4)',
        desc: 'Escolhe a nova cor da mesa e faz o próximo participante comprar 4 cartas. Promove a redistribuição de cartas na mesa!'
      });
    }

    // Four "Faz o L!" (Ação Rápida Coringa)
    for (let i = 0; i < 4; i++) {
      this.deck.push({
        id: idCounter++,
        color: CardColors.WILD,
        type: CardTypes.WILD_FAZ_O_L,
        value: 'L',
        name: 'Faz o L! (Ação Rápida)',
        desc: 'Todos os jogadores devem fazer o sinal do "L" rápido! O último a fazer compra 2 cartas. Escolhe a nova cor.'
      });
    }

    // Four "Sigilo Quebrado" (Coringa de Troca de Mão)
    for (let i = 0; i < 4; i++) {
      this.deck.push({
        id: idCounter++,
        color: CardColors.WILD,
        type: CardTypes.WILD_SIGILO,
        value: '📂',
        name: 'Sigilo Quebrado (Troca de Mão)',
        desc: 'Permite olhar a mão de qualquer oponente à sua escolha e trocar todo o seu baralho com ele. Tudo transparente e às claras!'
      });
    }
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  drawCardFromDeck() {
    if (this.deck.length === 0) {
      if (this.discardPile.length <= 1) {
        // Emergency re-creation if all cards drawn
        this.buildDeck();
        this.shuffle(this.deck);
      } else {
        const top = this.discardPile.pop();
        this.deck = this.shuffle(this.discardPile);
        this.discardPile = [top];
        this.logAction('🔄 Baralho de compras reembaralhado!');
      }
    }
    return this.deck.pop();
  }

  isCardPlayable(card) {
    if (!this.currentCard) return true;
    
    // Wild cards can always be played
    if (card.color === CardColors.WILD) return true;

    // Matches active color
    if (card.color === this.currentColor) return true;

    // Matches type or number
    if (card.type === CardTypes.NUMBER && this.currentCard.type === CardTypes.NUMBER) {
      return card.value === this.currentCard.value;
    }

    if (card.type === CardTypes.STAR_13 && (this.currentCard.type === CardTypes.STAR_13 || this.currentCard.value === 13)) {
      return true;
    }

    if (card.type === this.currentCard.type && card.type !== CardTypes.NUMBER) {
      return true;
    }

    return false;
  }

  getPlayableCards(playerIndex) {
    const player = this.players[playerIndex];
    if (!player) return [];
    return player.hand.filter(card => this.isCardPlayable(card));
  }

  /**
   * Action: Current player plays a card from hand
   */
  playCard(playerIndex, cardId, chosenColor = null) {
    if (this.isGameOver) return false;
    if (playerIndex !== this.currentTurn) return false;

    const player = this.players[playerIndex];
    const cardIdx = player.hand.findIndex(c => c.id === cardId);
    if (cardIdx === -1) return false;

    const card = player.hand[cardIdx];
    if (!this.isCardPlayable(card)) return false;

    // Remove card from hand
    player.hand.splice(cardIdx, 1);
    this.discardPile.push(card);
    this.currentCard = card;

    // Sound effect
    if (window.soundManager) {
      window.soundManager.playCardSnap();
    }

    // Check if player shouted "Companheiro!" when reaching 1 card
    this.unoShouted[playerIndex] = false;
    if (player.hand.length === 1 && !player.isHuman && Math.random() < 0.7) {
      this.unoShouted[playerIndex] = true;
      this.logAction(`📢 ${player.name} gritou: "COMPANHEIRO!"`);
      if (window.soundManager) window.soundManager.playCompanheiroShout();
    }

    // Check Win
    if (player.hand.length === 0) {
      this.handleGameOver(player);
      return true;
    }

    // Resolve Card Actions
    this.resolveCardEffect(player, card, chosenColor);
    return true;
  }

  resolveCardEffect(player, card, chosenColor) {
    switch (card.type) {
      case CardTypes.NUMBER:
      case CardTypes.STAR_13:
        this.currentColor = card.color;
        this.logAction(`🎴 ${player.name} jogou ${this.getCardName(card)}`);
        this.advanceTurn();
        break;

      case CardTypes.REVERSE:
        // "Companheiras e Companheiros!" (Inverter)
        this.currentColor = card.color;
        this.direction *= -1;
        this.logAction(`🔄 "Companheiras e Companheiros!" jogada por ${player.name}! Muda a direção do discurso e faz a roda girar para o outro lado!`);
        if (window.soundManager) window.soundManager.playReverseFanfare();
        this.advanceTurn();
        break;

      case CardTypes.SKIP:
        // "Recesso da Mesa" (Bloqueio)
        this.currentColor = card.color;
        const skippedPlayer = this.getNextPlayer();
        this.logAction(`🚫 "Recesso da Mesa"! O colega ${skippedPlayer.name} entra em recesso e perde o turno!`);
        if (window.soundManager) window.soundManager.playSkipGavel();
        // Skip next player by advancing twice
        this.advanceTurn(2);
        break;

      case CardTypes.DRAW_TWO:
        // "Picanha e Cervejinha" (+2)
        this.currentColor = card.color;
        const victimDraw2 = this.getNextPlayer();
        const c1 = this.drawCardFromDeck();
        const c2 = this.drawCardFromDeck();
        victimDraw2.hand.push(c1, c2);
        if (victimDraw2.hand.length !== 1) this.unoShouted[victimDraw2.id] = false;
        this.logAction(`🥩 "Picanha e Cervejinha"! Fartura de 2 cartas direto para ${victimDraw2.name}! Perde a vez!`);
        if (window.soundManager) window.soundManager.playDrawTwoSizzle();
        this.advanceTurn(2);
        break;

      case CardTypes.WILD_DRAW_FOUR:
        // "Bolsa Família" (+4 Coringa)
        if (player.isHuman && !chosenColor) {
          this.waitingForColorSelection = true;
          this.onColorPrompt(card, (selColor) => {
            this.waitingForColorSelection = false;
            this.completeBolsaFamilia(player, selColor);
          });
        } else {
          const selColor = chosenColor || this.selectBestColorForBot(player);
          this.completeBolsaFamilia(player, selColor);
        }
        break;

      case CardTypes.WILD_FAZ_O_L:
        // "Faz o L!" (Ação Rápida Coringa)
        if (player.isHuman && !chosenColor) {
          this.waitingForColorSelection = true;
          this.onColorPrompt(card, (selColor) => {
            this.waitingForColorSelection = false;
            this.triggerFazOL(player, selColor);
          });
        } else {
          const selColor = chosenColor || this.selectBestColorForBot(player);
          this.triggerFazOL(player, selColor);
        }
        break;

      case CardTypes.WILD_SIGILO:
        // "Sigilo Quebrado" (Coringa de Troca de Mão)
        if (player.isHuman) {
          this.waitingForSigiloSelection = true;
          this.onSigiloTrigger(player, (targetPlayerIndex, selColor) => {
            this.waitingForSigiloSelection = false;
            this.executeSigiloSwap(player, targetPlayerIndex, selColor);
          });
        } else {
          // Bot chooses opponent with lowest card count (most threatening)
          const target = this.selectBestSigiloTarget(player);
          const selColor = chosenColor || this.selectBestColorForBot(player);
          this.executeSigiloSwap(player, target.id, selColor);
        }
        break;

      default:
        this.currentColor = card.color;
        this.advanceTurn();
        break;
    }
  }

  completeBolsaFamilia(player, chosenColor) {
    this.currentColor = chosenColor;
    const victim = this.getNextPlayer();
    for (let i = 0; i < 4; i++) {
      victim.hand.push(this.drawCardFromDeck());
    }
    if (victim.hand.length !== 1) this.unoShouted[victim.id] = false;
    this.logAction(`🛍️ "Bolsa Família" ativado por ${player.name}! Nova cor: ${ColorNamesPt[chosenColor]}. Redistribuição de 4 cartas para ${victim.name}, que perde a vez!`);
    if (window.soundManager) window.soundManager.playDrawFourChime();
    this.advanceTurn(2);
  }

  triggerFazOL(player, chosenColor) {
    this.currentColor = chosenColor;
    this.fazOLActive = true;
    this.logAction(`🤟 "FAZ O L!" jogado por ${player.name}! Nova cor: ${ColorNamesPt[chosenColor]}. Todos devem fazer o gesto rápido!`);
    if (window.soundManager) window.soundManager.playFazOLAlert();

    this.onFazOLTrigger({
      initiator: player,
      onComplete: (slowestPlayerIndex) => {
        this.fazOLActive = false;
        const loser = this.players[slowestPlayerIndex];
        const c1 = this.drawCardFromDeck();
        const c2 = this.drawCardFromDeck();
        loser.hand.push(c1, c2);
        if (loser.hand.length !== 1) this.unoShouted[loser.id] = false;
        this.logAction(`🚨 ${loser.name} foi o mais lento no "Faz o L!" e comprou 2 cartas!`);
        this.advanceTurn();
      }
    });
  }

  executeSigiloSwap(player, targetPlayerIndex, chosenColor) {
    const target = this.players[targetPlayerIndex];
    if (!target || target.id === player.id) {
      this.advanceTurn();
      return;
    }

    // Swap entire hands
    const tempHand = [...player.hand];
    player.hand = [...target.hand];
    target.hand = tempHand;

    this.currentColor = chosenColor || this.currentColor || CardColors.RED;
    this.logAction(`📂 "Sigilo Quebrado"! ${player.name} espiou e trocou de mão com ${target.name}! Tudo transparente e às claras na mesa!`);
    if (window.soundManager) window.soundManager.playSigiloQuebrado();

    this.unoShouted[player.id] = false;
    this.unoShouted[target.id] = false;

    this.advanceTurn();
  }

  selectBestSigiloTarget(botPlayer) {
    // Pick the opponent with the fewest cards
    let bestOpponent = null;
    let minCards = 999;
    this.players.forEach(p => {
      if (p.id !== botPlayer.id) {
        if (p.hand.length < minCards) {
          minCards = p.hand.length;
          bestOpponent = p;
        }
      }
    });
    return bestOpponent || this.players[0];
  }

  selectBestColorForBot(botPlayer) {
    const counts = { [CardColors.RED]: 0, [CardColors.BLUE]: 0, [CardColors.GREEN]: 0, [CardColors.YELLOW]: 0 };
    botPlayer.hand.forEach(c => {
      if (c.color !== CardColors.WILD && counts[c.color] !== undefined) {
        counts[c.color]++;
      }
    });
    let maxC = CardColors.RED;
    let maxVal = -1;
    for (const [col, count] of Object.entries(counts)) {
      if (count > maxVal) {
        maxVal = count;
        maxC = col;
      }
    }
    return maxC;
  }

  /**
   * Action: Player draws a card
   */
  drawCard(playerIndex) {
    if (this.isGameOver) return null;
    if (playerIndex !== this.currentTurn) return null;
    if (this.hasDrawnThisTurn) return null;

    const player = this.players[playerIndex];
    const drawn = this.drawCardFromDeck();
    this.hasDrawnThisTurn = true;
    player.hand.push(drawn);
    if (player.hand.length !== 1) this.unoShouted[playerIndex] = false;

    if (window.soundManager) window.soundManager.playDrawCard();
    this.logAction(`📥 ${player.name} comprou uma carta.`);

    // If drawn card is playable, bot or human may play it or pass
    this.notifyState();
    return drawn;
  }

  passTurn(playerIndex) {
    if (this.isGameOver) return;
    if (playerIndex !== this.currentTurn) return;
    if (this.getPlayableCards(playerIndex).length > 0) return;
    this.logAction(`⏭️ ${this.players[playerIndex].name} passou a vez.`);
    this.advanceTurn();
  }

  /**
   * Action: Shout "COMPANHEIRO!"
   */
  shoutCompanheiro(playerIndex) {
    const player = this.players[playerIndex];
    if (this.isGameOver || !player || player.hand.length !== 1 || this.unoShouted[playerIndex]) return false;
    this.unoShouted[playerIndex] = true;
    this.logAction(`📢 ${player.name} bradou: "COMPANHEIRO!"`);
    if (window.soundManager) window.soundManager.playCompanheiroShout();
    this.notifyState();
    return true;
  }

  /**
   * Action: Catch an opponent who forgot to shout "COMPANHEIRO!"
   */
  challengeCompanheiro(challengerIndex, targetIndex) {
    const target = this.players[targetIndex];
    if (target.hand.length === 1 && !this.unoShouted[targetIndex]) {
      const c1 = this.drawCardFromDeck();
      const c2 = this.drawCardFromDeck();
      target.hand.push(c1, c2);
      if (target.hand.length !== 1) this.unoShouted[targetIndex] = false;
      this.logAction(`⚖️ Flagrante! ${target.name} esqueceu de gritar "COMPANHEIRO!" e comprou 2 cartas de penalidade!`);
      if (window.soundManager) window.soundManager.playSkipGavel();
      this.notifyState();
      return true;
    }
    return false;
  }

  getNextPlayer(steps = 1) {
    const n = this.players.length;
    let nextIdx = (this.currentTurn + this.direction * steps) % n;
    if (nextIdx < 0) nextIdx += n;
    return this.players[nextIdx];
  }

  advanceTurn(steps = 1) {
    const n = this.players.length;
    this.currentTurn = (this.currentTurn + this.direction * steps) % n;
    if (this.currentTurn < 0) this.currentTurn += n;
    this.hasDrawnThisTurn = false;

    this.notifyState();

    // If next player is bot, trigger AI turn
    if (!this.isGameOver && !this.players[this.currentTurn].isHuman) {
      setTimeout(() => this.executeBotTurn(), 900 + Math.random() * 500);
    }
  }

  executeBotTurn() {
    if (this.isGameOver) return;
    const bot = this.players[this.currentTurn];
    if (bot.isHuman) return;

    // Check if bot can call out any human who forgot "Companheiro"
    const human = this.players[0];
    if (human.hand.length === 1 && !this.unoShouted[0]) {
      this.challengeCompanheiro(bot.id, 0);
    }

    const playable = this.getPlayableCards(bot.id);

    if (playable.length > 0) {
      // Smart card selection:
      // 1. If someone is at 1 card, try to use +2, +4, Skip, or Reverse
      // 2. Otherwise play colored numbers or actions
      // 3. Keep wilds for last unless needed
      let chosenCard = null;
      const nextPlayer = this.getNextPlayer();
      const nextIsThreat = nextPlayer.hand.length <= 2;

      if (nextIsThreat) {
        chosenCard = playable.find(c => c.type === CardTypes.WILD_DRAW_FOUR || c.type === CardTypes.DRAW_TWO || c.type === CardTypes.SKIP);
      }

      if (!chosenCard) {
        // Prefer matching color non-wild
        chosenCard = playable.find(c => c.color === this.currentColor && c.color !== CardColors.WILD);
      }

      if (!chosenCard) {
        // Any non-wild playable
        chosenCard = playable.find(c => c.color !== CardColors.WILD);
      }

      if (!chosenCard) {
        // Play wild
        chosenCard = playable[0];
      }

      this.playCard(bot.id, chosenCard.id);
    } else {
      // Must draw
      const drawn = this.drawCard(bot.id);
      if (drawn && this.isCardPlayable(drawn)) {
        setTimeout(() => {
          if (this.currentTurn === bot.id) {
            this.playCard(bot.id, drawn.id);
          }
        }, 500);
      } else {
        setTimeout(() => {
          if (this.currentTurn === bot.id) {
            this.passTurn(bot.id);
          }
        }, 400);
      }
    }
  }

  handleGameOver(winner) {
    this.isGameOver = true;
    this.winner = winner;
    this.logAction(`🏆 FIM DE JOGO! O companheiro(a) ${winner.name} venceu a partida!`);
    if (window.soundManager) window.soundManager.playVictory();
    this.notifyState();
  }

  getCardName(card) {
    if (!card) return '';
    return card.name || `${card.value} ${ColorNamesPt[card.color] || ''}`;
  }

  logAction(msg) {
    this.turnHistory.unshift({ text: msg, time: new Date().toLocaleTimeString() });
    if (this.turnHistory.length > 50) this.turnHistory.pop();
    this.onActionLog(msg);
  }

  notifyState() {
    this.onStateChange({
      players: this.players,
      currentTurn: this.currentTurn,
      hasDrawnThisTurn: this.hasDrawnThisTurn,
      currentCard: this.currentCard,
      currentColor: this.currentColor,
      direction: this.direction,
      deckCount: this.deck.length,
      discardCount: this.discardPile.length,
      isGameOver: this.isGameOver,
      winner: this.winner,
      waitingForColorSelection: this.waitingForColorSelection,
      waitingForSigiloSelection: this.waitingForSigiloSelection,
      fazOLActive: this.fazOLActive,
      unoShouted: this.unoShouted
    });
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UnoGame };
} else {
  window.UnoGame = UnoGame;
}
