# Development and testing

## Requirements

- Node.js 18 or newer.
- npm (the lockfile is authoritative).
- `@webos-tools/cli` is installed from the development dependencies and is needed only for
  creating the IPK.

No TV, root access, LAN address, SSH key or pairing data is needed to run unit tests or make
a desktop layout build.

## Safe local loop

```sh
npm ci
npm test
npm run build
npm run package
git diff --check
```

`npm run dev` starts a Vite development server for desktop layout work. Desktop mode uses the
local catalogue because PalmServiceBridge does not exist there; it is not a substitute for a
real webOS validation.

For a personal weather preview, copy `.env.weather.example` to ignored `.env.local` and set
the city name and coordinates. The generic build has no city and makes no weather request.
The weather request uses Open-Meteo's free endpoint only for non-commercial use. Check its
terms before distributing a configured build; do not commit a household location.

## Chromium 79 compatibility

webOS 6 cannot parse all modern JavaScript and CSS. Before proposing a change:

- keep `vite.config.ts` targeting `chrome79` and producing a classic script;
- avoid optional chaining (`?.`) and nullish coalescing (`??`) in emitted code;
- avoid relying on unsupported CSS features such as `gap`, `inset` and `aspect-ratio`;
- run the build, which is followed by the CI syntax guard.

## Configuration and privacy

Copy `src/config/catalog.local.example.ts` to the ignored
`src/config/catalog.local.ts` to maintain a local app list. Do not add a real TV address,
user's app inventory, device identifier, pairing information or credentials to tracked files.

`tv.env.example` is intentionally non-routable. A real `tv.env` is ignored by Git. The
additional `.gitignore` rules also cover `.env` files and common key/certificate extensions.

## Packaging is not deployment

`npm run package` only creates an IPK. `npm run install:tv` and `npm run deploy` use SSH and
can install the app on a rooted TV. They are intentionally outside normal development and
must not be run without explicit authorization from the TV owner. They do not change firmware
but are still state-changing operations.

Use standard webOS developer tooling for non-rooted development. Do not add device secrets to
this repository to automate an installation.

## Tests

Vitest covers configuration persistence, ordering and core remote-navigation flows. It does
not emulate Luna services, a physical remote, model/region differences or the webOS browser.
For changes that cross those boundaries, record the exact device, firmware and manual test
result in the pull request rather than assuming desktop success proves TV compatibility.

For layout changes, test D-pad direction against the row's **rendered position**, not merely
its array or DOM order. The app rail is intentionally rendered at the bottom and starts with
focus, so its first valid vertical move is Up.
