# Third-party notices

The MIT licence in [LICENSE](LICENSE) covers this project's own source code and app icon
(`public/icon.png`, `public/largeIcon.png`). The materials below retain their own terms.

## Upstream project

LG Minimal Home began as a derivative of
[partridgeworks/webos-launcher](https://github.com/partridgeworks/webos-launcher), licensed
under MIT. Its copyright notice and licence are preserved in
[`public/licenses/webos-launcher-MIT.txt`](public/licenses/webos-launcher-MIT.txt). The
upstream notice remains applicable to copied or derived portions.

## Bundled software

| Component | Licence | Where |
|---|---|---|
| [Preact](https://preactjs.com) | MIT, © Jason Miller | compiled into `assets/app.js`; licence text in [public/licenses/preact-MIT.txt](public/licenses/preact-MIT.txt) |
| [Inter](https://rsms.me/inter/) typeface | SIL Open Font License 1.1, © The Inter Project Authors | `src/assets/inter-latin-wght.woff2`; licence text in [public/licenses/Inter-OFL.txt](public/licenses/Inter-OFL.txt) |

Both licence texts are included in the installed app under `licenses/`.

## Optional weather data

Personal builds may request current conditions from [Open-Meteo](https://open-meteo.com/).
The free API is limited to non-commercial use, and the weather data requires CC BY 4.0
attribution. The app displays the provider name beside the forecast and ships a notice in
`public/licenses/Open-Meteo-attribution.txt`. A generic build has no configured location and
makes no weather request. Weather symbols are original inline SVG, not provider artwork.

## App and input artwork

The distributed source and IPK do not include third-party application logos or LG input-icon
files. Catalogue apps render a project monogram by default. On a rooted TV, the optional
Homebrew Channel provider may read an installed app's icon from that same TV at runtime after
the owner explicitly enables it; that icon is not committed to this repository or shipped in
the IPK.

LG and webOS are trademarks of LG Electronics. Other app names and marks belong to their
respective owners. LG Minimal Home is not affiliated with, endorsed by or sponsored by them.
