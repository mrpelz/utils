import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/alert/architecture`: how Alert is built, and what flows into it.

/* eslint-disable unicorn/no-incorrect-template-string-interpolation -- JSX braces in code samples, not interpolations */
const popupCode = `// Alert.Popup, in short: Base UI's portal, backdrop, viewport and popup,
// rendered together.
<BaseAlertDialog.Portal
  {...useSettingsPortalProps()}
  container={usePortalContainer(container)}
>
  <BaseAlertDialog.Backdrop className="uikit-alert-backdrop" />
  <BaseAlertDialog.Viewport render={<Viewport.KeyboardAccessory />}>
    <BaseAlertDialog.Popup data-color-scheme={scheme} className="… uikit-glass-medium">
      <ColorSchemeScope colorScheme={scheme}>{children}</ColorSchemeScope>
    </BaseAlertDialog.Popup>
  </BaseAlertDialog.Viewport>
</BaseAlertDialog.Portal>`;
/* eslint-enable unicorn/no-incorrect-template-string-interpolation */

const sections: readonly Section[] = [
  ['one-popup-part', 'One popup part'],
  ['above-the-keyboard', 'Above the keyboard'],
  ['the-panel-s-parts', 'The panel’s parts'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/alert/architecture`: how it's built, and what flows into it. */
export const AlertArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        An alert is Base UI’s alert dialog. The library folds its portal,
        backdrop and viewport into one popup part. It also lifts the alert above
        the keyboard, and draws it as a glass panel with parts of its own. To
        learn how to use it, see its{' '}
        <a href={publicUrl('alert/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="one-popup-part"
      level={2}
    >
      One popup part
    </Heading>
    <ul>
      <li>
        <PartLink part="Alert.Popup" /> renders four Base UI parts at once: the
        portal, the backdrop, the viewport and the popup. An alert always needs
        all four, so you write one part instead of four. Base UI’s root, trigger
        and close are used as they are.
      </li>
      <li>
        The portal goes into the library’s portal container (
        <code>usePortalContainer</code>). In the demos, that’s a device’s screen
        instead of the page’s body. The portal renders outside the providers
        around it, so it carries their settings with it (
        <code>useSettingsPortalProps</code>).
      </li>
      <li>
        The popup takes its color scheme from what’s behind it (
        <code>useGlassScheme</code>), and passes it on to its content.
      </li>
      <li>
        <PartLink part="Alert.createHandle" /> and its hook wrap Base UI’s
        handle, for triggers that sit outside the root.
      </li>
    </ul>
    <CodeView code={popupCode} />

    <Heading
      id="above-the-keyboard"
      level={2}
    >
      Above the keyboard
    </Heading>
    <ul>
      <li>
        Base UI’s viewport centers the popup, and it renders a{' '}
        <PartLink
          component="viewport"
          part="Viewport.KeyboardAccessory"
        />
        . When you type into a field in the alert, the accessory lifts the whole
        alert until it clears the keyboard. When you’re done, it lets the alert
        back down. The alert itself measures nothing.
      </li>
    </ul>

    <Heading
      id="the-panel-s-parts"
      level={2}
    >
      The panel’s parts
    </Heading>
    <ul>
      <li>
        <PartLink part="Alert.Title" /> and{' '}
        <PartLink part="Alert.Description" /> are Base UI’s, so they label and
        describe the dialog.
      </li>
      <li>
        <PartLink part="Alert.Header" />, <PartLink part="Alert.Fields" /> and{' '}
        <PartLink part="Alert.Actions" /> are plain elements for layout.
      </li>
      <li>
        <PartLink part="Alert.Field" /> is Base UI’s input.{' '}
        <PartLink part="Alert.Action" /> is Base UI’s close button, so every
        action closes the alert. Its variant is set as an attribute.
      </li>
      <li>
        The actions stack when there are three or more, or when{' '}
        <code>stacked</code> is set. A selector counts them, using{' '}
        <code>:has()</code> with sibling combinators.
      </li>
      <li>
        The panel uses the menus’ glass. It doesn’t blend with what’s behind it,
        because a popup that’s positioned by a transform and animated can’t
        blend. It scales in from 110% while it fades in, using Base UI’s
        starting and ending styles.
      </li>
    </ul>

    <Heading
      id="what-flows-in-and-out"
      level={2}
    >
      What flows in and out
    </Heading>
    <ul>
      <li>
        <strong>From Base UI:</strong> opening and closing, modality, focus,
        labels and the handle.
      </li>
      <li>
        <strong>From Viewport:</strong> the keyboard, through the keyboard
        accessory, and the portal container.
      </li>
      <li>
        <strong>From Settings and Glass:</strong> the providers’ settings on the
        portal, and the panel’s color scheme.
      </li>
      <li>
        <strong>Out:</strong>{' '}
        <PartLink
          component="action-sheet"
          part="ActionSheet.Popup"
        />{' '}
        uses the alert’s styles for its panel, backdrop, portal and header. It
        positions that panel like a popover, at the control that presented it,
        or at the bottom when there’s none.
      </li>
    </ul>
  </>
);
