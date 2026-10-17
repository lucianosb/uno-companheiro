/**
 * UNO COMPANHEIRO - Card Definitions and Vector SVG Generator
 * Faithfully recreating the design shown in the physical game deck.
 */

const CardColors = {
  RED: 'red',
  BLUE: 'blue',
  GREEN: 'green',
  YELLOW: 'yellow',
  WILD: 'wild'
};

const ColorHex = {
  red: '#dc2626',
  blue: '#0284c7',
  green: '#16a34a',
  yellow: '#eab308',
  wild: '#18181b'
};

const ColorNamesPt = {
  red: 'Vermelho',
  blue: 'Azul',
  green: 'Verde',
  yellow: 'Amarelo',
  wild: 'Coringa'
};

const CardTypes = {
  NUMBER: 'number',
  STAR_13: 'star_13',
  REVERSE: 'reverse',       // "Companheiras e Companheiros!"
  SKIP: 'skip',             // "Recesso da Mesa"
  DRAW_TWO: 'draw_two',     // "Picanha e Cervejinha"
  WILD_DRAW_FOUR: 'wild_draw_four', // "Bolsa Família"
  WILD_FAZ_O_L: 'wild_faz_o_l',     // "Faz o L!"
  WILD_SIGILO: 'wild_sigilo'        // "Sigilo Quebrado"
};

class CardRenderer {
  /**
   * Generates complete standalone SVG string for a given card object.
   */
  static renderSVG(card, options = {}) {
    const width = options.width || 240;
    const height = options.height || 360;
    const isBack = options.isBack || false;

    if (isBack) {
      return CardRenderer.renderCardBackSVG(width, height);
    }

    const colorHex = ColorHex[card.color] || ColorHex.wild;
    const cornerSymbol = CardRenderer.getCornerSymbol(card);
    const cornerSymbolBottom = CardRenderer.getCornerSymbolBottom(card);
    const centerIllustration = CardRenderer.getCenterIllustration(card);
    const headerBanner = CardRenderer.getHeaderBanner(card);

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360" width="${width}" height="${height}" class="uno-card-svg">
        <defs>
          <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3"/>
          </filter>
          <filter id="inner-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fef08a" />
            <stop offset="50%" stop-color="#eab308" />
            <stop offset="100%" stop-color="#ca8a04" />
          </linearGradient>
          <linearGradient id="beer-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fde047" />
            <stop offset="70%" stop-color="#f59e0b" />
            <stop offset="100%" stop-color="#d97706" />
          </linearGradient>
          <linearGradient id="meat-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#991b1b" />
            <stop offset="40%" stop-color="#7f1d1d" />
            <stop offset="80%" stop-color="#581c1c" />
            <stop offset="100%" stop-color="#450a0a" />
          </linearGradient>
        </defs>

        <!-- Base Card White Border -->
        <rect x="4" y="4" width="232" height="352" rx="20" fill="#ffffff" stroke="#d4d4d8" stroke-width="2"/>

        <!-- Colored Inner Body -->
        <rect x="12" y="12" width="216" height="336" rx="14" fill="${colorHex}" />

        <!-- Dynamic White Uno Swoosh / Ellipse -->
        <ellipse cx="120" cy="180" rx="90" ry="142" transform="rotate(-26 120 180)" fill="#ffffff" />

        <!-- Header Banner (if applicable) -->
        ${headerBanner}

        <!-- Top-Left Corner Symbol -->
        <g transform="translate(18, 20)">
          ${cornerSymbol}
        </g>

        <!-- Center Illustration -->
        <g id="center-art">
          ${centerIllustration}
        </g>

        <!-- Bottom-Right Inverted Corner Symbol -->
        <g transform="translate(222, 340) rotate(180)">
          ${cornerSymbolBottom}
        </g>
      </svg>
    `.trim();
  }

  /**
   * Card Back rendering exact to the photo:
   * Black card with white border, tilted red oval, yellow star at bottom,
   * 3D yellow "UNO" and curved "COMPANHEIRO" underneath!
   */
  static renderCardBackSVG(width = 240, height = 360) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 360" width="${width}" height="${height}" class="uno-card-svg card-back">
        <defs>
          <linearGradient id="back-red-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#ef4444" />
            <stop offset="50%" stop-color="#dc2626" />
            <stop offset="100%" stop-color="#991b1b" />
          </linearGradient>
        </defs>
        <!-- White border -->
        <rect x="4" y="4" width="232" height="352" rx="20" fill="#ffffff" stroke="#e4e4e7" stroke-width="2"/>
        <!-- Black interior -->
        <rect x="12" y="12" width="216" height="336" rx="14" fill="#18181b"/>

        <!-- Slanted Red Oval -->
        <ellipse cx="120" cy="180" rx="88" ry="140" transform="rotate(-28 120 180)" fill="url(#back-red-grad)" stroke="#facc15" stroke-width="4"/>

        <!-- Yellow Five-Pointed Star at the bottom of the oval -->
        <polygon points="120,248 124,258 135,258 126,265 129,275 120,269 111,275 114,265 105,258 116,258" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />

        <!-- 3D "UNO" in yellow with black & red shadow -->
        <g transform="translate(120, 162) rotate(-16)">
          <!-- Black deep shadow -->
          <text x="5" y="8" font-family="'Arial Black', Impact, sans-serif" font-size="78" font-weight="900" font-style="italic" fill="#000000" text-anchor="middle">UNO</text>
          <!-- Red accent shadow -->
          <text x="3" y="4" font-family="'Arial Black', Impact, sans-serif" font-size="78" font-weight="900" font-style="italic" fill="#991b1b" text-anchor="middle">UNO</text>
          <!-- White outer stroke -->
          <text x="0" y="0" font-family="'Arial Black', Impact, sans-serif" font-size="78" font-weight="900" font-style="italic" fill="#facc15" stroke="#ffffff" stroke-width="7" stroke-linejoin="round" text-anchor="middle">UNO</text>
          <!-- Yellow core text -->
          <text x="0" y="0" font-family="'Arial Black', Impact, sans-serif" font-size="78" font-weight="900" font-style="italic" fill="#fef08a" stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" text-anchor="middle">UNO</text>

          <!-- COMPANHEIRO arched text -->
          <text x="0" y="38" font-family="'Arial Black', Impact, sans-serif" font-size="16" font-weight="900" letter-spacing="1.5" fill="#facc15" stroke="#000000" stroke-width="3" stroke-linejoin="round" text-anchor="middle">COMPANHEIRO</text>
          <text x="0" y="38" font-family="'Arial Black', Impact, sans-serif" font-size="16" font-weight="900" letter-spacing="1.5" fill="#fef08a" text-anchor="middle">COMPANHEIRO</text>
        </g>
      </svg>
    `.trim();
  }

