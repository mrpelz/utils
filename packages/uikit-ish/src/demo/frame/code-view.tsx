import type * as Monaco from 'monaco-editor/editor/editor.api.js';
import {
  FunctionComponent,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import { useDark } from '../shared/use-dark.js';

type Editor = Monaco.editor.IStandaloneCodeEditor;

// Monaco's editor (with what MonacoWebpackPlugin adds, see
// webpack.config.js): one import for all views, on the client only.
let loading: Promise<typeof Monaco> | undefined;
const loadMonaco = () => {
  loading ??= import(
    /* webpackChunkName: "monaco" */ 'monaco-editor/editor/editor.api.js'
  );
  return loading;
};

const theme = (dark: boolean) => (dark ? 'vs-dark' : 'vs');

/** A length in px from a computed style (`none`, or another unit: none). */
const pixels = (value: string) =>
  value.endsWith('px') ? Number.parseFloat(value) : Infinity;

/**
 * Code shown in Monaco (read-only, TypeScript and JSX colorized), with a
 * button copying it. Monaco is as high as its content, at most its
 * container's `max-height` (style.css, e.g. in frames), scrolling itself
 * beyond (its find widget and sticky lines in place); at its ends, the
 * wheel and swipes scroll the page on. Rendered on the client only: until
 * Monaco is there (and while prerendering), the plain text.
 */
export const CodeView: FunctionComponent<{ code: string }> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<Editor>();
  const dark = useDark();

  // (The code and scheme at creation, both followed below.)
  const initialRef = useRef({ code, dark });

  useEffect(() => {
    let disposed = false;
    let created: Editor | undefined;

    loadMonaco()
      .then((monaco) => {
        const { current: container } = containerRef;
        if (disposed || !container) return;

        created = monaco.editor.create(container, {
          automaticLayout: true,
          contextmenu: false,
          domReadOnly: true,
          folding: false,
          // (As the text shown until then, see style.css.)
          fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
          fontSize: 12,
          language: 'typescript',
          lineDecorationsWidth: 0,
          lineHeight: 18,
          lineNumbers: 'off',
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          readOnly: true,
          renderLineHighlight: 'none',
          scrollBeyondLastLine: false,
          // (At its ends, the wheel scrolls the page on.)
          scrollbar: { alwaysConsumeMouseWheel: false },
          theme: theme(initialRef.current.dark),
          // (UTF-8 in samples is intended, e.g. − and ×.)
          unicodeHighlight: { ambiguousCharacters: false },
          value: initialRef.current.code,
        });

        // As high as its content, at most its container's `max-height`.
        const fit = () => {
          if (!created) return;
          const { parentElement } = container;
          const cap = parentElement
            ? pixels(getComputedStyle(parentElement).maxHeight)
            : Infinity;
          const height = Math.min(created.getContentHeight(), cap);
          container.style.height = `${String(height)}px`;
        };
        fit();
        created.onDidContentSizeChange(fit);

        setEditor(created);
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      created?.dispose();
    };
  }, []);

  useEffect(() => {
    if (editor && editor.getValue() !== code) editor.setValue(code);
  }, [code, editor]);

  useEffect(() => {
    if (!editor) return;
    loadMonaco()
      .then((monaco) => monaco.editor.setTheme(theme(dark)))
      .catch(() => undefined);
  }, [dark, editor]);

  // A swipe at Monaco's end (as far as it scrolls that way): kept from its
  // gestures (listening on the document, preventing the moves), so the page
  // scrolls on.
  const touchY = useRef(0);
  const passAtEnds = (event: TouchEvent<HTMLDivElement>) => {
    const y = event.touches[0]?.clientY ?? touchY.current;
    const moved = touchY.current - y;
    touchY.current = y;
    if (!editor || event.type !== 'touchmove') return;
    const top = editor.getScrollTop();
    const end = editor.getScrollHeight() - editor.getLayoutInfo().height;
    if ((moved < 0 && top <= 0) || (moved > 0 && top >= end - 1)) {
      event.stopPropagation();
    }
  };

  return (
    <div className="demo-code">
      <div
        className="demo-code-editor"
        onTouchMove={passAtEnds}
        onTouchStart={passAtEnds}
      >
        <div ref={containerRef} />
      </div>
      {editor ? null : <pre className="demo-code-fallback">{code}</pre>}
      <button
        className="demo-button"
        onClick={() => {
          navigator.clipboard.writeText(code).catch(() => undefined);
        }}
      >
        Copy
      </button>
    </div>
  );
};
