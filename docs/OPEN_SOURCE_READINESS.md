# Open-source readiness audit

**Status:** prepared for independent review, not cleared for publication.

**Branch:** `chore/open-source-readiness`  
**Scope:** source history, tracked files, licence/attribution, documentation and CI. No TV,
firmware, root or application-runtime change is included in this audit.

## Evidence collected

| Check | Result | Notes |
| --- | --- | --- |
| Current tracked-file scan | No credentials, pairing keys, private LAN addresses or private-key blocks detected | Package-lock integrity hashes and the workflow's ephemeral `github.token` are expected normal metadata |
| Full reachable Git history scan | No credential pattern match found | No history was rewritten |
| Ignored-file review | `tv.env`, local catalogue, build output and dependencies are ignored | Ignore rules now also cover common environment/key/certificate files |
| Git author metadata | Personal author e-mail addresses exist in earlier commits | Publication risk remains; history was intentionally not rewritten |
| Upstream licence | MIT notice from `partridgeworks/webos-launcher` preserved | New copy in `public/licenses/` is packaged with the app |
| Bundled dependencies | Preact MIT and Inter OFL texts are present | See third-party notices |
| GitHub Actions | Build workflow now runs tests, build, Chromium 79 guard and packaging on every push and PR | Tag release also runs tests before publishing release assets |

## Publication blockers and decisions

### 1. Trademarked and proprietary icons — removed from the current tree

The current migration branch no longer distributes third-party streaming logos or LG input
icons. Apps use a monogram by default; input glyphs are authored inline SVG. The optional
Homebrew path reads an icon only from the owner's TV at runtime and remains disabled by
default. See [the asset inventory](ASSET_INVENTORY.md).

The removed files remain reachable in history. Before making the repository public, choose
one of these paths:

1. obtain and record permission/licences for every asset; or
2. remove those assets and use original neutral icons/monograms; or
3. move them to a separately distributed, owner-supplied local asset pack.

No history rewrite was performed in this branch.

### 2. Historical author identities — unresolved

Reachable commits include author e-mail addresses. Removing them would require a history
rewrite, which this audit was explicitly not authorized to perform. Decide whether those
addresses are acceptable before changing repository visibility.

### 3. Runtime claims — intentionally limited

The project has code and local tests, but it is not yet proven as a primary home screen across
LG webOS models. Public copy must continue to state that it is a standalone app and must not
claim native Home replacement, autostart or universal compatibility.

### 4. Dependency findings — review required

The previous functional audit recorded two high-severity transitive findings associated with
the development packaging CLI. Do not run an automatic lockfile rewrite merely to silence
that report; upgrade or replace the packaging tool only after checking webOS IPK compatibility.

## Changes made by this branch

- English project, architecture, development, status and readiness documentation.
- Contribution guidance with security and compatibility constraints.
- Correct project copyright plus preserved upstream MIT notice.
- Explicit third-party asset warning.
- Removal of bundled third-party/LG app and input icon files, with authored visual fallbacks.
- Broader ignore rules for local secrets and certificates.
- Tests executed in pull-request/push CI and before tag releases.

## Before changing visibility

1. Resolve the icon licensing decision.
2. Decide whether historic author e-mails may remain public.
3. Review all documentation for claims that exceed physical-TV evidence.
4. Enable GitHub private vulnerability reporting and branch protection.
5. Review release workflow permissions and confirm who may create version tags.
6. Run the validation checklist in `PROJECT_STATUS.md` on each advertised compatibility tier.
