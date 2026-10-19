import type * as Monaco from 'monaco-editor/editor/editor.api.js';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { useDark } from './use-dark.js';

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

/**
 * Code shown in Monaco (read-only, TypeScript and JSX colorized), as high
 * as its lines, with a button copying it. Rendered on the client only:
 * until Monaco is there (and while prerendering), the plain text.
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
          scrollbar: { alwaysConsumeMouseWheel: false },
          theme: theme(initialRef.current.dark),
          // (UTF-8 in samples is intended, e.g. − and ×.)
          unicodeHighlight: { ambiguousCharacters: false },
          value: initialRef.current.code,
        });

        // As high as its content (its lines, and a scroll bar).
        const fit = () => {
          container.style.height = `${String(created?.getContentHeight())}px`;
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
        ref={containerRef}
        className="demo-code-editor"
      />
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
