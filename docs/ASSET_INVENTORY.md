# Visual asset inventory and migration record

**Migration branch:** `chore/open-source-icon-migration`  
**Decision:** do not redistribute unlicensed third-party app artwork or LG input artwork.

## Assets retained in the distributed project

| Asset | Classification | Evidence / use |
| --- | --- | --- |
| `public/icon.png`, `public/largeIcon.png` | Project-owned, pending maintainer ownership confirmation | Declared as the project's own app icon in the prior notice; used by `appinfo.json` |
| `src/assets/inter-latin-wght.woff2` | Licensed third-party asset | SIL Open Font License 1.1 text retained in `public/licenses/Inter-OFL.txt` |
| Inline source glyphs in `src/components/Glyph.tsx` | Original project code | Authored SVG paths for launcher actions and inputs |

## Assets removed from the distributed project

Every file below was introduced with the initial launcher import and had no individual
redistribution permission recorded in the repository. Their prior provenance was either a
third-party app logo or an LG/webOS input icon. They are removed rather than relicensed by
assertion.

### Application artwork — third-party marks (22 PNGs)

```text
amazon.alexa.view.png                 amazon.png
bbc.iplayer.3.0.png                  bbc.sounds.1.0.png
cdp-30.png                           com.apple.appletv.png
com.fvp.ch4.png                      com.fvp.itv.png
com.fvp.uktv.png                     com.lennylxx.iptv.png
com.webos.app.browser.png            com.webos.app.homeconnect.png
com.webos.app.igallery.png           com.webos.app.mediadiscovery.png
com.webos.app.sportsteamsettings.png demand5.png
now.tv.png                            org.webosbrew.hbchannel.png
org.webosbrew.inputhook.png          org.webosbrew.safeupdate.png
tv.twitch.tv.starshot.lg.png         youtube.leanback.v4.png
```

Twenty-one were referenced by `src/config/catalog.ts`; `com.webos.app.sportsteamsettings.png`
was not referenced. The catalogue now uses app title + project monogram. This preserves the
ability to identify and launch known app IDs without bundling a logo.

### Input artwork — LG/webOS-derived files (30 PNGs)

```text
HDMI_1.png       HDMI_2.png       HDMI_3.png       HDMI_4.png       HDMI_sub.png
antenna.png      av.png           bluray.png       camera.png       component.png
dlna.png         dvd.png          gameconsole.png  hdmigeneric.png  hometheater.png
inputhub.png     mediaServer.png  mobile.png       pc.png           portaltv.png
satellite.png    scart.png        screenshare.png  settopbox.png    sound.png
streamingbox.png tv.png           usb-port.png     usb.png          vcr.png
```

These had been used as image fallbacks for the External Input Manager (EIM) response and in
desktop mock data. The launcher now maps EIM's textual hint to authored inline glyphs:
television, HDMI, USB, antenna or generic device. It never reads or packages the returned
LG icon path.

## Runtime icon policy

The public Application Manager API provides `getAppLoadStatus` for a known app ID, not a
public installed-app list or icon API. Therefore the non-root path is intentionally:

```text
known catalogue ID -> public existence check -> title + monogram -> launch
```

The optional, default-off Homebrew provider can obtain a live app list and icon from the TV
owner's local system. Its runtime `data:` URL is used only for that running app and is cached
in that app's local storage. It is not committed, released or used as a non-root requirement.

For the wide app rail, the launcher now samples an opaque, nearly uniform edge of that
runtime icon and uses the sampled colour behind the contained image. This makes a square
official app icon sit naturally in a rectangular card without stretching or cropping its
mark. Transparent or mixed-colour edges keep the catalogue colour; a missing/broken image
returns to the monogram. No sampled logo or colour is written to Git or the IPK. This is
tested in the desktop suite, but the six reference-TV apps still need visual verification
on the TV before claiming that their supplied artwork looks correct.

References: [LG Application Manager](https://webostv.developer.lge.com/develop/references/application-manager)
and the [LG developer community statement on installed-app lists](https://forum.webostv.developer.lge.com/t/how-to-get-applist/8616).

## Historic cleanup before publication

Removing files from the current tree does not remove them from reachable Git history. Do not
rewrite history without explicit authorization. Before making the repository public, choose:

1. **Authorized filtered-history migration:** make an immutable backup, run a reviewed
   `git filter-repo` operation that removes only `public/icons/apps/` and
   `public/icons/inputs/`, scan all refs and artifacts again, then coordinate a forced remote
   update with every collaborator; or
2. **Fresh public mirror:** create a new repository from the cleaned source snapshot, retain
   licence/provenance notices, and keep this original private repository as the historical
   record.

The fresh-mirror option avoids rewriting an existing private collaboration history. Neither
option is performed by this branch.
