// The demo's icons and web app manifest (see index.html): emitted as they
// are (`assets/[name][ext]`, see webpack.config.js), for its links.
import.meta.webpackContext('./', {
  recursive: true,
  regExp: /\.(?:png|svg|webmanifest)$/u,
});
