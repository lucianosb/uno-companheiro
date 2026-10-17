# 🎴 UNO COMPANHEIRO (Edição Especial Lula)

Uma versão web jogável, interativa e bem-humorada do UNO inspirado no Presidente Lula e na política brasileira contemporânea, com design fiel ao baralho físico da foto e todas as cartas e regras personalizadas implementadas!

---

## 📸 Design e Cartas Especiais

### 🔄 Cartas de Ação
- **"Companheiras e Companheiros!" (Inverter / Reverse)**:
  - *Efeito*: Inverte o sentido do jogo (horário ⇄ anti-horário).
  - *Descrição*: *"Muda a direção do discurso e faz a roda girar para o outro lado!"*
  - *Ilustração*: Lula discursando no púlpito presidencial com microfones duplos.
- **🚫 "Recesso da Mesa" (Bloqueio / Skip)**:
  - *Efeito*: Pula a vez do próximo jogador.
  - *Descrição*: *"O colega da frente entra em recesso e perde o turno."*
  - *Ilustração*: Mesa diretora com poltrona presidencial estofada em couro azul e brasão da República.
- **🥩 "Picanha e Cervejinha" (Carta +2)**:
  - *Efeito*: O próximo jogador deve comprar 2 cartas da pilha e perde a vez.
  - *Descrição*: *"Uma fartura de cartas direto para a mão do adversário!"*
  - *Ilustração*: Picanha suculenta na grelha acompanhada de um copo de cerveja gelada com colarinho de espuma.

### 🌟 Cartas Coringas e Especiais
- **🛍️ "Bolsa Família" (Coringa +4)**:
  - *Efeito*: Escolhe a nova cor da mesa e faz o próximo participante comprar 4 cartas da pilha e perder a vez.
  - *Descrição*: *"Promove a redistribuição de cartas na mesa!"*
  - *Ilustração*: Quatro blocos coloridos estilizados com a família brasileira.
- **🤟 "Faz o L!" (Carta de Ação Rápida)**:
  - *Efeito*: Assim que a carta é jogada na mesa, ativa um evento de reflexo rápido (*Quick-Time Event*). Todos os jogadores devem fazer o sinal do "L" com a mão (clicando no botão pulsante ou pressionando a tecla **L**). O último a reagir compra 2 cartas de penalidade! Quem jogou ainda escolhe a nova cor.
  - *Ilustração*: Lula sorridente fazendo o gesto do "L" com aro nas cores da bandeira do Brasil.
- **📂 "Sigilo Quebrado" (Coringa de Troca de Mão)**:
  - *Efeito*: Permite espiar a mão completa de qualquer oponente à escolha e trocar todo o seu baralho com ele!
  - *Descrição*: *"Tudo transparente e às claras na mesa!"*
  - *Ilustração*: Pasta de dossiê confidencial aberta com documentos revelados, carimbo oficial e lupa de investigação.
- **⭐ Carta "13" (Estrela PT)**:
  - *Efeito*: Carta especial de valor 13 com a Estrela Vermelha central, jogável por cor ou sobre outro 13!

---

## 👥 Jogadores e Inteligência Artificial

A partida é disputada entre 4 participantes:
1. **Você (Companheiro)** — O jogador humano.
2. **Fernando Haddad** 📚 — O Ministro das Cartas e da Fazenda.
3. **Geraldo Alckmin** 🥣 — O Vice-Presidente paciente e moderado.
4. **Janja Lula da Silva** ✨ — A Primeira-Dama socióloga e animada.

Cada bot possui falas temáticas, tempos de reação humanos no "Faz o L!" e estratégia própria de descarte!

---

## ⌨️ Atalhos de Teclado
- **Barra de Espaço**: Comprar carta da pilha.
- **Tecla L**: Fazer o "L" rapidamente no evento surpresa!
- **Tecla C**: Gritar *"COMPANHEIRO!"* quando estiver com 1 carta restante.
- **Tecla Esc**: Fechar janelas e modais.

---

## 🚀 Como Jogar

Basta abrir o arquivo `index.html` em qualquer navegador web moderno:
- **Opção 1**: Dê um duplo clique no arquivo [`index.html`](index.html).
- **Opção 2**: Execute um servidor HTTP local via terminal:
  ```bash
  python -m http.server 8000
  ```
  E acesse `http://localhost:8000` no seu navegador.
