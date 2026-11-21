import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/button/architecture`: how Button is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const glassCode = `// Button.Root, a glass variant: its material first, its content above.
<BaseButton data-variant="glass" data-glass-context={context ?? 'auto'}>
  <GlassBackground kind="button" tinted={variant === 'glass-prominent'} />
  <span className="uikit-button-content">{children}</span>
</BaseButton>`;

const pressableCode = `// Without a click handler (nor a secondary one), it's disabled, unless
// it submits or resets its form.
const isPressable =
  Boolean(props.onClick ?? props.onSecondaryClick) ||
  props.type === 'submit' ||
  props.type === 'reset';
const rootProps = useSecondaryClick({
  ...props,
  ...(!isPressable && props.disabled === undefined && { disabled: true }),
});`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['base-ui-s-button', 'Base UI’s button'],
  ['props-as-attributes', 'Props as attributes'],
  ['glass-buttons', 'Glass buttons'],
  ['pressable-or-disabled', 'Pressable or disabled'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/button/architecture`: how it's built, and what flows into it. */
export const ButtonArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        A button is Base UI’s, styled by attributes, with two kinds of drawing:
        classic variants are plain CSS, glass variants draw Glass’s material
        behind their content. For using it, see its{' '}
        <a href={publicUrl('button/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-s-button"
      level={2}
    >
      Base UI’s button
    </Heading>
    <ul>
      <li>
        <PartLink part="Button.Root" /> renders Base UI’s button: focus and
        keyboard handling, and <code>render</code> for another element, which is
        how a menu trigger or a toolbar renders it.
      </li>
      <li>
        <PartLink part="Button.Icon" /> and <PartLink part="Button.Label" /> are
        spans with part attributes. The icon holds a{' '}
        <PartLink
          component="symbol"
          part="Symbol"
        />
        ; the label truncates when the button is narrower than its content.
        Toolbar’s and List’s stylesheets address these parts to style the
        buttons they hold.
      </li>
    </ul>

    <Heading
      id="props-as-attributes"
      level={2}
    >
      Props as attributes
    </Heading>
    <ul>
      <li>
        <code>variant</code>, <code>size</code>, <code>shape</code>,{' '}
        <code>fill</code> and <code>destructive</code> become attributes, and
        the stylesheet does the rest: heights from padding and line height, each
        variant’s fill and press state, a hit area of at least 44px.
      </li>
      <li>
        <code>tint</code> becomes <code>--uikit-button-tint</code> and{' '}
        <code>--uikit-glass-tint</code>, so classic and glass variants take it
        the same way. <code>destructive</code> wins over it with the system red.{' '}
        <code>textColor</code> sets the label’s color and turns off its
        blending. The app’s <code>style</code> is merged last.
      </li>
    </ul>

    <Heading
      id="glass-buttons"
      level={2}
    >
      Glass buttons
    </Heading>
    <ul>
      <li>
        The glass variants render Glass’s <code>GlassBackground</code> first:
        layers for the blur, the fill and the rim, stacked by document order so
        their backdrop filters and blend modes reach what’s behind the button.
        The content follows in its own span, drawn above and blended with the
        glass, for vibrant labels.
      </li>
      <li>
        The glass context (bright or dim) is the given <code>context</code>, or
        with <code>adaptive</code> the tone of what’s behind it (
        <code>useGlassContext</code>); without one, the color scheme decides.
        It’s set as <code>data-glass-context</code>.
      </li>
      <li>
        Pressed, a glass button becomes a lens, as a slider’s knob does: the
        glass scales up and clears, a tinted glow shows behind it, and the
        content scales up less than the lens. That’s Glass’s lens state, driven
        by custom properties the button’s stylesheet sets while it’s pressed.
      </li>
    </ul>
    <CodeView code={glassCode} />

    <Heading
      id="pressable-or-disabled"
      level={2}
    >
      Pressable or disabled
    </Heading>
    <ul>
      <li>
        A button with nothing to do is disabled: without an <code>onClick</code>
        , an <code>onSecondaryClick</code>, or a submit or reset type, it’s
        disabled unless <code>disabled</code> is given explicitly. So a button
        never looks pressable when it isn’t.
      </li>
      <li>
        <code>onSecondaryClick</code> (a right click, or a touch held) is turned
        into event handlers by <code>useSecondaryClick</code>, chained with the
        button’s own.
      </li>
    </ul>
    <CodeView code={pressableCode} />

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> the button element, focus, keyboard,{' '}
        <code>render</code>.
      </li>
      <li>
        <strong>From Glass:</strong> the material, the context and the lens, for
        the glass variants.
      </li>
      <li>
        <strong>From its host:</strong> a toolbar renders it as its own button,
        with the bar’s variant and shape; a list styles the buttons in its rows.
      </li>
      <li>
        <strong>Out:</strong> it’s the element behind{' '}
        <PartLink
          component="toolbar"
          part="Toolbar.Button"
        />
        , menu triggers and many demos’ actions.
      </li>
    </ul>
  </>
);