  /**
   * Top banner for custom named cards matching the photo badges
   */
  static getHeaderBanner(card) {
    if (card.type === CardTypes.DRAW_TWO) {
      return `
        <!-- PICANHA E CERVEJINHA banner -->
        <g transform="translate(132, 30)">
          <rect x="-68" y="-12" width="136" height="22" rx="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="10" font-weight="900" fill="#ffffff" text-anchor="middle" y="3.5" letter-spacing="0.5">
            PICANHA E CERVEJINHA
          </text>
        </g>
      `;
    }

    if (card.type === CardTypes.REVERSE) {
      return `
        <!-- COMPANHEIRAS E COMPANHEIROS banner -->
        <g transform="translate(132, 30)">
          <rect x="-82" y="-12" width="164" height="22" rx="5" fill="#dc2626" stroke="#ffffff" stroke-width="1.5"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle" y="3" letter-spacing="0.2">
            COMPANHEIRAS E COMPANHEIROS!
          </text>
        </g>
      `;
    }

    if (card.type === CardTypes.SKIP) {
      return `
        <!-- RECESSO DA MESA banner -->
        <g transform="translate(132, 30)">
          <rect x="-62" y="-12" width="124" height="22" rx="5" fill="#0284c7" stroke="#ffffff" stroke-width="1.5"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="10.5" font-weight="900" fill="#ffffff" text-anchor="middle" y="3.5" letter-spacing="0.5">
            RECESSO DA MESA
          </text>
        </g>
      `;
    }

    if (card.type === CardTypes.WILD_DRAW_FOUR) {
      return `
        <!-- BOLSA FAMÍLIA banner -->
        <g transform="translate(134, 30)">
          <rect x="-56" y="-12" width="112" height="22" rx="5" fill="#18181b" stroke="#ffffff" stroke-width="1.5"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="10.5" font-weight="900" fill="#ffffff" text-anchor="middle" y="3.5" letter-spacing="0.5">
            BOLSA FAMÍLIA
          </text>
        </g>
      `;
    }

    if (card.type === CardTypes.WILD_FAZ_O_L) {
      return `
        <!-- FAZ O L! curved banner -->
        <g transform="translate(134, 30)">
          <rect x="-48" y="-13" width="96" height="24" rx="6" fill="#18181b" stroke="#facc15" stroke-width="2"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="14" font-weight="900" fill="#facc15" text-anchor="middle" y="4" letter-spacing="0.5">
            FAZ O L!
          </text>
        </g>
      `;
    }

    if (card.type === CardTypes.WILD_SIGILO) {
      return `
        <!-- SIGILO QUEBRADO banner -->
        <g transform="translate(132, 30)">
          <rect x="-64" y="-13" width="128" height="24" rx="6" fill="#18181b" stroke="#facc15" stroke-width="2"/>
          <text font-family="'Arial Black', Impact, sans-serif" font-size="11" font-weight="900" fill="#facc15" text-anchor="middle" y="3.5" letter-spacing="0.5">
            SIGILO QUEBRADO
          </text>
        </g>
      `;
    }

    return '';
  }

