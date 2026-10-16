#!/usr/bin/env bash

# Copies the CSS files the compiled modules import (`tsc` only emits
# scripts) from `src` to `dist`, at the same paths: the components'
# (`src/components/**/*.css`) and the global tokens (`src/styles.css`,
# imported by `styles.js`).

set -euo pipefail

cd "$(dirname "$0")/../src"

while IFS= read -r -d '' file; do
	mkdir -p "../dist/$(dirname "$file")"
	cp "$file" "../dist/$file"
done < <(find components styles.css -name '*.css' -print0)
