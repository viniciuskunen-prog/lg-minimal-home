#!/bin/sh
# Packages dist/ into an .ipk in build/ using the webOS CLI (installed as a dev dependency).
# `--no-minify` because ares' legacy minifier cannot parse modern bundler output.
set -e
cd "$(dirname "$0")/.."
[ -d dist ] || { echo "dist/ missing — run 'npm run build' first" >&2; exit 1; }
output_dir=${LG_PACKAGE_OUTPUT:-build}
# A local HBC repository serves files directly from build/. Never replace its
# published IPK while repo.json/manifest still advertise the previous hash.
if [ -f "$output_dir/repo.json" ]; then
	echo "$output_dir is serving a Homebrew repository; set LG_PACKAGE_OUTPUT to a separate staging directory" >&2
	exit 1
fi
# Ship this project's own licence next to the third-party ones (public/licenses/).
mkdir -p dist/licenses
cp LICENSE dist/licenses/LICENSE.txt
mkdir -p "$output_dir"
npx ares-package dist --no-minify -o "$output_dir"
echo "Packaged into: $output_dir"
