/**
 * UNO COMPANHEIRO - Main Application Controller
 * Handles UI events, SVG rendering, animations, Quick-Time Events, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  let game = null;
  let selectedWildCard = null;
  let selectedSigiloTarget = 1; // Default Haddad
  let chosenSigiloColor = CardColors.RED;
  let pendingColorCallback = null;

  // DOM Elements
  const deckPileEl = document.getElementById('deck-pile');
  const discardCardEl = document.getElementById('discard-card');
  const userCardsContainer = document.getElementById('user-cards-container');
  const userCardCountEl = document.getElementById('user-card-count');
  const activeColorPill = document.getElementById('active-color-pill');
  const colorNameText = document.getElementById('color-name-text');
  const colorDot = document.getElementById('color-dot');
  const directionArrows = document.getElementById('direction-arrows');
  const directionText = document.getElementById('direction-text');
  
  // Opponent slots
  const opponentSlots = {
    1: document.getElementById('opponent-1'),
    2: document.getElementById('opponent-2'),
    3: document.getElementById('opponent-3')
  };

  // Modals
  const colorModal = document.getElementById('color-picker-modal');
  const fazOLModal = document.getElementById('faz-o-l-modal');
  const sigiloModal = document.getElementById('sigilo-modal');
  const rulesModal = document.getElementById('rules-modal');
  const winModal = document.getElementById('win-modal');

  // Controls
  const btnMute = document.getElementById('btn-mute');
  const btnRules = document.getElementById('btn-rules');
  const btnRestart = document.getElementById('btn-restart');
  const btnDraw = document.getElementById('btn-draw-card');
  const btnPass = document.getElementById('btn-pass-turn');
  const btnCompanheiro = document.getElementById('btn-shout-companheiro');
  const btnChallenge = document.getElementById('btn-challenge-uno');
  const toastNotification = document.getElementById('action-toast');

  // Faz o L QTE elements
  const btnFazOL = document.getElementById('btn-faz-o-l-action');
  const fazOLTimerText = document.getElementById('faz-o-l-timer');
  const fazOLRankingList = document.getElementById('faz-o-l-ranking-list');

  // Init Game
  function init() {
    game = new UnoGame({
      onStateChange: renderGameState,
      onActionLog: showToastNotification,
      onColorPrompt: handleColorPrompt,
      onFazOLTrigger: handleFazOLTrigger,
      onSigiloTrigger: handleSigiloTrigger
    });
    window.game = game;

    attachEventListeners();
    game.startNewGame();
    populateRulesModal();
  }

  function attachEventListeners() {
    // Sound toggle
    btnMute.addEventListener('click', () => {
      const isMuted = window.soundManager.toggleMute();
      btnMute.innerHTML = isMuted ? '🔇 Mudo' : '🔊 Som';
    });

    // Rules modal
    btnRules.addEventListener('click', () => {
      openModal(rulesModal);
    });

    document.querySelectorAll('.close-modal-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal-backdrop');
        if (modal) closeModal(modal);
      });
    });

    // Restart
    btnRestart.addEventListener('click', () => {
      game.startNewGame();
    });

    // Draw card
    btnDraw.addEventListener('click', () => {
      if (game.currentTurn === 0 && !game.isGameOver) {
        game.drawCard(0);
      }
    });

    // Deck pile click to draw
    deckPileEl.addEventListener('click', () => {
      if (game.currentTurn === 0 && !game.isGameOver) {
        game.drawCard(0);
      }
    });

    // Pass turn
    btnPass.addEventListener('click', () => {
      if (game.currentTurn === 0 && !game.isGameOver) {
        game.passTurn(0);
      }
    });

    // Shout Companheiro
    btnCompanheiro.addEventListener('click', () => {
      if (!game.isGameOver) {
        game.shoutCompanheiro(0);
        const userBubble = document.getElementById('user-speech-bubble');
        if (userBubble) {
          userBubble.textContent = 'COMPANHEIRO! É só mais uma pra vitória!';
          userBubble.classList.add('show');
          clearTimeout(userBubble._timer);
          userBubble._timer = setTimeout(() => userBubble.classList.remove('show'), 3200);
        }
      }
    });

    // Challenge Companheiro
    btnChallenge.addEventListener('click', () => {
      if (!game.isGameOver) {
        let challenged = false;
        // Check opponents 1, 2, 3
        [1, 2, 3].forEach(botId => {
          if (!challenged && game.players[botId].hand.length === 1 && !game.unoShouted[botId]) {
            game.challengeCompanheiro(0, botId);
            challenged = true;
          }
        });
        const userBubble = document.getElementById('user-speech-bubble');
        if (!challenged) {
          showToastNotification('Nenhum adversário pendente de fiscalização!');
        } else if (userBubble) {
          userBubble.textContent = 'Fiscalização atuante! Pega no pulo sem gritar Companheiro!';
          userBubble.classList.add('show');
          clearTimeout(userBubble._timer);
          userBubble._timer = setTimeout(() => userBubble.classList.remove('show'), 3200);
        }
      }
    });

    // Color picker buttons
    document.querySelectorAll('.color-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        closeModal(colorModal);
        if (pendingColorCallback) {
          pendingColorCallback(color);
          pendingColorCallback = null;
        } else if (selectedWildCard) {
          game.playCard(0, selectedWildCard.id, color);
          selectedWildCard = null;
        }
      });
    });

    // Sigilo Quebrado confirm button
    document.getElementById('btn-confirm-sigilo').addEventListener('click', () => {
      closeModal(sigiloModal);
      if (pendingColorCallback) {
        pendingColorCallback(selectedSigiloTarget, chosenSigiloColor);
        pendingColorCallback = null;
      }
    });

    // Keyboard Shortcuts: C (Companheiro), N (Passar), M / Espaço (Comprar), L (Faz o L), F (Fiscalizar)
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toLowerCase();

      if (key === 'l') {
        if (fazOLModal.classList.contains('open')) {
          e.preventDefault();
          btnFazOL.click();
        }
      } else if (key === 'm' || e.code === 'Space') {
        if (game.currentTurn === 0 && !game.isGameOver && !isAnyModalOpen()) {
          e.preventDefault();
          game.drawCard(0);
        }
      } else if (key === 'n') {
        if (game.currentTurn === 0 && !game.isGameOver && !isAnyModalOpen()) {
          e.preventDefault();
          game.passTurn(0);
        }
      } else if (key === 'c') {
        if (!isAnyModalOpen()) {
          e.preventDefault();
          game.shoutCompanheiro(0);
        }
      } else if (key === 'f') {
        if (!isAnyModalOpen()) {
          e.preventDefault();
          btnChallenge.click();
        }
      } else if (e.key === 'Escape') {
        closeAllModals();
      }
    });
  }

  function isAnyModalOpen() {
    return document.querySelector('.modal-backdrop.open') !== null;
  }

  function openModal(modal) {
    if (modal) modal.classList.add('open');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('open');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
  }

  function showToastNotification(text) {
    if (!toastNotification) return;
    toastNotification.textContent = text;
    toastNotification.style.display = 'flex';
    clearTimeout(toastNotification._timer);
    toastNotification._timer = setTimeout(() => {
      toastNotification.style.display = 'none';
    }, 4000);
  }

  /**
   * Render state onto the DOM
   */
  function renderGameState(state) {
    // 1. Render Discard Card
    if (state.currentCard) {
      discardCardEl.innerHTML = CardRenderer.renderSVG(state.currentCard, { width: 140, height: 210 });
    }

    // 2. Render Deck Stack
    deckPileEl.querySelector('.top-deck-card').innerHTML = CardRenderer.renderCardBackSVG(140, 210);

    // 3. Render Active Color
    const activeColor = state.currentColor || CardColors.RED;
    colorDot.style.backgroundColor = ColorHex[activeColor];
    colorNameText.textContent = ColorNamesPt[activeColor] || 'Vermelho';
    activeColorPill.style.borderColor = ColorHex[activeColor];

    // 4. Render Direction
    if (state.direction === 1) {
      directionArrows.classList.remove('reverse');
      directionText.textContent = 'Sentido Horário';
    } else {
      directionArrows.classList.add('reverse');
      directionText.textContent = 'Sentido Anti-Horário';
    }

    // 5. Render Opponents (1, 2, 3)
    [1, 2, 3].forEach(id => {
      const slot = opponentSlots[id];
      const player = state.players[id];
      if (!slot || !player) return;

      // Active turn highlight
      if (state.currentTurn === id) {
        slot.classList.add('active-turn');
      } else {
        slot.classList.remove('active-turn');
      }

      // Card count
      const countBadge = slot.querySelector('.cards-badge');
      if (countBadge) {
        countBadge.textContent = `${player.hand.length} cartas`;
        if (player.hand.length === 1) {
          countBadge.textContent = '1 CARTA (COMPANHEIRO!)';
          countBadge.style.background = '#ef4444';
        } else {
          countBadge.style.background = '#dc2626';
        }
      }

      // Card fan back SVGs
      const fanContainer = slot.querySelector('.opponent-cards-fan');
      if (fanContainer) {
        const miniCount = Math.min(player.hand.length, 12);
        let fanHTML = '';
        for (let i = 0; i < miniCount; i++) {
          fanHTML += `<div class="mini-card-back">${CardRenderer.renderCardBackSVG(44, 66)}</div>`;
        }
        fanContainer.innerHTML = fanHTML;
      }

      // Show speech bubble during bot's turn with random quote
      const bubble = slot.querySelector('.speech-bubble');
      if (bubble) {
        if (state.currentTurn === id) {
          if (slot._lastTurnId !== state.currentTurn) {
            slot._lastTurnId = state.currentTurn;
            const quotes = player.quotes || [player.quote];
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            bubble.textContent = randomQuote;
            bubble.classList.add('show');
            clearTimeout(bubble._timer);
            bubble._timer = setTimeout(() => bubble.classList.remove('show'), 2800);
          }
        } else {
          slot._lastTurnId = null;
          bubble.classList.remove('show');
        }
      }
    });

    // 6. Render Human Player Hand (id 0)
    const user = state.players[0];
    userCardCountEl.textContent = `${user.hand.length} cartas`;
    const userSection = document.getElementById('user-hand-section');
    const userBubble = document.getElementById('user-speech-bubble');

    if (state.currentTurn === 0) {
      userSection.classList.add('active-turn');
      if (userBubble && userSection._lastTurnId !== state.currentTurn) {
        userSection._lastTurnId = state.currentTurn;
        const quotes = user.quotes || [user.quote];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        userBubble.textContent = randomQuote;
        userBubble.classList.add('show');
        clearTimeout(userBubble._timer);
        userBubble._timer = setTimeout(() => userBubble.classList.remove('show'), 3500);
      }
    } else {
      userSection.classList.remove('active-turn');
      userSection._lastTurnId = null;
      if (userBubble) userBubble.classList.remove('show');
    }

    // Render cards
    userCardsContainer.innerHTML = '';
    const handSize = user.hand.length;
    let overlapMargin = -52;
    if (handSize > 9) {
      overlapMargin = Math.max(-78, -52 - (handSize - 9) * 3);
    } else if (handSize < 6) {
      overlapMargin = -36;
    }

    user.hand.forEach((card, index) => {
      const cardWrapper = document.createElement('div');
      cardWrapper.className = 'player-card-item';
      cardWrapper.style.zIndex = index + 1;
      if (index > 0) {
        cardWrapper.style.marginLeft = `${overlapMargin}px`;
      }

      const isPlayable = (state.currentTurn === 0 && game.isCardPlayable(card));
      if (isPlayable) {
        cardWrapper.classList.add('playable');
      } else {
        cardWrapper.classList.add('not-playable');
      }

      cardWrapper.innerHTML = CardRenderer.renderSVG(card, { width: 130, height: 195 });

      cardWrapper.addEventListener('click', () => {
        if (!isPlayable || game.isGameOver) return;
        handleUserCardClick(card);
      });

      userCardsContainer.appendChild(cardWrapper);
    });

    // Button states
    btnPass.style.display = (state.currentTurn === 0) ? 'inline-flex' : 'none';
    
    // Check if any opponent is vulnerable to Companheiro challenge
    const hasVulnerable = [1, 2, 3].some(botId => state.players[botId].hand.length === 1 && !state.unoShouted[botId]);
    btnChallenge.style.opacity = hasVulnerable ? '1' : '0.6';

    // Game Over Check
    if (state.isGameOver && state.winner) {
      showGameOverModal(state.winner);
    }
  }

  function handleUserCardClick(card) {
    if (card.color === CardColors.WILD) {
      if (card.type === CardTypes.WILD_SIGILO) {
        // Hand swap will prompt selection
        game.playCard(0, card.id);
      } else {
        // Prompt color selection first
        selectedWildCard = card;
        openModal(colorModal);
      }
    } else {
      game.playCard(0, card.id);
    }
  }

  function handleColorPrompt(card, callback) {
    pendingColorCallback = callback;
    openModal(colorModal);
  }

  /**
   * 🤟 Quick-Time Event: "Faz o L!"
   */
  function handleFazOLTrigger({ initiator, onComplete }) {
    openModal(fazOLModal);
    fazOLRankingList.innerHTML = '<div style="color: #cbd5e1; text-align: center;">Aguardando os companheiros...</div>';
    
    const startTime = performance.now();
    let userReacted = false;
    let userReactionTime = null;
    let timerInterval = null;

    // Tick the millisecond timer live
    timerInterval = setInterval(() => {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(3);
      fazOLTimerText.textContent = `${elapsed}s`;
    }, 20);

    // Simulated reaction times for bots
    // Realistic reaction speeds: Janja (450-1100ms), Haddad (650-1350ms), Alckmin (850-1750ms)
    const botTimes = {
      1: (650 + Math.random() * 700) / 1000,
      2: (850 + Math.random() * 900) / 1000,
      3: (450 + Math.random() * 650) / 1000
    };

    const reactions = [];

    const finishQTE = () => {
      clearInterval(timerInterval);
      btnFazOL.disabled = true;

      // Add bots
      [1, 2, 3].forEach(botId => {
        reactions.push({
          id: botId,
          name: game.players[botId].name,
          time: botTimes[botId],
          isHuman: false
        });
      });

      // Add human
      reactions.push({
        id: 0,
        name: 'Companheiro(a)',
        time: userReactionTime || 3.0,
        isHuman: true
      });

      // Sort by fastest
      reactions.sort((a, b) => a.time - b.time);

      // Render leaderboard
      let rankingHTML = '';
      reactions.forEach((entry, idx) => {
        const isSlowest = (idx === reactions.length - 1);
        rankingHTML += `
          <div class="ranking-item ${isSlowest ? 'slowest' : ''}">
            <span>${idx + 1}º ${entry.name} ${entry.isHuman ? '👈' : ''}</span>
            <span><strong>${entry.time.toFixed(3)}s</strong> ${isSlowest ? '🚨 (+2 CARTAS)' : '✅'}</span>
          </div>
        `;
      });
      fazOLRankingList.innerHTML = rankingHTML;

      const slowest = reactions[reactions.length - 1];

      if (slowest.id === 0) {
        if (window.soundManager) window.soundManager.playFazOLFail();
      } else {
        if (window.soundManager) window.soundManager.playFazOLSuccess();
      }

      // Automatically close modal after 3 seconds
      setTimeout(() => {
        closeModal(fazOLModal);
        btnFazOL.disabled = false;
        onComplete(slowest.id);
      }, 3200);
    };

    // User click button
    btnFazOL.onclick = () => {
      if (userReacted) return;
      userReacted = true;
      userReactionTime = (performance.now() - startTime) / 1000;
      btnFazOL.style.transform = 'scale(0.95)';
      btnFazOL.innerHTML = 'FEZ O L! 🤟<br><span style="font-size:12px">Registrado!</span>';
      
      // Complete when all have finished
      setTimeout(finishQTE, 600);
    };

    // Auto timeout if user does not react within 2.5s
    setTimeout(() => {
      if (!userReacted) {
        userReactionTime = 2.5;
        finishQTE();
      }
    }, 2500);
  }

  /**
   * 📂 "Sigilo Quebrado" Hand Spy & Swap Modal
   */
  function handleSigiloTrigger(player, callback) {
    pendingColorCallback = callback;
    openModal(sigiloModal);

    const targetsContainer = document.getElementById('sigilo-targets-container');
    const spyContainer = document.getElementById('sigilo-spy-cards');
    targetsContainer.innerHTML = '';
    spyContainer.innerHTML = '';

    // Generate opponent target cards
    [1, 2, 3].forEach(botId => {
      const bot = game.players[botId];
      const cardEl = document.createElement('div');
      cardEl.className = 'sigilo-target-card';
      if (botId === selectedSigiloTarget) cardEl.classList.add('selected');

      cardEl.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 4px;">${bot.avatar}</div>
        <div style="font-weight: 700; color: #fef08a; font-size: 13px;">${bot.name}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">${bot.hand.length} cartas na mão</div>
        <button class="btn btn-warning" style="margin-top: 8px; width: 100%; font-size: 11px; padding: 4px 8px;">Espiar Cartas</button>
      `;

      cardEl.addEventListener('click', () => {
        document.querySelectorAll('.sigilo-target-card').forEach(c => c.classList.remove('selected'));
        cardEl.classList.add('selected');
        selectedSigiloTarget = botId;

        // Reveal this opponent's hand face up!
        spyContainer.innerHTML = '';
        bot.hand.forEach(c => {
          const mini = document.createElement('div');
          mini.style.width = '60px';
          mini.style.height = '90px';
          mini.style.flexShrink = '0';
          mini.innerHTML = CardRenderer.renderSVG(c, { width: 60, height: 90 });
          spyContainer.appendChild(mini);
        });
      });

      targetsContainer.appendChild(cardEl);
    });

    // Auto select first opponent to reveal hand immediately
    const firstTarget = targetsContainer.querySelector('.sigilo-target-card');
    if (firstTarget) firstTarget.click();

    // Color buttons inside sigilo modal
    document.querySelectorAll('.sigilo-color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sigilo-color-btn').forEach(b => b.style.outline = 'none');
        btn.style.outline = '3px solid #ffffff';
        chosenSigiloColor = btn.getAttribute('data-color');
      });
    });
  }

  function showGameOverModal(winner) {
    openModal(winModal);
    const winTitle = document.getElementById('win-title');
    const winText = document.getElementById('win-text');
    const winAvatar = document.getElementById('win-avatar');

    if (winner.id === 0) {
      winTitle.textContent = '🎉 VITÓRIA COMPANHEIRO(A)!';
      winText.textContent = 'Você venceu a mesa com união e companheirismo!';
      winAvatar.textContent = '🏆';
    } else {
      winTitle.textContent = `VITÓRIA DE ${winner.name.toUpperCase()}!`;
      const winQuotes = winner.quotes || [winner.quote];
      const winQuote = winQuotes[Math.floor(Math.random() * winQuotes.length)];
      winText.textContent = `"${winQuote}"`;
      winAvatar.textContent = winner.avatar;
    }

    document.getElementById('btn-play-again').onclick = () => {
      closeModal(winModal);
      game.startNewGame();
    };
  }

  /**
   * Populate Rules Modal with exact descriptions from prompt
   */
  function populateRulesModal() {
    const rulesList = document.getElementById('rules-list-container');
    if (!rulesList) return;

    const customCards = [
      {
        card: { type: CardTypes.REVERSE, color: CardColors.RED },
        title: '🔄 "Companheiras e Companheiros!" (Inverter / Reverse)',
        effect: 'Inverte o sentido do jogo.',
        desc: '"Muda a direção do discurso e faz a roda girar para o outro lado!"'
      },
      {
        card: { type: CardTypes.SKIP, color: CardColors.BLUE },
        title: '🚫 "Recesso da Mesa" (Bloqueio / Skip)',
        effect: 'Pula a vez do próximo jogador.',
        desc: '"O colega da frente entra em recesso e perde o turno."'
      },
      {
        card: { type: CardTypes.DRAW_TWO, color: CardColors.RED, value: '+2' },
        title: '🥩 "Picanha e Cervejinha" (Carta +2)',
        effect: 'O próximo jogador deve comprar 2 cartas da pilha.',
        desc: '"Uma fartura de cartas direto para a mão do adversário!"'
      },
      {
        card: { type: CardTypes.WILD_DRAW_FOUR, color: CardColors.WILD, value: '+4' },
        title: '🛍️ "Bolsa Família" (Coringa +4)',
        effect: 'Escolhe a nova cor da mesa e faz o próximo participante comprar 4 cartas.',
        desc: '"Promove a redistribuição de cartas na mesa!"'
      },
      {
        card: { type: CardTypes.WILD_FAZ_O_L, color: CardColors.WILD, value: 'L' },
        title: '🤟 "Faz o L!" (Carta de Ação Rápida)',
        effect: 'Assim que a carta é jogada na mesa, todos os jogadores devem fazer o sinal do "L" com a mão (clique ou aperte a tecla L). O último jogador a fazer o gesto compra 2 cartas. Quem jogou a carta ainda escolhe a nova cor do jogo.',
        desc: 'Ação rápida e adrenalina para ver quem faz o L mais rápido!'
      },
      {
        card: { type: CardTypes.WILD_SIGILO, color: CardColors.WILD, value: '📂' },
        title: '📂 "Sigilo Quebrado" (Coringa de Troca de Mão)',
        effect: 'Permite olhar a mão de qualquer oponente à sua escolha e trocar todo o seu baralho com ele.',
        desc: '"Tudo transparente e às claras na mesa!"'
      },
      {
        card: { type: CardTypes.STAR_13, color: CardColors.YELLOW, value: 13 },
        title: '⭐ "13" (Carta Estrela PT)',
        effect: 'Carta de valor 13 com a Estrela Vermelha icônica.',
        desc: 'Jogue sobre outra carta 13 ou sobre a cor correspondente!'
      }
    ];

    let html = '';
    customCards.forEach(item => {
      html += `
        <div class="rule-card-item">
          <div class="rule-card-img">
            ${CardRenderer.renderSVG(item.card, { width: 70, height: 105 })}
          </div>
          <div class="rule-content">
            <h4>${item.title}</h4>
            <p><strong>Efeito:</strong> ${item.effect}</p>
            <p class="rule-quote">${item.desc}</p>
          </div>
        </div>
      `;
    });

    rulesList.innerHTML = html;
  }

  // Start app
  init();
});
