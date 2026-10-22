# Contributing to LG Minimal Home

Thank you for considering a contribution. The repository is currently private and in
pre-release development; the maintainers decide when, if ever, outside contributions are
accepted.

## Before changing code

1. Read [Architecture](docs/ARCHITECTURE.md) and [Project status](docs/PROJECT_STATUS.md).
2. Keep the webOS 6 / Chromium 79 target. Do not introduce optional chaining, nullish
   coalescing, module-only runtime loading, or CSS features that are not supported there.
3. Do not add private TV addresses, pairing keys, credentials, root payloads or copied
   proprietary assets.
4. Do not make native Home replacement, boot hooks, firmware changes, root procedures or
   SSH behaviour part of a feature change without an explicit design decision.

## Local workflow

```sh
npm ci
npm test
npm run build
npm run package
```

Run `git diff --check` before proposing a change. `npm run package` is a packaging check;
it does not authorize installation on a TV.

## Pull requests

- Keep each pull request focused and describe the user-visible impact.
- Add or update tests for logic and navigation changes.
- When changing the position of a focusable row, test D-pad movement against its rendered
  screen position; logical array order may differ from visual order.
- State what was tested in a desktop browser and what was tested on a physical TV.
- Mark a feature as experimental unless it has evidence from the target TV/runtime.
- Preserve copyright and licence notices; do not add brand artwork unless its redistribution
  status is documented.

## Security and sensitive reports

Do not publish credentials, LAN addresses, pairing data, exploit details or root-shell
commands in an issue or pull request. Until a private vulnerability-reporting channel is
configured, contact a repository maintainer through a private channel already agreed with
them.
