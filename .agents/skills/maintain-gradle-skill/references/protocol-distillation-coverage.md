# Gradle Distillation Coverage

## Coverage Lanes

Recurring upstream distillation has two independent lanes:

- Delta lane: inspect at least one coherent upstream batch and classify every discovered candidate.
- Published-owner lane: audit the next runtime reference owner from a deterministic cursor against current final-release evidence.

## Owner Cursor

Build the ordered owner set from every `skills/gradle/references/*.md` file reachable from `skills/gradle/SKILL.md`, sorted by path. Select the recorded next owner; if it is absent, select the first path greater than it, wrapping to the first owner. With no cursor, start at the first owner.

After the recurring published-owner lane completes, persist the next owner path, post-review runtime-tree identity, final-release identity, and unresolved rechecks in the run's continuity surface, not in runtime guidance. A changed tree or release makes earlier freshness historical while preserving the cursor order. Without writable continuity, report the next owner and treat cross-run rotation as unverified.

## Claim Ledger

For any published-owner audit, create a transient ledger of every actionable API or behavior claim. Initially classify each item as confirmed, a correction candidate, or blocked with a recheck condition, then route every correction candidate through the entry skill's Operating Loop.

A final-release public document or API contract can establish a claim. Inspect the nearest direct implementation and representative tests when they exist or the contract is ambiguous. Compare the final release immediately before each claimed version boundary.

Owner coverage is complete only when every ledger item ends confirmed, corrected by an accepted change, or blocked. Whole-owner semantic freshness additionally requires no blocked item and clean validation and review for every accepted correction. These completion criteria apply to recurring and one-off owner audits.

Mechanical validation and whole-batch review prove only the current artifacts and batch; they do not establish the semantic freshness of untouched owners.
