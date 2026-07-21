# Subpath-per-tool exports, no bare-`.` entry

The package exposes one subpath per tool — `@govnotech/conventions/oxfmt`,
`/oxlint`, `/eslint` — and deliberately ships **no** bare `.` entry. A single
barrel would evaluate the entire ESLint plugin tree on load even when a consumer
only imports the Oxfmt preset; per-tool subpaths keep each tool's cost lazy and
give the three tools a symmetric import shape.

`typesVersions` is kept alongside the `exports` map on purpose: consumers on a
legacy `moduleResolution: node` ignore the `types` conditions inside `exports`
and would otherwise resolve no types for the subpaths.
