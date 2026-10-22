# Home button and startup: investigation, not a shipped feature

This document records a proposed, reversible investigation for the reference LG
43UP7500PSF (webOS 6.5.3-47 / firmware 03.53.45). It is **not** a tested recipe and does
not authorize changes on another TV. The v0.1.7 owner reported the launcher UI looks OK;
button interception and boot launch have not been tested.

## Three different behaviours

| Behaviour | Current status | Likely mechanism |
| --- | --- | --- |
| Open Minimal Home manually | Working on reference TV, owner-reported | Ordinary webOS app launch |
| Open it with physical Home | Not implemented or tested | Separate root-enabled remote-key mapper, not a web-app key handler |
| Open it when the TV turns on | Not implemented or tested | Separate Homebrew startup hook that launches the app after the application manager is ready |

Neither of the last two replaces LG's signed/native Home process. The **Início LG** tile
must remain available as a recovery path. The current IPK contains no hook, input interceptor
or background service, and the default app remains usable without root.

## Evidence and limits

- [LG's Magic Remote guide](https://webostv.developer.lge.com/develop/guides/magic-remote)
  identifies the Home button as a system Home action. The regular app should not claim to
  intercept it itself.
- [LG's app lifecycle guide](https://webostv.developer.lge.com/develop/guides/app-lifecycle-management)
  describes application launch through Application Manager or `ares-launch`.
- [LG Input Hook](https://github.com/Simon34545/lginputhook) documents root-required remote
  mapping, including an `Execute` action and persistent mappings after first launch. Its
  documentation says to identify the button ID from device logs. It does **not** establish
  that Home interception works on this exact model/firmware; installation and
  logging have been observed, but remapping has not been tested.
- [webOS Homebrew Channel](https://github.com/webosbrew/webos-homebrew-channel) documents
  executable user hooks in `/var/lib/webosbrew/init.d`. Its startup script invokes them via
  `run-parts`. [webOS Homebrew's hook guide](https://github.com/webosbrew/pages/blob/main/content/pages/hacking/overlays.md)
  recommends a symlink to an app-owned script so uninstalling that app does not leave a
  dangling independent copy. This confirms the hook mechanism, **not** timing or safety for
  this launcher on the reference TV.

## Proposed gates, in order

1. **Baseline:** confirm the installed app ID/version, manual launch, essential apps,
   Início LG escape tile, Homebrew root status, failsafe off and whether the TV is really
   cold-booting rather than waking from standby. Obtain the correct TV IP by a device-side
   check; an ARP entry alone is insufficient. Preserve a working recovery route.
2. **Read-only inspection:** identify the Home key ID on this remote, check whether an
   input-hook implementation is already installed, and inspect any existing user boot hooks
   for conflicts. Do not remap a key merely because an online list assigns it a number.
3. **Manual launch test:** verify a launcher command using the installed app ID while no
   boot or key hook is active. Failure here rules out the later steps.
4. **Button pilot:** test a nonessential key first if available; then consider mapping Home
   while preserving an alternate way to reach LG Home. Verify behaviour from an app, Live TV,
   HDMI and the launcher. A brief appearance of stock Home may be unavoidable; record it.
5. **Startup pilot:** only after manual launch and recovery are proven, test an app-owned,
   idempotent Homebrew hook with bounded retry for Application Manager readiness. Test a cold
   boot and a standby wake separately. Never edit the system Home package or firmware.
6. **Rollback rehearsal:** remove/disable the key mapping and hook, reboot, then confirm the
   stock Home button and power-on behaviour return. Record exact device-specific commands
   only after they have been validated on the reference TV.

Any installation of a key mapper, persistent remap, boot hook or reboot requires a separate
approval after showing the exact changes and rollback. Root-level input hooks can break
remote navigation; a bad boot script can trigger failsafe or delay startup. Do not disable
failsafe to make a test pass. Keep updates disabled as requested by the device owner.

## Current checkpoint

The v0.1.7 UI is owner-accepted. The owner installed and opened LG Input Hook on the
reference TV. A photo shows an empty keybind list and startup log messages indicating that
the input hook initialized; no mapping or Home-key ID has been confirmed. Its
[original README](https://github.com/Simon34545/lginputhook) says that opening it once
starts its persistent service. Do not assume this means any button has been remapped.
The photo also displayed the Input Hook web UI password; do not copy it into this repository
or other documentation. Future diagnostic photos should crop out credentials.

A subsequent photo showed `ezinject-lginput2.log` with library mappings only. It is
injector output, not a captured Home-key event: no `id =>` value is visible. The
next read-only step is to select the log appropriate to the remote under
**View logs**, press Home once, and inspect the latest lines. Do not add or save a keybind before confirming the device-specific ID
and reviewing rollback.

A third photo shows `lginput-hook-micomservice.log`, whose UI description says
IR remote on webOS 5.x and up. It records repeated `code=106` and also
`code=105` and `code=28` with key-state values. The upstream
[button-ID table](https://github.com/Simon34545/lginputhook/blob/main/Button%20IDs.md)
maps 105/106 to left/right on one Magic Remote model, but the photographed
sequence does not isolate a Home press on this TV. Do not infer that 28 is Home.
The earlier instruction to use only `lginput-hook-lginput2.log` was too narrow:
the applicable log depends on the remote and webOS version. Compare the
micomservice log immediately before and after one Home press; no keybind yet.

A closer photo of the same log tail still ends with codes 106, 105 and 28;
there is no distinguishable new Home event. Observe the log from a separate
device on the same LAN while pressing Home, or compare another input log
offered by the app, to avoid confusing navigation back into the app with the
Home press. Code 28 is not established as Home.

Five further photos identify a physical-button LG IR remote with a dedicated
Home key, not a pointer-style Magic Remote. `lginput2` shows hook startup only;
`testapp`, `tvservice` (IR on webOS 4.x and earlier) and `RELEASE` (older
versions) show `ENOENT`. For this webOS 6 setup, `micomservice` remains the
primary IR log. The author's [IR keycode list](https://gist.github.com/Simon34545/31c528bfe8540880936fc4c580723a02)
maps 105 to Left, 106 to Right, 28 to Enter and 773 to Home **on his
catalogued remote**. The first three fit observed navigation; 773 is a
candidate, not a confirmed ID for the owner's remote. Observe a single Home
press from another device on the same LAN and compare the new micomservice
event before configuring any keybind.

The owner subsequently reported that pressing Home on this TV produced key
code `773`. This is an **owner-reported observation** consistent with the
upstream IR list, not a log capture stored in this repository and not proof
that Input Hook can replace Home on this firmware. The installed Minimal Home
ID in `public/appinfo.json` is `com.viniciuskunen.lgminimalhome`. LG's
[Application Manager API](https://webostv.developer.lge.com/develop/references/application-manager)
supports launching an app by ID, but the exact shell command in Input Hook's
Execute field has not been tested on this TV. Before saving a persistent rule,
verify manual launch, an independent route back to LG Home and Input Hook,
and a pilot mapping of a nonessential key.

The owner has no terminal installed on the TV. A later Homebrew Channel 0.7.3
photo shows root `ok`, SSH on, Telnet off, update blocking on and failsafe off.
The available Mac SSH key was rejected; do not guess a password. Read-only LAN
probes found SSAP ports 3000/3001 reachable. Standard LG SSAP pairing is a
possible terminal-free route to test a one-time app launch, but pairing creates
a persistent Mac-to-TV trust relationship and has **not** been initiated;
obtain owner approval before starting it. Turn SSH off after authorized tests
if no longer needed.

With the owner's specific approval, the Mac connected to SSAP over `wss`/3001
and requested pairing with only the `LAUNCH` permission. The owner accepted
the TV prompt. One `ssap://system.launcher/launch` request for
`com.viniciuskunen.lgminimalhome` returned `returnValue: true`, and the owner
confirmed that the app appeared on screen. This validates one manual launch
over SSAP on the reference TV, **not** compatibility of a shell command in
Input Hook's Execute action. The pairing key remained only in the test
process memory and was not written to the repository or local storage. No
keybind, boot service or firmware change was made. Confirm an independent
recovery path before the nonessential-key pilot.

The owner then tested the **Início LG** tile in Minimal Home and confirmed it
returns to stock LG Home. This is a working exit **when Minimal Home is already
open**, not sufficient recovery if a future keybind prevents the app from
launching. Before any rule, capture the actual ID of a nonessential colour
key (for example Blue) in `micomservice`, and confirm a route to Input Hook
that does not depend on the remapped Home button.

The reference TV was previously identified on the local
network by SSDP. A read-only probe on 22 October 2026 found SSAP responding and an SSH
server answering, but key-only SSH authentication returned `Permission denied`. The owner
then clarified that the TV was powered off at the time. These responses therefore do **not**
prove that the display or launcher was running, or that a cold boot had occurred; standby
network services may remain available. The probe proves only network reachability, **not**
authenticated access or hook state. No password guessing was
attempted. Apart from the owner-reported `773`, no captured key log, boot-hook inventory, recovery method or tested
launch command has been recorded yet. The owner installed Input Hook, but this project has
not installed a keybind or boot hook. After the owner clarified that the TV was now on, a second read-only probe
again found SSAP responding; SSH still rejected the available key. This confirms current
network connectivity but does not reveal installed key mappers or startup hooks. SSH should
not remain enabled indefinitely; its current switch state must be confirmed with the owner
before the next device-side phase.
