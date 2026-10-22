# LG Minimal Home documentation

LG Minimal Home is an in-development, standalone webOS application for a clean,
remote-first home-screen experience. This repository is private and no public release is
being made by this documentation work.

## Start here

- [Project status](PROJECT_STATUS.md) — implemented behaviour, experiments and known gaps.
- [Architecture](ARCHITECTURE.md) — runtime boundaries, source layout and data flow.
- [Development](DEVELOPMENT.md) — install dependencies, test, build and package safely.
- [Open-source readiness](OPEN_SOURCE_READINESS.md) — publication audit, evidence and
  remaining blockers.
- [Visual asset inventory](ASSET_INVENTORY.md) — removed icon assets, runtime policy and
  historic-cleanup strategy.

The existing Portuguese documentation remains available and is not superseded:

- [Rooting an LG webOS TV with SlopBro](ROOT_WEBOS_LG.md)
- [Root and Homebrew capabilities](CAPACIDADES_ROOT_E_HOMEBREW.md)
- [Functional audit](AUDITORIA_FUNCIONAL.md)

## Current boundary

The application does **not** replace the native LG Home screen or intercept the physical
Home button. It does not install root, change firmware, configure boot hooks or remove
native advertising. Those are independent investigations and are out of scope for the
current codebase.

## Validation note

The reference-TV owner confirmed v0.1.4 installed after the vertical D-pad correction. A
subsequent photo showed all six selected shortcuts with icons supplied at runtime through the
optional Homebrew integration; it does not prove support on other TVs. The latest alignment
changes are desktop-previewed but still require an on-TV check.
