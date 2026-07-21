# @govnotech/conventions

The shared vocabulary for the conventions package — the words used consistently
across presets, add-ons, source, and docs. These define the concepts, not their
implementation.

## Language

### Artifacts

**Tool**:
One of the three programs a preset targets — Oxfmt (formatter), Oxlint (fast
linter), or ESLint (type-aware linter). Each maps to one subpath.
_Avoid_: linter (two of the three are linters), formatter (only one is)

**Subpath**:
A per-tool package entry — `/oxfmt`, `/oxlint`, `/eslint`. The unit of lazy
loading; there is no bare `.` entry.
_Avoid_: entry, module

**Preset**:
The config artifact a consumer picks exactly one of, per tool × stack
(`oxlintBase`, `defineConfigEslintNest`, …).
_Avoid_: config, ruleset

**Stack**:
The target a preset is tuned for: base, nest, vue, or quasar.
_Avoid_: flavor, variant, framework

**Base**:
The foundational preset every stack widens; carries the universal, low-noise
rules.
_Avoid_: default, common, core

**Add-on**:
An optional, our-side layer spread onto a preset for a library or concern
(Playwright, Vitest, Drizzle, …). Exposed as a single flat `.config`.
_Avoid_: plugin, extension

**Plugin**:
An upstream package (`eslint-plugin-*`, an Oxlint plugin) that a preset or
add-on bundles. Never our own layer.
_Avoid_: (calling an add-on a "plugin")

### Rule model

**Category**:
An Oxlint rule group toggled wholesale — correctness, suspicious, perf, style,
restriction, nursery.
_Avoid_: group, class

**Type-aware** / **Syntactic**:
The split that divides the two linters. Type-aware rules need type information
and are ESLint's domain; syntactic rules need none and are Oxlint's.
_Avoid_: type-checked (for this split)

**Disable layer**:
The generated ESLint configs — derived from the matching Oxlint preset via
`buildFromOxlintConfig` — that switch off every rule Oxlint already owns, so the
two linters never report the same thing twice.
_Avoid_: dedup, overrides, off-list
