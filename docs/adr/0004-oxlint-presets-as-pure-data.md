# Oxlint presets are pure data, not `defineConfig` output

The Oxlint presets (`oxlintBase`, `oxlintNest`, …) are plain objects typed with
`satisfies OxlintConfig` from a **type-only** import, never wrapped in Oxlint's
`defineConfig`. This keeps the `/oxlint` entry free of any Oxlint runtime:
importing a preset pulls in zero executable Oxlint code, which is what lets the
subpath stay cheap (see [ADR-0001](./0001-subpath-per-tool-exports.md)).

Why not `defineConfig`: it would make the preset module import Oxlint's runtime,
defeating the lazy loading the subpath split exists to provide.
