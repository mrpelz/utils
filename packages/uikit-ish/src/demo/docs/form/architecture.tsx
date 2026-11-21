import { FunctionComponent } from 'react';

import { CodeView } from '../../tooling/frame/code-view.js';
import {
  Contents,
  Heading,
  PartLink,
  type Section,
} from '../../tooling/guide/sections.js';
import { publicUrl } from '../../tooling/public-url.js';

// `/form/architecture`: how Form is built, and what flows into it.

const fieldsetCode = `// Fieldset.Root: Base UI's fieldset, rendered as a list section whose
// element is a <fieldset> (its user agent box reset).
<BaseFieldset.Root
  {...props}
  render={
    props.render ?? (
      <List.Section
        render={<fieldset className="uikit-form-fieldset-element" />}
      />
    )
  }
/>

// Fieldset.Legend: Base UI's legend, rendered as the section's header.
<BaseFieldset.Legend {...props} render={props.render ?? <List.Header />} />`;

const treeCode = `<form>                                   <!-- Form: Base UI's -->
  <div class="uikit-list-root">          <!-- List.Root -->
    <fieldset class="uikit-list-section"> <!-- Fieldset.Root -->
      <div class="uikit-list-header">…</div> <!-- Fieldset.Legend -->
      <div class="uikit-list-group">
        <div class="uikit-list-item">…</div> <!-- a field, a row -->
      </div>
    </fieldset>
  </div>
</form>`;

const sections: readonly Section[] = [
  ['base-ui-in-a-list', 'Base UI in a list'],
  ['fieldsets-as-sections', 'Fieldsets as sections'],
  ['fields-as-rows', 'Fields as rows'],
  ['what-flows-in-and-out', 'What flows in and out'],
];

/** `/form/architecture`: how it's built, and what flows into it. */
export const FormArchitecture: FunctionComponent = () => (
  <>
    <Contents sections={sections} />
    <ul className="demo-lead">
      <li>
        Form adds almost no code of its own. It’s Base UI’s form, fieldset and
        field, laid out in a <a href={publicUrl('list')}>List</a>: a fieldset
        renders as a list section, its legend as the section’s header, and
        fields as rows. For using it, see its{' '}
        <a href={publicUrl('form/parts')}>parts</a>.
      </li>
    </ul>

    <Heading
      id="base-ui-in-a-list"
      level={2}
    >
      Base UI in a list
    </Heading>
    <ul>
      <li>
        <PartLink part="Form" /> and <PartLink part="Field" /> are Base UI’s,
        exported as they are: validation by <code>name</code>, errors shown on
        their fields, values passed to <code>onFormSubmit</code>.
      </li>
      <li>
        <PartLink part="Fieldset.Root" /> and{' '}
        <PartLink part="Fieldset.Legend" /> are Base UI’s too, with a default{' '}
        <code>render</code>. The namespace spreads Base UI’s parts and replaces
        just those two.
      </li>
      <li>
        The look is entirely List’s. Form’s stylesheet has one rule: it resets
        the <code>&lt;fieldset&gt;</code> element’s own border, padding and
        minimum width, so a section looks the same whether it’s a fieldset or
        not.
      </li>
    </ul>
    <CodeView code={treeCode} />

    <Heading
      id="fieldsets-as-sections"
      level={2}
    >
      Fieldsets as sections
    </Heading>
    <ul>
      <li>
        A fieldset renders{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , which in turn renders a <code>&lt;fieldset&gt;</code>. Base UI’s props
        and state attributes end up on that element. Its <code>disabled</code>{' '}
        reaches the fields in it through Base UI’s fieldset context (nested
        fieldsets too), not the element’s own attribute.
      </li>
      <li>
        Its legend renders{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        . Base UI gives it an id and labels the fieldset with it (
        <code>aria-labelledby</code>), so the section’s header names the group
        for assistive technology. Another header, for example a nested one, is a{' '}
        <code>render</code> away.
      </li>
      <li>
        Passing your own <code>render</code> replaces the default, as in Base
        UI.
      </li>
    </ul>
    <CodeView code={fieldsetCode} />

    <Heading
      id="fields-as-rows"
      level={2}
    >
      Fields as rows
    </Heading>
    <ul>
      <li>
        Form doesn’t wrap any control. A{' '}
        <PartLink
          component="text-field"
          part="TextField.Root"
        />{' '}
        is a field; given <code>render=&#123;&lt;List.Item /&gt;&#125;</code>,
        it’s a list row, its label the row’s title. Other controls (a switch, a
        stepper, a date picker) sit in a{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        , or a <PartLink part="Field" /> rendering one when they need a name, a
        label or validation.
      </li>
      <li>
        A form submits with a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        of <code>type=&quot;submit&quot;</code>; Base UI collects the values by
        name.
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
        <strong>From Base UI:</strong> all of the form’s behavior: validation,
        errors, values, disabling.
      </li>
      <li>
        <strong>From List:</strong> all of its look: sections, headers, rows.
      </li>
      <li>
        <strong>From the controls:</strong> each registers with its field
        through Base UI’s field context, as it would anywhere.
      </li>
      <li>
        <strong>Out:</strong> nothing beyond what Base UI provides.
      </li>
    </ul>
  </>
);
