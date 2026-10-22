# Architecture

## Scope

LG Minimal Home is a regular `type: web` webOS app with application ID
`com.viniciuskunen.lgminimalhome`. It runs in its own sandbox. It is not a replacement for
LG's native Home process and it does not install a boot hook or background service.

The current target is webOS 6's Chromium 79. `vite.config.ts` emits one classic IIFE bundle
and the CI workflow rejects optional chaining and nullish coalescing in the generated bundle.

## Runtime flow

```text
Magic Remote / keyboard
          |
          v
       hooks/useKeys + useOkPress
          |
          v
        app.tsx state
          |----------------------------|
          v                            v
      screens/Home                 screens/Settings
          |                            |
          v                            v
 components/Row, Grid, Tile       components/OptionList
          |
          v
 lib/launch, lib/inputs, lib/apps, lib/storage, lib/luna
          |
          v
 webOS public LS2 services / optional Homebrew Channel service
```

`app.tsx` owns the app configuration, selected row/item and loading lifecycle. UI components
are presentation-focused. `lib/` contains the platform boundary and keeps PalmServiceBridge
calls out of components.

## Directional navigation and visual order

The ambient layout renders the primary application rail at the bottom of the screen, even
though it remains the first logical `HomeRow` so it receives initial focus. `Home` therefore
maps vertical D-pad input to **physical** position rather than array order: from the app rail,
Up selects the next row rendered above it and Down stays at the lower boundary. Left and Right
move within the focused row.

Any future layout that changes a row's physical position must update this mapping and its
navigation tests together. DOM order alone is not evidence of the correct D-pad direction.

## Optional weather preview

`src/components/Weather.tsx` reads build-time location values from an ignored `.env.local`.
Without all three values, it renders nothing and makes no weather request. In a configured
personal build, `src/lib/weather.ts` requests current temperature, weather code and day/night
from Open-Meteo over HTTPS, refreshes every 30 minutes while visible and hides the card on
failure. The symbols are original inline SVG with low-motion CSS; reduced-motion preference
disables their animation. No geolocation permission or root service is used. This path is
previewed on desktop and still requires testing in the webOS browser.

## App discovery providers

### Local catalogue — default

`src/config/catalog.ts` ships a curated catalogue and optional local override shape. On a
webOS TV, each catalogue entry is checked with
`com.webos.applicationManager/getAppLoadStatus`; only applications reported as present are
shown. This does not require root.

`src/config/catalog.local.ts` is intentionally ignored by Git. Developers can create it from
`catalog.local.example.ts` for a local build without publishing a household-specific app list.

### Homebrew live list — experimental and opt-in

When `useHomebrew` is explicitly enabled in Settings, `src/lib/apps.ts` asks the Homebrew
Channel service to list launch points and to read icon files. Homebrew executes those fixed
commands with root privileges. Paths are allow-listed and shell-quoted; app identifiers are
never interpolated into shell commands. A failure falls back to the catalogue.

This path is off by default and must remain optional. It is not a requirement for the app to
run and is not a mechanism for rooting a TV.

## Persistence

`src/lib/storage.ts` stores the selected apps, sources and the Homebrew opt-in under
`lg-minimal-home-config-v1` in the application's own `localStorage`. It neither reads nor
writes native webOS settings. Existing saved preferences are preserved when defaults evolve.

## Packaging and release assets

1. `npm run build` type-checks and creates `dist/`.
2. `npm run package` copies licence notices into `dist/licenses/` and invokes `ares-package`
   to create an IPK in `build/`.
3. `npm run manifest` creates a Homebrew-compatible manifest only when a repository name is
   supplied. It does not publish anything.
4. The tag-triggered release workflow can create a GitHub Release. It has no TV credentials
   and cannot install the app on a device.

## Deliberate boundaries

- No native Home replacement, Home-button interception or automatic startup.
- No firmware, system-service or boot-script changes.
- No analytics SDKs or application telemetry. A personally configured weather build makes
  the documented HTTPS request to Open-Meteo; an unconfigured build makes none.
- No stored credentials, pairing keys or TV addresses in tracked source.
