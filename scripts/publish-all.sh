#!/usr/bin/env bash
# SHORT-TERM HACK: publish all packages in dependency order allowing NPM to prompt for login on every package.
# Better solution - set up an API key and use the art-monorepo publish command.
# Publish all @art-suite/art-core-ts-* packages in dependency order.
#
# - Builds each package automatically (via its prepublishOnly script).
# - Idempotent: skips any package whose local version already matches npm,
#   so it's safe to re-run if it dies partway through.
# - Stops on the first real failure.
#
# Auth:
#   With a granular automation token in ~/.npmrc -> runs fully unattended.
#   Without one -> npm will prompt (browser/OTP) once per package; that's fine.
#
# Usage:
#   ./scripts/publish-all.sh            # publish
#   DRY_RUN=1 ./scripts/publish-all.sh  # show what would publish, do nothing

set -euo pipefail
cd "$(dirname "$0")/.."

# Dependency-ordered: every package's internal deps appear before it.
PACKAGES=(
  art-core-ts-types
  art-core-ts-math
  art-core-ts-communication-status
  art-core-ts-comprehensions
  art-core-ts-containers
  art-core-ts-inspect
  art-core-ts-string-lib
  art-core-ts-compare
  art-core-ts-string-case
  art-core-ts-time
  art-core-ts-async
  art-core-ts-json
)

for pkg in "${PACKAGES[@]}"; do
  dir="packages/$pkg"
  name=$(node -p "require('./$dir/package.json').name")
  lver=$(node -p "require('./$dir/package.json').version")
  pver=$(npm view "$name" version 2>/dev/null || echo "")

  if [ "$lver" = "$pver" ]; then
    echo "✓ $name@$lver already published — skipping"
    continue
  fi

  echo ""
  echo "==> Publishing $name@$lver  (npm has: ${pver:-none})"
  if [ "${DRY_RUN:-}" = "1" ]; then
    echo "    [dry run] (cd $dir && npm publish --access public)"
    continue
  fi
  ( cd "$dir" && npm publish --access public )
  echo "✓ Published $name@$lver"
done

echo ""
echo "All done."
