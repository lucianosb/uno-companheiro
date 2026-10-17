# 🎴 UNO COMPANHEIRO (Edição Especial Lula)

Uma versão web jogável, interativa e bem-humorada do UNO inspirada no Presidente Lula e na política brasileira contemporânea, com design fiel ao baralho físico e todas as cartas e regras personalizadas implementadas!

> 🤖 **Desenvolvido com o auxílio do Gemini 3.8 (Google DeepMind)**.

---

## ⚡ Como Jogar (Sem Instalar Nada!)

Este projeto é **100% estático** (HTML5, CSS3, JavaScript puro e gráficos vetoriais em SVG gerados via código). **Não necessita de Python, Node.js, banco de dados ou processo de compilação!**

Você pode jogar de três formas:

1. **Direto no Navegador (Offline / Local)**:
   - Dê um duplo clique no arquivo [`index.html`](index.html).
2. **Online via GitHub Pages**:
   - Ative o **GitHub Pages** nas configurações do repositório apontando para a branch `main` e raiz `/`. O jogo rodará instantaneamente pelo link público em computadores e celulares.
3. **Servidor Local Opcional (Python)**:
   - *Nota:* O Python **não é obrigatório**. Caso você já tenha o Python instalado e prefira servir via HTTP local por costume de desenvolvimento:
     ```bash
     python -m http.server 8000
     ```
     E abra `http://localhost:8000`.

---

## ⌨️ Teclas de Atalho

Para uma jogabilidade ágil e sem depender apenas do mouse, você pode usar os seguintes atalhos no teclado:

| Tecla | Ação | Descrição |
| :---: | :--- | :--- |
| <kbd>C</kbd> | **Gritar COMPANHEIRO!** | Anuncia que você ficou com apenas 1 carta restante. |
| <kbd>N</kbd> | **Passar a Vez** | Passa o turno para o próximo companheiro caso não possa jogar. |
| <kbd>M</kbd> *(ou Espaço)* | **Comprar Carta** | Compra uma carta da pilha de compras. |
| <kbd>L</kbd> | **FAZ O L!** | Dispara o gesto no evento rápido (*Quick-Time Event*). |
| <kbd>F</kbd> | **Fiscalizar** | Penaliza adversários que esqueceram de gritar *"COMPANHEIRO!"*. |
| <kbd>Esc</kbd> | **Fechar Modais** | Fecha telas de regras, sigilo quebrado e seleção. |

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
  - *Efeito*: Assim que a carta é jogada na mesa, ativa um evento de reflexo rápido (*Quick-Time Event*). Todos os jogadores devem fazer o sinal do "L" com a mão (clicando no botão ou apertando a tecla <kbd>L</kbd>). O último a reagir compra 2 cartas de penalidade! Quem jogou ainda escolhe a nova cor.
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
1. **Companheiro(a)** 🧑 — O jogador humano.
2. **Fernando Haddad** 📚 — O Ministro das Cartas e da Fazenda.
3. **Geraldo Alckmin** 🥣 — O Vice-Presidente paciente e moderado.
4. **Janja Lula da Silva** ✨ — A Primeira-Dama socióloga e animada.

Cada bot possui falas temáticas, tempos de reação simulados no *"Faz o L!"* e estratégias de descarte!
