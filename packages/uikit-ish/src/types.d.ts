declare module '*.png' {
  const content: string;
  export default content;
}

// Component styles (imported for their side effect, bundled by the app).
declare module '*.css';
