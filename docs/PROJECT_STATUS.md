# Project status

This page distinguishes code that exists from behaviour proven on a physical TV. It is not a
roadmap commitment.

## Implemented in the codebase

| Area | Current implementation | Evidence |
| --- | --- | --- |
| Standalone launcher UI | Home, Sources, More and Settings screens with remote/key navigation; vertical D-pad follows the rendered bottom app rail | Source and Vitest navigation tests |
| Launching | Uses public `applicationManager/launch` calls for apps and LG Home | Source review; device-specific validation remains required |
| Local app catalogue | Filtered list based on `getAppLoadStatus`; app title + project monogram, no bundled app logos | Source and build |
| Configuration | App/source selection and order in app-local `localStorage` | Vitest persistence and order tests |
| Chromium 79 build | IIFE bundle with syntax guard | Local build and CI workflow |
| IPK packaging | `ares-package` package in `build/` | Local packaging verification |

## Experimental / constrained

| Area | Constraint | Status |
| --- | --- | --- |
| Homebrew live app list | Runs fixed commands through a privileged Homebrew service; explicit opt-in only | Six selected apps appeared with runtime icons on the reference TV; other TVs unproven |
| Live icon loading | Reads app icon paths supplied by the TV only through the optional Homebrew provider and caches base64 data locally | Six runtime icons observed on the reference TV |
| Wide icon cards | Samples a uniform opaque icon edge for the card background; keeps aspect ratio and falls back to a monogram if artwork fails | Later TV photo shows brand-coloured wide cards; precise installed version was not visible |
| App-rail and utility alignment | App rail has no visible section heading; compact rows start under their headings; Browser card is white with a readable fallback. The next revision sizes app cards by count, reserves focus-safe side insets and moves them optically down; Settings uses a toothed gear. | Earlier alignment observed in owner photo; dynamic sizing and gear have local tests/build only, with on-TV validation pending |
| Inputs and TV services | Luna service responses vary across model, firmware and region | Needs per-device manual validation |
| Compatibility outside the reference setup | The build target is broad, but runtime service compatibility is not proven broadly | Unknown |

## Not implemented

- Replacing the native LG Home application.
- Taking over the physical Home button.
- Launching at boot or a background service.
- Rooting a TV, installing Homebrew Channel or changing firmware.
- Controlling/removing advertising in the native LG interface.
- Cross-device sync, cloud account, telemetry or analytics.
- A public compatibility matrix or automated hardware-in-the-loop tests.

## Validation still required

Before calling a release stable, validate on the target TV:

1. startup, focus, arrow/OK/Back navigation and pointer behaviour;
2. app and input launch flows, including errors/fallbacks;
3. Settings selection and reordering persistence;
4. the local-catalogue path on a non-rooted or Homebrew-disabled setup;
5. the optional Homebrew path only after explicit consent;
6. compatibility across model, region and firmware where support is claimed.

Do not treat a successful build or desktop session as confirmation of any of the above.

## Latest on-TV finding

The owner confirmed v0.1.4 installed after the checksum issue was repaired. Later photos show
six installed-app icons loaded through the optional Homebrew path, wide cards and the updated
row alignment. The latest photo revealed that app cards appear slightly high in their rail,
leave too much unused width and the Settings glyph resembles a sun. v0.1.7 addresses these
findings in code; physical-TV validation of that version is still pending. The photo alone
does not show a version number.
