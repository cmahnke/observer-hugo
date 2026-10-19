#!/bin/sh
# Builds a minimal throwaway test site in memory (--renderToMemory) to verify
# that the theme templates, SCSS and JS build without errors. This is not a
# demo site - the fixture is generated on the fly and deleted afterwards.
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
THEME_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT

SITE="$WORK/site"
mkdir -p "$SITE/themes" "$SITE/content/posts" "$SITE/assets/scss"
ln -s "$THEME_DIR" "$SITE/themes/observer-hugo"

write_base_config() {
  cat > "$SITE/hugo.toml" <<EOF
title = "Test"
baseURL = "https://example.org/"
theme = "observer-hugo"
defaultContentLanguage = "en"
ignoreLogs = ['warning-goldmark-raw-html']

[params]
enableImageViewer = $1
enablePDFViewer = $1

[pagination]
pagerSize = 1

[module]
  [[module.mounts]]
    source = "assets"
    target = "assets"
  [[module.mounts]]
    source = "content"
    target = "content"
  [[module.mounts]]
    source = "node_modules/lightgallery/dist/css"
    target = "assets/css/lightgallery"

[security.node.permissions]
allowRead = ["*"]
EOF
}

cat > "$SITE/content/_index.md" <<'EOF'
---
title: "Home"
---
EOF

cat > "$SITE/content/posts/post-a.md" <<'EOF'
---
title: "Post A"
date: "2024-01-01"
tags: ["alpha"]
---
Hello [world](https://example.com/)
EOF

sed 's/Post A/Post B/;s/2024-01-01/2024-01-02/' "$SITE/content/posts/post-a.md" > "$SITE/content/posts/post-b.md"

if [ "${2:-false}" = "true" ]; then
  mkdir -p "$SITE/content/posts/gallery-post"
  python3 - <<'PYEOF'
import zlib, struct
def png(w, h):
    def chunk(t, d):
        c = struct.pack('>I', len(d)) + t + d
        return c + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0)
    raw = b''.join(b'\x00' + b'\x30\x60\x90' * w for _ in range(h))
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b'')
open('img1.png', 'wb').write(png(1600, 900))
PYEOF
  cat > "$SITE/content/posts/gallery-post/index.md" <<'EOF'
---
title: "Gallery Post"
date: "2024-02-01"
resources:
- src: "img1.png"
---
Gallery
EOF
fi

build() {
  (cd "$SITE" && hugo --renderToMemory --gc)
}

# Dart Sass is required - the theme no longer supports the libsass fallback
if ! command -v sass > /dev/null 2>&1 && ! command -v dart-sass-embedded > /dev/null 2>&1; then
  echo "ERROR: no Dart Sass binary (sass or dart-sass-embedded) found in PATH" >&2
  exit 1
fi

echo "== Build 1: viewers disabled =="
write_base_config false
echo '@use "observer";' > "$SITE/assets/scss/base.scss"
build

if [ -f "$THEME_DIR/node_modules/lightgallery/package.json" ]; then
  echo "== Build 2: viewers enabled =="
  write_base_config true
  echo '@use "observer";' > "$SITE/assets/scss/base.scss"
  ln -s "$THEME_DIR/node_modules" "$SITE/node_modules"
  build
else
  echo "== Build 2 skipped: node_modules not installed =="
fi

echo "All builds passed."
