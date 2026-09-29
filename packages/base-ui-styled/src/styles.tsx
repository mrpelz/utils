import { createGlobalStyles as createGlobalStyle } from 'goober/global';
import { FunctionComponent } from 'preact';

import { css } from './components/utils.js';

export const styles = css`
  :root {
    /* Base brand color (overridable) */
    --color-brand-primary: #007aff;

    /*
     * iOS primary (app tint), defaults to systemBlue
     * tint/shade: HSL lightness +/- 8%, Konsta UI color-utils/ios-colors.js
     */
    --color-ios-primary: var(--k-color-primary, var(--color-ios-system-blue));
    --color-ios-primary-tint: hsl(
      from var(--color-ios-primary) h s calc(l + 8)
    );
    --color-ios-primary-shade: hsl(
      from var(--color-ios-primary) h s calc(l - 8)
    );

    /* iOS surfaces */
    --color-ios-light-surface: #efeff4;
    --color-ios-light-surface-1: #fff;
    --color-ios-light-surface-2: #f7f7f8;
    --color-ios-dark-surface: #000;
    --color-ios-dark-surface-1: #1c1c1d;
    --color-ios-dark-surface-2: #121212;

    /* Material light */
    --color-md-light-primary: #6750a4;
    --color-md-light-on-primary: #fff;
    --color-md-light-secondary-container: #e8def8;
    --color-md-light-on-secondary-container: #1d192b;
    --color-md-light-outline: #79747e;

    /* Material dark */
    --color-md-dark-primary: #d0bcff;
    --color-md-dark-on-primary: #381e72;
    --color-md-dark-secondary-container: #4a4458;
    --color-md-dark-on-secondary-container: #e8def8;
    --color-md-dark-outline: #938f99;

    /* Fonts */
    --font-ios: -apple-system, blinkmacsystemfont, 'Segoe UI', sans-serif;
    --font-material: 'Roboto', 'Segoe UI', sans-serif;

    /* Transitions */
    --transition-transform-opacity: transform 0.3s, opacity 0.3s;
    --ease-material-in: cubic-bezier(0.4, 0, 0.2, 1);

    /*
     * iOS semantic colors (UIKit UIColor)
     *
     * - system grays and system colors: Apple Human Interface Guidelines,
     *   Color (June 9, 2025 values), incl. increased contrast variants
     * - labels, separators, link, fills, backgrounds: UIKit values (not
     *   published in the HIG); label and tertiary-system-fill match the
     *   iOS 26 Figma
     */
    --color-ios-label: rgb(0 0 0);
    --color-ios-secondary-label: rgb(60 60 67 / 60%);
    --color-ios-tertiary-label: rgb(60 60 67 / 30%);
    --color-ios-quaternary-label: rgb(60 60 67 / 18%);
    --color-ios-placeholder-text: rgb(60 60 67 / 30%);
    --color-ios-separator: rgb(60 60 67 / 29%);
    --color-ios-opaque-separator: rgb(198 198 200);
    --color-ios-link: rgb(0 122 255);
    --color-ios-system-fill: rgb(120 120 128 / 20%);
    --color-ios-secondary-system-fill: rgb(120 120 128 / 16%);
    --color-ios-tertiary-system-fill: rgb(118 118 128 / 12%);
    --color-ios-quaternary-system-fill: rgb(116 116 128 / 8%);
    --color-ios-system-background: rgb(255 255 255);
    --color-ios-secondary-system-background: rgb(242 242 247);
    --color-ios-tertiary-system-background: rgb(255 255 255);
    --color-ios-system-grouped-background: rgb(242 242 247);
    --color-ios-secondary-system-grouped-background: rgb(255 255 255);
    --color-ios-tertiary-system-grouped-background: rgb(242 242 247);
    --color-ios-system-gray: rgb(142 142 147);
    --color-ios-system-gray2: rgb(174 174 178);
    --color-ios-system-gray3: rgb(199 199 204);
    --color-ios-system-gray4: rgb(209 209 214);
    --color-ios-system-gray5: rgb(229 229 234);
    --color-ios-system-gray6: rgb(242 242 247);
    --color-ios-system-red: rgb(255 56 60);
    --color-ios-system-orange: rgb(255 141 40);
    --color-ios-system-yellow: rgb(255 204 0);
    --color-ios-system-green: rgb(52 199 89);
    --color-ios-system-mint: rgb(0 200 179);
    --color-ios-system-teal: rgb(0 195 208);
    --color-ios-system-cyan: rgb(0 192 232);
    --color-ios-system-blue: rgb(0 136 255);
    --color-ios-system-indigo: rgb(97 85 245);
    --color-ios-system-purple: rgb(203 48 224);
    --color-ios-system-pink: rgb(255 45 85);
    --color-ios-system-brown: rgb(172 127 94);

    @media (prefers-color-scheme: dark) {
      --color-ios-label: rgb(255 255 255);
      --color-ios-secondary-label: rgb(235 235 245 / 60%);
      --color-ios-tertiary-label: rgb(235 235 245 / 30%);
      --color-ios-quaternary-label: rgb(235 235 245 / 16%);
      --color-ios-placeholder-text: rgb(235 235 245 / 30%);
      --color-ios-separator: rgb(84 84 88 / 60%);
      --color-ios-opaque-separator: rgb(56 56 58);
      --color-ios-link: rgb(9 132 255);
      --color-ios-system-fill: rgb(120 120 128 / 36%);
      --color-ios-secondary-system-fill: rgb(120 120 128 / 32%);
      --color-ios-tertiary-system-fill: rgb(118 118 128 / 24%);
      --color-ios-quaternary-system-fill: rgb(118 118 128 / 18%);
      --color-ios-system-background: rgb(0 0 0);
      --color-ios-secondary-system-background: rgb(28 28 30);
      --color-ios-tertiary-system-background: rgb(44 44 46);
      --color-ios-system-grouped-background: rgb(0 0 0);
      --color-ios-secondary-system-grouped-background: rgb(28 28 30);
      --color-ios-tertiary-system-grouped-background: rgb(44 44 46);
      --color-ios-system-gray: rgb(142 142 147);
      --color-ios-system-gray2: rgb(99 99 102);
      --color-ios-system-gray3: rgb(72 72 74);
      --color-ios-system-gray4: rgb(58 58 60);
      --color-ios-system-gray5: rgb(44 44 46);
      --color-ios-system-gray6: rgb(28 28 30);
      --color-ios-system-red: rgb(255 66 69);
      --color-ios-system-orange: rgb(255 146 48);
      --color-ios-system-yellow: rgb(255 214 0);
      --color-ios-system-green: rgb(48 209 88);
      --color-ios-system-mint: rgb(0 218 195);
      --color-ios-system-teal: rgb(0 210 224);
      --color-ios-system-cyan: rgb(60 211 254);
      --color-ios-system-blue: rgb(0 145 255);
      --color-ios-system-indigo: rgb(109 124 255);
      --color-ios-system-purple: rgb(219 52 242);
      --color-ios-system-pink: rgb(255 55 95);
      --color-ios-system-brown: rgb(183 138 102);
    }

    @media (prefers-contrast: more) {
      --color-ios-system-gray: rgb(108 108 112);
      --color-ios-system-gray2: rgb(142 142 147);
      --color-ios-system-gray3: rgb(174 174 178);
      --color-ios-system-gray4: rgb(188 188 192);
      --color-ios-system-gray5: rgb(216 216 220);
      --color-ios-system-gray6: rgb(235 235 240);
      --color-ios-system-red: rgb(233 21 45);
      --color-ios-system-orange: rgb(197 83 0);
      --color-ios-system-yellow: rgb(161 106 0);
      --color-ios-system-green: rgb(0 137 50);
      --color-ios-system-mint: rgb(0 133 117);
      --color-ios-system-teal: rgb(0 129 152);
      --color-ios-system-cyan: rgb(0 126 174);
      --color-ios-system-blue: rgb(30 110 244);
      --color-ios-system-indigo: rgb(86 74 222);
      --color-ios-system-purple: rgb(176 47 194);
      --color-ios-system-pink: rgb(231 18 77);
      --color-ios-system-brown: rgb(149 109 81);
    }

    @media (prefers-color-scheme: dark) and (prefers-contrast: more) {
      --color-ios-system-gray: rgb(174 174 178);
      --color-ios-system-gray2: rgb(124 124 128);
      --color-ios-system-gray3: rgb(84 84 86);
      --color-ios-system-gray4: rgb(68 68 70);
      --color-ios-system-gray5: rgb(54 54 56);
      --color-ios-system-gray6: rgb(36 36 38);
      --color-ios-system-red: rgb(255 97 101);
      --color-ios-system-orange: rgb(255 160 86);
      --color-ios-system-yellow: rgb(254 223 67);
      --color-ios-system-green: rgb(74 217 104);
      --color-ios-system-mint: rgb(84 223 203);
      --color-ios-system-teal: rgb(59 221 236);
      --color-ios-system-cyan: rgb(109 217 255);
      --color-ios-system-blue: rgb(92 184 255);
      --color-ios-system-indigo: rgb(167 170 255);
      --color-ios-system-purple: rgb(234 141 255);
      --color-ios-system-pink: rgb(255 138 196);
      --color-ios-system-brown: rgb(219 166 121);
    }

    /*
     * iOS glass
     *
     * Source: Framework7 components/app/app-vars.less (--f7-glass-shadow-thumb)
     */
    --shadow-ios-glass-thumb:
      inset -3px -3px 0 -3.5px rgb(255 255 255),
      inset 3px 3px 0 -3.5px rgb(255 255 255),
      inset 0 0 0 0.5px rgb(255 255 255 / 50%), inset 3px 3px 10px -2px #eee,
      inset -3px -3px 10px -2px #eee, inset 0 0 5px 1px #fff;

    @media (prefers-color-scheme: dark) {
      --shadow-ios-glass-thumb:
        inset 3px 3px 0 -3.5px rgb(255 255 255),
        inset -3px -3px 0 -3.5px rgb(255 255 255),
        inset -0.5px -0.5px 0 rgb(255 255 255 / 50%),
        inset 0.5px 0.5px 0 rgb(255 255 255 / 10%),
        inset -3px 3px 0 -3.5px rgb(255 255 255 / 25%),
        inset 0 -5px 0 -3.5px rgb(255 255 255 / 25%),
        inset 0 -5px 5px rgb(255 255 255 / 25%);
    }

    /*
     * iOS glass materials for dim and bright content behind the glass
     *
     * Source: Apple iOS 26 Figma (Tab Bar, BG Context Dim/Bright):
     * - blur: “Blur” layer (backdrop-filter: blur(20px), opacity 0.67)
     * - fill: “Fill” layer, split into its three fills (bottom to top), each
     *   with its blend mode; opacity of the whole fill
     * - content/selection: vibrant tab content and selection (no UIKit
     *   semantic equivalent)
     * The “Glass Effect” layer (a Figma layer effect, not part of the CSS
     * export) is emulated as in Framework7 components/app/app-vars.less
     * (--f7-glass-shadow, light for bright, dark for dim) and Konsta UI
     * styles/glass.css (--shadow-ios-light-glass, --shadow-ios-dark-glass).
     * - lens: pressed selection, Framework7 components/toolbar/toolbar-vars.less
     *   (--f7-tabbar-link-highlight-active-bg-color) and app-vars.less
     *   (--f7-glass-shadow-thumb), light for bright, dark for dim
     * plus-darker (unsupported in Chromium) falls back to multiply, which
     * darkens by a similar amount for these light colors.
     */
    --glass-ios-dim-blur: rgb(255 255 255 / 5%);
    --glass-ios-dim-fill-bottom: rgb(204 204 204 / 50%);
    --glass-ios-dim-fill-bottom-blend: color-burn;
    --glass-ios-dim-fill-middle: rgb(0 0 0 / 60%);
    --glass-ios-dim-fill-top: rgb(255 255 255 / 6%);
    --glass-ios-dim-fill-top-blend: normal;
    --glass-ios-dim-fill-opacity: 0.67;
    --glass-ios-dim-content: #bfbfbf;
    --glass-ios-dim-content-blend: plus-lighter;
    --glass-ios-dim-selection: #121212;
    --glass-ios-dim-selection-blend: plus-lighter;
    --glass-ios-dim-lens: rgb(255 255 255 / 10%);
    --glass-ios-dim-lens-shadow:
      inset 3px 3px 0 -3.5px rgb(255 255 255),
      inset -3px -3px 0 -3.5px rgb(255 255 255),
      inset -0.5px -0.5px 0 rgb(255 255 255 / 50%),
      inset 0.5px 0.5px 0 rgb(255 255 255 / 10%),
      inset -3px 3px 0 -3.5px rgb(255 255 255 / 25%),
      inset 0 -5px 0 -3.5px rgb(255 255 255 / 25%),
      inset 0 -5px 5px rgb(255 255 255 / 25%);
    --glass-ios-dim-shadow:
      inset -2px -2px 0.5px -2.5px rgb(255 255 255 / 40%),
      inset 3px 3px 0.5px -3.5px rgb(255 255 255 / 40%),
      inset 2px 2px 0.5px -2px #262626, inset -2px -2px 0.5px -2px #262626,
      inset 0 0 5px 1px #141414, inset 0 0 0 1px rgb(255 255 255 / 15%),
      inset 0 0 10px 0 rgb(255 255 255 / 7.5%),
      inset 0 0 24px 0 rgb(255 255 255 / 5%), 0 0 25px 0 rgb(0 0 0 / 15%);
    --glass-ios-bright-blur: rgb(0 0 0 / 4%);
    --glass-ios-bright-fill-bottom: #333;
    --glass-ios-bright-fill-bottom-blend: color-dodge;
    --glass-ios-bright-fill-middle: rgb(255 255 255 / 50%);
    --glass-ios-bright-fill-top: #f7f7f7;
    --glass-ios-bright-fill-top-blend: multiply;
    --glass-ios-bright-fill-opacity: 1;
    --glass-ios-bright-content: #404040;
    --glass-ios-bright-content-blend: multiply;
    --glass-ios-bright-selection: #ededed;
    --glass-ios-bright-selection-blend: multiply;
    --glass-ios-bright-lens: rgb(0 0 0 / 5%);
    --glass-ios-bright-lens-shadow:
      inset -3px -3px 0 -3.5px rgb(255 255 255),
      inset 3px 3px 0 -3.5px rgb(255 255 255),
      inset 0 0 0 0.5px rgb(255 255 255 / 50%), inset 3px 3px 10px -2px #eee,
      inset -3px -3px 10px -2px #eee, inset 0 0 5px 1px #fff;
    --glass-ios-bright-shadow:
      inset -1px -1px 0 -0.5px rgb(255 255 255),
      inset 1px 1px 0 -0.5px rgb(255 255 255), inset 3px 3px 10px -3px #ddd,
      inset -3px -3px 10px -3px #ddd, inset 0 0 5px 1px #fff,
      inset 0 0 0 0.5px rgb(0 0 0 / 25%), inset 0 0 24px 0 rgb(0 0 0 / 10%),
      0 0 25px 0 rgb(0 0 0 / 20%);

    @supports (mix-blend-mode: plus-darker) {
      --glass-ios-bright-fill-top-blend: plus-darker;
      --glass-ios-bright-content-blend: plus-darker;
      --glass-ios-bright-selection-blend: plus-darker;
    }

    &[dark] {
      --color-ios-light-surface: #000;
      --color-ios-light-surface-1: #1c1c1d;
      --color-ios-light-surface-2: #121212;
      --color-md-light-primary: var(--color-md-dark-primary);
      --color-md-light-on-primary: var(--color-md-dark-on-primary);
      --color-md-light-secondary-container: var(
        --color-md-dark-secondary-container
      );
      --color-md-light-on-secondary-container: var(
        --color-md-dark-on-secondary-container
      );
      --color-md-light-outline: var(--color-md-dark-outline);
    }
  }
`;

export const Styles = createGlobalStyle(styles) as unknown as FunctionComponent;