  /**
   * Corner symbols (top-left)
   */
  static getCornerSymbol(card) {
    switch (card.type) {
      case CardTypes.NUMBER:
        return `
          <text x="6" y="24" font-family="'Arial Black', Impact, sans-serif" font-size="34" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linejoin="round">${card.value}</text>
          <text x="6" y="24" font-family="'Arial Black', Impact, sans-serif" font-size="34" font-weight="900" fill="#ffffff">${card.value}</text>
        `;

      case CardTypes.STAR_13:
        return `
          <text x="4" y="24" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linejoin="round">13</text>
          <text x="4" y="24" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff">13</text>
        `;

      case CardTypes.DRAW_TWO:
        return `
          <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linejoin="round">+2</text>
          <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff">+2</text>
        `;

      case CardTypes.REVERSE:
        return `
          <!-- Reverse double arrows in corner -->
          <g transform="translate(6, 4) scale(0.9)">
            <path d="M4,10 L16,2 L16,7 L26,7 C29,7 31,9 31,12 L31,16 L27,16 L27,12 C27,11 26,10 25,10 L16,10 L16,15 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>
            <path d="M28,18 L16,26 L16,21 L6,21 C3,21 1,19 1,16 L1,12 L5,12 L5,16 C5,17 6,18 7,18 L16,18 L16,13 Z" fill="#ffffff" stroke="#000000" stroke-width="2"/>
          </g>
        `;

      case CardTypes.SKIP:
        return `
          <!-- Skip prohibition sign -->
          <g transform="translate(6, 6)">
            <circle cx="14" cy="14" r="14" fill="none" stroke="#ffffff" stroke-width="5"/>
            <circle cx="14" cy="14" r="14" fill="none" stroke="#000000" stroke-width="1.5"/>
            <line x1="4" y1="24" x2="24" y2="4" stroke="#ffffff" stroke-width="5"/>
            <line x1="4" y1="24" x2="24" y2="4" stroke="#000000" stroke-width="1.5"/>
          </g>
        `;

      case CardTypes.WILD_DRAW_FOUR:
        return `
          <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linejoin="round">+4</text>
          <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff">+4</text>
        `;

      case CardTypes.WILD_FAZ_O_L:
      case CardTypes.WILD_SIGILO:
        // Segmented 4-color oval
        return CardRenderer.renderFourColorBadge(14, 16);

      default:
        return '';
    }
  }

  /**
   * Corner symbols (bottom-right inverted)
   */
  static getCornerSymbolBottom(card) {
    if (card.type === CardTypes.WILD_DRAW_FOUR) {
      return `
        <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="4" stroke-linejoin="round">+4</text>
        <text x="4" y="26" font-family="'Arial Black', Impact, sans-serif" font-size="30" font-weight="900" fill="#ffffff">+4</text>
      `;
    }
    if (card.type === CardTypes.WILD_FAZ_O_L || card.type === CardTypes.WILD_SIGILO) {
      return CardRenderer.renderFourColorBadge(14, 16);
    }
    return CardRenderer.getCornerSymbol(card);
  }

  /**
   * 4-color segmented badge for Wild cards
   */
  static renderFourColorBadge(cx, cy) {
    return `
      <g transform="translate(${cx - 14}, ${cy - 18})">
        <ellipse cx="14" cy="18" rx="14" ry="18" fill="#ffffff" stroke="#000000" stroke-width="2"/>
        <clipPath id="oval-clip-${cx}-${cy}">
          <ellipse cx="14" cy="18" rx="13" ry="17"/>
        </clipPath>
        <g clip-path="url(#oval-clip-${cx}-${cy})">
          <!-- Top Left: Red -->
          <rect x="0" y="0" width="14" height="18" fill="#dc2626"/>
          <!-- Top Right: Blue -->
          <rect x="14" y="0" width="14" height="18" fill="#0284c7"/>
          <!-- Bottom Left: Yellow -->
          <rect x="0" y="18" width="14" height="18" fill="#eab308"/>
          <!-- Bottom Right: Green -->
          <rect x="14" y="18" width="14" height="18" fill="#16a34a"/>
          <!-- Cross separator -->
          <line x1="0" y1="18" x2="28" y2="18" stroke="#18181b" stroke-width="1.5"/>
          <line x1="14" y1="0" x2="14" y2="36" stroke="#18181b" stroke-width="1.5"/>
        </g>
      </g>
    `;
  }

  /**
   * Center illustrations matching the image
   */
  static getCenterIllustration(card) {
    switch (card.type) {
      case CardTypes.NUMBER:
        return CardRenderer.renderNumberIllustration(card.value, card.color);

      case CardTypes.STAR_13:
        return CardRenderer.renderStar13Illustration();

      case CardTypes.DRAW_TWO:
        return CardRenderer.renderPicanhaCervejaIllustration();

      case CardTypes.REVERSE:
        return CardRenderer.renderLulaDiscursoIllustration();

      case CardTypes.SKIP:
        return CardRenderer.renderRecessoMesaIllustration();

      case CardTypes.WILD_DRAW_FOUR:
        return CardRenderer.renderBolsaFamiliaIllustration();

      case CardTypes.WILD_FAZ_O_L:
        return CardRenderer.renderFazOLIllustration();

      case CardTypes.WILD_SIGILO:
        return CardRenderer.renderSigiloQuebradoIllustration();

      default:
        return '';
    }
  }

