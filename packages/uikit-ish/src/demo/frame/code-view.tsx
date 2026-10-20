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

// Touches on the code don't reach Monaco's gestures (listening on the
// document): they'd keep the page from scrolling (Monaco prevents their
// moves), and the code scrolls natively instead (see CodeView).
const keepTouch = (event: TouchEvent<HTMLDivElement>) =>
  event.stopPropagation();

/**
 * Code shown in Monaco (read-only, TypeScript and JSX colorized), with a
 * button copying it. Monaco is as large as its content (its lines, its
 * longest one), within a native scroll container (capped by style.css,
 * e.g. in frames), so it never scrolls itself. Rendered on the client
 * only: until Monaco is there (and while prerendering), the plain text.
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
          scrollbar: {
            alwaysConsumeMouseWheel: false,
            horizontal: 'hidden',
            vertical: 'hidden',
          },
          theme: theme(initialRef.current.dark),
          // (UTF-8 in samples is intended, e.g. − and ×.)
          unicodeHighlight: { ambiguousCharacters: false },
          value: initialRef.current.code,
        });

        // As large as its content (its lines, its longest one).
        const fit = () => {
          if (!created) return;
          container.style.height = `${String(created.getContentHeight())}px`;
          container.style.width = `max(100%, ${String(created.getContentWidth())}px)`;
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

  return (
    <div className="demo-code">
      <div
        className="demo-code-editor"
        onTouchCancel={keepTouch}
        onTouchEnd={keepTouch}
        onTouchMove={keepTouch}
        onTouchStart={keepTouch}
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
