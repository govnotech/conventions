# ESLint plugins bundled as dependencies; tool CLIs as optional peers

Every ESLint plugin the presets use is a regular `dependency`, bundled with the
package, so a consumer installs no plugin packages and versions none of them —
the presets are zero-config. The three tool CLIs (`oxfmt`, `oxlint`, `eslint`)
and `typescript` are `peerDependencies` marked **optional**, so a
formatter-only project can install `oxfmt` alone without npm warning about a
missing `eslint`.
