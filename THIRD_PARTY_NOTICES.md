# Third-party notices

The MIT licence in [LICENSE](LICENSE) covers this project's own code and its app icon
(`public/icon.png`, `public/largeIcon.png`). The following material belongs to others and
is **not** covered by that licence.

## Upstream project

LG Minimal Home began as a derivative of
[partridgeworks/webos-launcher](https://github.com/partridgeworks/webos-launcher), licensed
under MIT. Its copyright notice and licence are preserved in
[`public/licenses/webos-launcher-MIT.txt`](public/licenses/webos-launcher-MIT.txt).
The project has since changed its app identity, visual design and implementation, but the
upstream notice remains applicable to copied or derived portions.

## Bundled software

| Component | Licence | Where |
|---|---|---|
| [Preact](https://preactjs.com) | MIT, © Jason Miller | compiled into `assets/app.js`; licence text in [public/licenses/preact-MIT.txt](public/licenses/preact-MIT.txt) |
| [Inter](https://rsms.me/inter/) typeface | SIL Open Font License 1.1, © The Inter Project Authors | `src/assets/inter-latin-wght.woff2`; licence text in [public/licenses/Inter-OFL.txt](public/licenses/Inter-OFL.txt) |

Both licence texts are included in the installed app under `licenses/`.

## App and input icons

`public/icons/apps/` contains the icons of third-party TV apps, and `public/icons/inputs/`
contains input-type icons from LG's webOS software. They are trademarks or copyright of
their respective owners. This project is not affiliated with, endorsed by or sponsored by
any of them.

They are included in good faith, only so the launcher can show recognisable tiles for apps
and inputs already installed on the user's own TV. Rights holders who would like an icon
removed can open an issue on this repository and it will be removed. Every app tile falls
back to a plain text tile without its icon, so removal doesn't break anything.

The repository does not yet include licences or permissions proving that every branded app
icon and LG input icon may be redistributed in a public repository. They must be reviewed
or replaced before a public release; see `docs/OPEN_SOURCE_READINESS.md`.

"LG" and "webOS" are trademarks of LG Electronics.
