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
        field, laid out in a <a href={publicUrl('list')}>List</a>. A fieldset
        renders as a list section, its legend as the section’s header, and its
        fields as rows. To learn how to use it, see its{' '}
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
        exported as they are. They validate by <code>name</code>, show errors on
        their fields, and pass the values to <code>onFormSubmit</code>.
      </li>
      <li>
        <PartLink part="Fieldset.Root" /> and{' '}
        <PartLink part="Fieldset.Legend" /> are Base UI’s too, with a default{' '}
        <code>render</code>. The namespace spreads Base UI’s parts and replaces
        only those two.
      </li>
      <li>
        The look comes entirely from List. Form’s stylesheet has a single rule.
        It resets the <code>&lt;fieldset&gt;</code> element’s own border,
        padding and minimum width, so a section looks the same whether it’s a
        fieldset or not.
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
        A fieldset renders a{' '}
        <PartLink
          component="list"
          part="List.Section"
        />
        , which in turn renders a <code>&lt;fieldset&gt;</code>. Base UI’s props
        and state attributes end up on that element.
      </li>
      <li>
        The fieldset’s <code>disabled</code> reaches the fields inside it
        through Base UI’s fieldset context, nested fieldsets included. It
        doesn’t rely on the element’s own attribute.
      </li>
      <li>
        The legend renders a{' '}
        <PartLink
          component="list"
          part="List.Header"
        />
        . Base UI gives it an id and labels the fieldset with it (
        <code>aria-labelledby</code>). So the section’s header names the group
        for assistive technology. To use another header, such as a nested one,
        pass it as <code>render</code>.
      </li>
      <li>
        Your own <code>render</code> replaces the default, as in Base UI.
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
        is a field. When you give it{' '}
        <code>render=&#123;&lt;List.Item /&gt;&#125;</code>, it becomes a list
        row, and its label becomes the row’s title.
      </li>
      <li>
        Other controls, such as a switch, a stepper or a date picker, sit in a{' '}
        <PartLink
          component="list"
          part="List.Item"
        />
        . When they need a name, a label or validation, put them in a{' '}
        <PartLink part="Field" /> that renders a row.
      </li>
      <li>
        A form submits with a{' '}
        <PartLink
          component="button"
          part="Button.Root"
        />{' '}
        of <code>type=&quot;submit&quot;</code>. Base UI collects the values by
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
        <strong>From Base UI:</strong> all of the form’s behavior, including
        validation, errors, values and disabling.
      </li>
      <li>
        <strong>From List:</strong> all of its look, including sections, headers
        and rows.
      </li>
      <li>
        <strong>From the controls:</strong> each control registers with its
        field through Base UI’s field context, as it would anywhere else.
      </li>
      <li>
        <strong>Out:</strong> nothing beyond what Base UI provides.
      </li>
    </ul>
  </>
);