  /**
   * Number Card Illustration (0-9)
   */
  static renderNumberIllustration(num, color) {
    const cHex = ColorHex[color] || '#dc2626';
    return `
      <g transform="translate(120, 195) rotate(-10)">
        <!-- Black shadow -->
        <text x="5" y="8" font-family="'Arial Black', Impact, sans-serif" font-size="120" font-weight="900" font-style="italic" fill="#18181b" text-anchor="middle">${num}</text>
        <!-- White stroke -->
        <text x="0" y="0" font-family="'Arial Black', Impact, sans-serif" font-size="120" font-weight="900" font-style="italic" fill="${cHex}" stroke="#ffffff" stroke-width="14" stroke-linejoin="round" text-anchor="middle">${num}</text>
        <!-- Color fill -->
        <text x="0" y="0" font-family="'Arial Black', Impact, sans-serif" font-size="120" font-weight="900" font-style="italic" fill="${cHex}" text-anchor="middle">${num}</text>
      </g>
    `;
  }

  /**
   * Card 13: Iconic Red Star of PT
   */
  static renderStar13Illustration() {
    return `
      <g transform="translate(120, 185)">
        <!-- Subtle shadow -->
        <polygon points="0,-72 22,-22 75,-16 35,21 47,73 0,46 -47,73 -35,21 -75,-16 -22,-22" fill="#991b1b" transform="translate(3, 4)" />
        <!-- Big Red Star -->
        <polygon points="0,-72 22,-22 75,-16 35,21 47,73 0,46 -47,73 -35,21 -75,-16 -22,-22" fill="#dc2626" stroke="#ffffff" stroke-width="6" stroke-linejoin="round"/>
        <polygon points="0,-72 22,-22 75,-16 35,21 47,73 0,46 -47,73 -35,21 -75,-16 -22,-22" fill="#dc2626" stroke="#18181b" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Star 3D bevel accents -->
        <path d="M0,-72 L0,46 L47,73 Z" fill="#b91c1c" opacity="0.4" />
        <path d="M0,46 L75,-16 L22,-22 Z" fill="#b91c1c" opacity="0.3" />
      </g>
    `;
  }

  /**
   * 🥩 "Picanha e Cervejinha" (+2)
   * Barbecue grill with thick picanha steak & tall draft beer with foam!
   */
  static renderPicanhaCervejaIllustration() {
    return `
      <g transform="translate(112, 185) scale(0.92)">
        <!-- Barbecue Grill Grate -->
        <g id="grill" transform="translate(-65, -10)">
          <!-- Grill base frame -->
          <rect x="0" y="10" width="130" height="75" rx="8" fill="#27272a" stroke="#09090b" stroke-width="3"/>
          <!-- Grill metal slats -->
          <line x1="8" y1="75" x2="35" y2="10" stroke="#52525b" stroke-width="4"/>
          <line x1="28" y1="75" x2="55" y2="10" stroke="#52525b" stroke-width="4"/>
          <line x1="48" y1="75" x2="75" y2="10" stroke="#52525b" stroke-width="4"/>
          <line x1="68" y1="75" x2="95" y2="10" stroke="#52525b" stroke-width="4"/>
          <line x1="88" y1="75" x2="115" y2="10" stroke="#52525b" stroke-width="4"/>
          <line x1="108" y1="75" x2="125" y2="35" stroke="#52525b" stroke-width="4"/>
        </g>

        <!-- Picanha Cut on Grill -->
        <g id="picanha" transform="translate(-62, -2)">
          <!-- Fat layer on top / side -->
          <path d="M12,50 C10,32 25,20 48,20 C72,20 98,28 108,44 C100,42 75,32 45,34 C25,35 15,44 12,50 Z" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
          <!-- Juicy steak meat body -->
          <path d="M15,48 C28,34 68,32 105,42 C115,58 102,76 80,78 C52,80 22,76 12,58 C10,54 12,50 15,48 Z" fill="url(#meat-grad)" stroke="#18181b" stroke-width="2.5"/>
          <!-- Charred grill marks (cross hatch) -->
          <line x1="30" y1="38" x2="48" y2="72" stroke="#18181b" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="50" y1="36" x2="68" y2="74" stroke="#18181b" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="70" y1="38" x2="88" y2="72" stroke="#18181b" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="44" y1="70" x2="72" y2="40" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
          <line x1="25" y1="60" x2="52" y2="38" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
        </g>

        <!-- Cold Draft Beer Glass (Chopp com Colarinho) -->
        <g id="beer-glass" transform="translate(38, -60)">
          <!-- Glass Body with Beer -->
          <path d="M5,25 L12,95 C13,99 18,102 26,102 C34,102 39,99 40,95 L47,25 Z" fill="url(#beer-grad)" stroke="#18181b" stroke-width="2.5"/>
          <!-- Vertical glass facets / reflections -->
          <line x1="18" y1="30" x2="22" y2="92" stroke="#ffffff" stroke-width="3.5" opacity="0.6" stroke-linecap="round"/>
          <line x1="34" y1="30" x2="31" y2="92" stroke="#d97706" stroke-width="2.5" opacity="0.6"/>
          <!-- Rising bubbles -->
          <circle cx="22" cy="75" r="2" fill="#ffffff" opacity="0.7"/>
          <circle cx="28" cy="62" r="1.5" fill="#ffffff" opacity="0.8"/>
          <circle cx="18" cy="48" r="2.5" fill="#ffffff" opacity="0.6"/>
          <circle cx="34" cy="42" r="1.5" fill="#ffffff" opacity="0.7"/>
          <!-- Frothy White Foam Head -->
          <path d="M1,26 C-2,18 6,10 14,13 C18,7 27,6 32,11 C38,7 48,11 49,18 C54,22 51,28 47,28 C40,29 10,29 1,26 Z" fill="#ffffff" stroke="#18181b" stroke-width="2.5"/>
          <path d="M47,25 C50,34 48,42 46,46 C44,48 41,45 42,38 Z" fill="#ffffff" stroke="#18181b" stroke-width="1.5"/>
          <!-- Glass Handle -->
          <path d="M47,38 C60,40 60,70 42,75" fill="none" stroke="#18181b" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M47,38 C58,40 58,70 42,75" fill="none" stroke="#fde047" stroke-width="2" stroke-linecap="round"/>
        </g>
      </g>
    `;
  }

