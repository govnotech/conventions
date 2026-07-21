# Two-layer linting: Oxlint for syntax, ESLint for types

Two linters run in sequence. Oxlint owns everything that needs no type
information; ESLint adds only the type-aware rules (`strictTypeChecked` +
`stylisticTypeChecked`) Oxlint cannot express. To stop the two from
double-reporting, each ESLint preset ends with a **disable layer** generated
from _its own_ Oxlint preset via `eslint-plugin-oxlint`'s
`buildFromOxlintConfig` — deriving the disable set from the real preset object
means it can never drift from what Oxlint actually enforces. The disable layer
and `eslint-config-prettier` (`skipFormatting`) stay last.

Why not run the type-aware rules in Oxlint too: its type-aware engine
(`oxlint-tsgolint`) is alpha, requires the TS 7 toolchain, and breaks path
aliases. Type-awareness stays with ESLint until that stabilizes.