  /**
   * 🔄 "Companheiras e Companheiros!" (Reverse)
   * Lula speaking at speech podium with two microphones!
   */
  static renderLulaDiscursoIllustration() {
    return `
      <g transform="translate(120, 185) scale(0.96)">
        <!-- Lula Behind Podium -->
        <g id="lula-speaker" transform="translate(0, -45)">
          <!-- Dark Navy Suit Torso -->
          <path d="M-40,65 Q-25,28 0,28 Q25,28 40,65 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <!-- White shirt V -->
          <polygon points="0,28 -12,50 12,50" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
          <!-- Neck -->
          <rect x="-10" y="16" width="20" height="15" fill="#fcd2b0"/>
          <!-- Head / Face -->
          <ellipse cx="0" cy="6" rx="22" ry="24" fill="#fcd2b0"/>
          <!-- Ears -->
          <ellipse cx="-23" cy="6" rx="4" ry="7" fill="#fcd2b0"/>
          <ellipse cx="23" cy="6" rx="4" ry="7" fill="#fcd2b0"/>
          <!-- White Wavy Hair -->
          <path d="M-24,-4 C-26,-22 -14,-28 0,-28 C14,-28 26,-22 24,-4 C21,-12 10,-20 0,-20 C-10,-20 -21,-12 -24,-4 Z" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5"/>
          <path d="M-23,-2 C-26,6 -23,14 -19,16" stroke="#cbd5e1" stroke-width="2.5" fill="none"/>
          <path d="M23,-2 C26,6 23,14 19,16" stroke="#cbd5e1" stroke-width="2.5" fill="none"/>
          <!-- Full White Beard & Mustache -->
          <path d="M-19,8 C-18,28 -10,33 0,33 C10,33 18,28 19,8 C14,14 6,17 0,17 C-6,17 -14,14 -19,8 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Mustache -->
          <path d="M-12,14 Q0,10 12,14 Q0,18 -12,14 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
          <!-- Smiling mouth -->
          <path d="M-6,21 Q0,26 6,21" stroke="#881337" stroke-width="2" fill="none"/>
          <!-- Eyes with smile crinkles -->
          <path d="M-14,3 Q-9,0 -4,3" stroke="#0f172a" stroke-width="2.5" fill="none"/>
          <path d="M4,3 Q9,0 14,3" stroke="#0f172a" stroke-width="2.5" fill="none"/>
          <!-- Eyebrows -->
          <path d="M-16,-3 Q-10,-7 -3,-4" stroke="#94a3b8" stroke-width="2" fill="none"/>
          <path d="M3,-4 Q10,-7 16,-3" stroke="#94a3b8" stroke-width="2" fill="none"/>
          <!-- Nose -->
          <path d="M-2,6 Q0,10 3,9" stroke="#ea580c" stroke-width="1.5" fill="none"/>
        </g>

        <!-- Gesturing Hands -->
        <g id="hands" transform="translate(0, -5)">
          <!-- Left hand gesturing -->
          <ellipse cx="-42" cy="18" rx="7" ry="11" transform="rotate(-30 -42 18)" fill="#fcd2b0" stroke="#0f172a" stroke-width="1.5"/>
          <!-- Right hand gesturing -->
          <ellipse cx="42" cy="18" rx="7" ry="11" transform="rotate(30 42 18)" fill="#fcd2b0" stroke="#0f172a" stroke-width="1.5"/>
        </g>

        <!-- Wooden Podium / Lectern -->
        <g id="podium" transform="translate(0, 15)">
          <!-- Slanted top board -->
          <polygon points="-52,0 52,0 44,14 -44,14" fill="#a16207" stroke="#451a03" stroke-width="2.5"/>
          <!-- Podium main pillar / front panel -->
          <polygon points="-42,14 42,14 36,65 -36,65" fill="#854d0e" stroke="#451a03" stroke-width="2.5"/>
          <!-- Recessed wood center panel -->
          <polygon points="-28,20 28,20 23,58 -23,58" fill="#713f12" stroke="#451a03" stroke-width="1.5"/>

          <!-- Dual Gooseneck Microphones -->
          <g id="microphones">
            <!-- Left Mic -->
            <path d="M-36,2 Q-32,-22 -16,-18" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
            <rect x="-17" y="-23" width="9" height="6" rx="2" transform="rotate(20 -13 -20)" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
            <!-- Right Mic -->
            <path d="M36,2 Q32,-22 16,-18" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
            <rect x="8" y="-23" width="9" height="6" rx="2" transform="rotate(-20 13 -20)" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * 🚫 "Recesso da Mesa" (Skip)
   * Presidential/Congressional desk with blue leather tufted chair and coat of arms!
   */
  static renderRecessoMesaIllustration() {
    return `
      <g transform="translate(120, 185) scale(0.95)">
        <!-- High-Backed Blue Leather Executive Chair -->
        <g id="blue-chair" transform="translate(0, -42)">
          <!-- Chair headrest & back -->
          <path d="M-32,50 L-32,8 C-32,-18 -18,-28 0,-28 C18,-28 32,-18 32,8 L32,50 Z" fill="#1e40af" stroke="#0f172a" stroke-width="2.5"/>
          <!-- Inner tufted cushion -->
          <path d="M-24,45 L-24,10 C-24,-12 -14,-20 0,-20 C14,-20 24,-12 24,10 L24,45 Z" fill="#2563eb"/>
          <!-- Tufted buttons & stitch lines -->
          <line x1="-15" y1="5" x2="15" y2="5" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="-18" y1="22" x2="18" y2="22" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="-20" y1="38" x2="20" y2="38" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <line x1="0" y1="-15" x2="0" y2="45" stroke="#1d4ed8" stroke-width="1.5" stroke-dasharray="3,2"/>
          <!-- Buttons -->
          <circle cx="0" cy="5" r="2.5" fill="#172554"/>
          <circle cx="-10" cy="22" r="2.5" fill="#172554"/>
          <circle cx="10" cy="22" r="2.5" fill="#172554"/>
          <circle cx="0" cy="38" r="2.5" fill="#172554"/>
        </g>

        <!-- Presidential / Senate Wooden Desk -->
        <g id="desk" transform="translate(0, 16)">
          <!-- Heavy desk top slab -->
          <polygon points="-62,0 62,0 55,14 -55,14" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
          <!-- Desk body -->
          <polygon points="-52,14 52,14 46,65 -46,65" fill="#78350f" stroke="#451a03" stroke-width="2.5"/>
          <!-- Recessed front panel -->
          <polygon points="-38,20 38,20 34,58 -34,58" fill="#5c2b09" stroke="#451a03" stroke-width="1.5"/>
          <!-- Republic Coat of Arms circular medallion -->
          <g transform="translate(0, 39)">
            <circle cx="0" cy="0" r="14" fill="#0284c7" stroke="#facc15" stroke-width="2"/>
            <!-- 5 pointed star emblem -->
            <polygon points="0,-10 3,-3 10,-3 5,2 7,8 0,4 -7,8 -5,2 -10,-3 -3,-3" fill="#facc15"/>
            <!-- Laurel wreath circle -->
            <circle cx="0" cy="0" r="11" fill="none" stroke="#22c55e" stroke-width="1.5" stroke-dasharray="2,2"/>
          </g>
          <!-- Desk side pillars -->
          <line x1="-42" y1="14" x2="-38" y2="65" stroke="#451a03" stroke-width="2"/>
          <line x1="42" y1="14" x2="38" y2="65" stroke="#451a03" stroke-width="2"/>
        </g>
      </g>
    `;
  }

  /**
   * 🛍️ "Bolsa Família" (+4)
   * The colorful 4 tiles with stylized Brazilian family icons!
   */
  static renderBolsaFamiliaIllustration() {
    return `
      <g transform="translate(120, 185) scale(0.95)">
        <!-- Cluster of 4 colored tiles -->
        
        <!-- Tile 1: Top-Left (Blue) - Father / Young Man -->
        <g transform="translate(-48, -48)">
          <rect x="0" y="0" width="46" height="46" rx="8" fill="#0284c7" stroke="#0f172a" stroke-width="2"/>
          <!-- Stylized young man -->
          <circle cx="23" cy="18" r="8" fill="#fcd2b0"/>
          <path d="M15,14 C15,8 31,8 31,14 Z" fill="#1e293b"/>
          <path d="M10,40 C10,30 36,30 36,40 Z" fill="#1e293b"/>
        </g>

        <!-- Tile 2: Top-Right (Yellow) - Child waving -->
        <g transform="translate(2, -48)">
          <rect x="0" y="0" width="46" height="46" rx="8" fill="#eab308" stroke="#0f172a" stroke-width="2"/>
          <!-- Child head & body -->
          <circle cx="20" cy="20" r="7" fill="#fcd2b0"/>
          <path d="M14,17 C14,10 26,10 26,17 Z" fill="#713f12"/>
          <path d="M9,42 C9,34 31,34 31,42 Z" fill="#15803d"/>
          <!-- Waving arm -->
          <line x1="28" y1="34" x2="38" y2="20" stroke="#fcd2b0" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="39" cy="19" r="3" fill="#fcd2b0"/>
        </g>

        <!-- Tile 3: Bottom-Left (Orange/Green) - Mother -->
        <g transform="translate(-48, 2)">
          <rect x="0" y="0" width="46" height="46" rx="8" fill="#f97316" stroke="#0f172a" stroke-width="2"/>
          <!-- Mother figure -->
          <circle cx="23" cy="18" r="8" fill="#fcd2b0"/>
          <!-- Long hair -->
          <path d="M13,20 C13,10 33,10 33,20 C34,28 31,32 30,34 L16,34 C15,32 12,28 13,20 Z" fill="#1e293b"/>
          <path d="M10,44 C10,34 36,34 36,44 Z" fill="#0284c7"/>
        </g>

        <!-- Tile 4: Bottom-Right (Red) - Grandfather / Senior holding baby -->
        <g transform="translate(2, 2)">
          <rect x="0" y="0" width="46" height="46" rx="8" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
          <!-- Grandfather head with grey hair -->
          <circle cx="20" cy="18" r="8" fill="#fcd2b0"/>
          <path d="M13,15 C13,8 27,8 27,15" stroke="#f1f5f9" stroke-width="3" fill="none"/>
          <path d="M16,21 C18,24 22,24 24,21" stroke="#f1f5f9" stroke-width="2" fill="none"/>
          <!-- Torso -->
          <path d="M8,44 C8,34 32,34 32,44 Z" fill="#b91c1c"/>
          <!-- Baby in arms -->
          <circle cx="33" cy="30" r="5" fill="#fcd2b0"/>
          <path d="M28,42 C28,37 38,37 38,42 Z" fill="#eab308"/>
        </g>
      </g>
    `;
  }

  /**
   * 🤟 "Faz o L!" (Carta Coringa de Ação Rápida)
   * Lula smiling, dark navy suit, making the "L" gesture with his right hand,
   * with Brazilian flag colors background ring!
   */
  static renderFazOLIllustration() {
    return `
      <g transform="translate(120, 185) scale(0.96)">
        <!-- Multi-color Circle Frame (Brazilian colors + PT Red) -->
        <g id="flag-circle">
          <circle cx="0" cy="0" r="66" fill="#18181b" stroke="#facc15" stroke-width="6"/>
          <clipPath id="circle-clip-l">
            <circle cx="0" cy="0" r="63"/>
          </clipPath>
          <g clip-path="url(#circle-clip-l)">
            <!-- Top Arc: Brazil Green -->
            <rect x="-70" y="-70" width="140" height="45" fill="#16a34a"/>
            <!-- Middle Stripe: Brazil Yellow -->
            <rect x="-70" y="-25" width="140" height="35" fill="#eab308"/>
            <!-- Bottom Right: Brazil Blue -->
            <rect x="0" y="10" width="70" height="60" fill="#0284c7"/>
            <!-- Bottom Left: Red -->
            <rect x="-70" y="10" width="70" height="60" fill="#dc2626"/>
            <!-- Dividing curved white banner -->
            <path d="M-70,0 Q0,-15 70,5 Q0,5 -70,0" fill="#ffffff" opacity="0.9"/>
          </g>
        </g>

        <!-- Lula Portrait -->
        <g id="lula-faz-l" transform="translate(0, 8)">
          <!-- Suit Torso -->
          <path d="M-42,55 Q-25,24 0,24 Q25,24 42,55 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <!-- White shirt collar -->
          <polygon points="0,24 -14,46 14,46" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
          <!-- Neck -->
          <rect x="-10" y="14" width="20" height="15" fill="#fcd2b0"/>
          
          <!-- Head / Face -->
          <ellipse cx="6" cy="3" rx="23" ry="25" fill="#fcd2b0"/>
          <!-- Ear -->
          <ellipse cx="29" cy="3" rx="4" ry="7" fill="#fcd2b0"/>
          
          <!-- White hair -->
          <path d="M-18,-8 C-18,-24 -3,-30 11,-28 C25,-26 31,-16 29,3 C26,-6 18,-15 6,-15 C-6,-15 -14,-7 -18,-8 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
          
          <!-- Full white trimmed beard & mustache -->
          <path d="M-11,8 C-10,26 -2,32 8,32 C18,32 25,26 26,8 C21,14 13,17 7,17 C1,17 -7,14 -11,8 Z" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.5"/>
          <!-- Mustache -->
          <path d="M-5,14 Q6,10 17,14 Q6,18 -5,14 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>
          <!-- Big friendly smile -->
          <path d="M0,20 Q7,27 15,20" stroke="#881337" stroke-width="2" fill="none"/>
          <path d="M2,21 Q7,25 13,21 Z" fill="#ffffff"/>

          <!-- Eyes & Eyebrows with happy crinkles -->
          <path d="M-5,3 Q0,-1 5,3" stroke="#0f172a" stroke-width="2.5" fill="none"/>
          <path d="M12,3 Q17,-1 22,3" stroke="#0f172a" stroke-width="2.5" fill="none"/>
          <path d="M-6,-3 Q0,-6 6,-3" stroke="#94a3b8" stroke-width="2" fill="none"/>
          <path d="M11,-3 Q17,-6 23,-3" stroke="#94a3b8" stroke-width="2" fill="none"/>
          <!-- Nose -->
          <path d="M4,4 Q7,9 10,8" stroke="#ea580c" stroke-width="1.5" fill="none"/>

          <!-- Right Hand Making the "L" SIGN! -->
          <g id="l-hand" transform="translate(-24, 0)">
            <!-- Hand / Fist Base -->
            <ellipse cx="2" cy="18" rx="10" ry="11" fill="#fcd2b0" stroke="#0f172a" stroke-width="2"/>
            <!-- Curled fingers (middle, ring, pinky) -->
            <path d="M-2,14 Q7,14 7,20 Q7,24 -2,24" fill="#fcd2b0" stroke="#0f172a" stroke-width="1.5"/>
            <path d="M-2,18 Q7,18 7,24 Q7,28 -2,28" fill="#fcd2b0" stroke="#0f172a" stroke-width="1.5"/>
            <!-- Thumb pointing horizontally to the left -->
            <path d="M0,18 L-18,18 C-22,18 -22,12 -18,12 L0,12 Z" fill="#fcd2b0" stroke="#0f172a" stroke-width="2"/>
            <circle cx="-19" cy="15" r="3" fill="#fcd2b0"/>
            <!-- Index finger pointing straight up! -->
            <path d="M-1,14 L-1,-16 C-1,-20 6,-20 6,-16 L6,14 Z" fill="#fcd2b0" stroke="#0f172a" stroke-width="2"/>
            <circle cx="2.5" cy="-17" r="3.5" fill="#fcd2b0"/>
            <!-- Wrist and navy suit sleeve cuff -->
            <rect x="-4" y="24" width="15" height="12" fill="#ffffff" stroke="#cbd5e1" stroke-width="1"/>
            <rect x="-6" y="28" width="19" height="18" fill="#1e293b" stroke="#0f172a" stroke-width="1.5"/>
          </g>
        </g>
      </g>
    `;
  }

  /**
   * 📂 "Sigilo Quebrado" (Coringa de Troca de Mão)
   * Manila folder opened, confidential docs revealed with red cracked stamp,
   * magnifying glass inspecting, and exchange arrows!
   */
  static renderSigiloQuebradoIllustration() {
    return `
      <g transform="translate(120, 185) scale(0.96)">
        <!-- Circular Hand Swap Arrows Background -->
        <g id="swap-arrows">
          <path d="M-42,-25 A50,50 0 0,1 42,-25" fill="none" stroke="#facc15" stroke-width="4.5" stroke-dasharray="8,4"/>
          <polygon points="48,-25 38,-33 40,-20" fill="#facc15"/>
          <path d="M42,25 A50,50 0 0,1 -42,25" fill="none" stroke="#facc15" stroke-width="4.5" stroke-dasharray="8,4"/>
          <polygon points="-48,25 -38,33 -40,20" fill="#facc15"/>
        </g>

        <!-- Manila Dossier Folder -->
        <g id="folder" transform="translate(0, 5)">
          <!-- Back folder flap with tab -->
          <path d="M-45,25 L-45,-25 L-20,-25 L-12,-17 L45,-17 L45,25 Z" fill="#d97706" stroke="#78350f" stroke-width="2"/>
          
          <!-- Secret Documents Emerging -->
          <g transform="translate(0, -6) rotate(-8)">
            <rect x="-30" y="-32" width="55" height="48" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
            <!-- Fake text lines on doc -->
            <line x1="-22" y1="-24" x2="16" y2="-24" stroke="#64748b" stroke-width="2"/>
            <line x1="-22" y1="-18" x2="10" y2="-18" stroke="#64748b" stroke-width="2"/>
            <line x1="-22" y1="-12" x2="18" y2="-12" stroke="#64748b" stroke-width="2"/>
            <line x1="-22" y1="-6" x2="4" y2="-6" stroke="#64748b" stroke-width="2"/>
            <!-- Red "SIGILO 100 ANOS QUEBRADO" stamp -->
            <g transform="translate(-4, -14) rotate(14)">
              <rect x="-24" y="-7" width="50" height="14" rx="2" fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,1"/>
              <text x="1" y="3" font-family="'Arial Black', sans-serif" font-size="6.5" font-weight="900" fill="#dc2626" text-anchor="middle">REVELADO</text>
            </g>
          </g>

          <!-- Front folder flap angled down -->
          <path d="M-46,28 L-38,-6 L42,-6 L38,28 Z" fill="#f59e0b" stroke="#78350f" stroke-width="2"/>
          <!-- Folder label -->
          <rect x="-22" y="6" width="44" height="14" rx="2" fill="#fef3c7" stroke="#b45309" stroke-width="1"/>
          <text x="0" y="16" font-family="'Arial Black', sans-serif" font-size="7" font-weight="900" fill="#78350f" text-anchor="middle">DOC. PÚBLICO</text>
        </g>

        <!-- Magnifying Glass inspecting folder -->
        <g id="magnifier" transform="translate(24, -15) rotate(35)">
          <circle cx="0" cy="0" r="14" fill="#67e8f9" fill-opacity="0.3" stroke="#0f172a" stroke-width="3"/>
          <path d="M-8,-6 Q-4,-10 2,-8" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.8"/>
          <!-- Handle -->
          <line x1="11" y1="11" x2="26" y2="26" stroke="#78350f" stroke-width="6" stroke-linecap="round"/>
          <line x1="11" y1="11" x2="26" y2="26" stroke="#0f172a" stroke-width="1.5" stroke-linecap="round"/>
        </g>
      </g>
    `;
  }
}

// Export for browser global or module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CardColors,
    ColorHex,
    ColorNamesPt,
    CardTypes,
    CardRenderer
  };
} else {
  window.CardColors = CardColors;
  window.ColorHex = ColorHex;
  window.ColorNamesPt = ColorNamesPt;
  window.CardTypes = CardTypes;
  window.CardRenderer = CardRenderer;
}
