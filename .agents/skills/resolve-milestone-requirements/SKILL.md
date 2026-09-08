# Skill: Resolve milestone requirements

## Objective

Resolve full syllabus requirements for a company milestone before coding or resubmitting work.

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| `milestoneNumber` | Yes | e.g. `4` for MS-4 |
| `company` | No | Default `brasaland` |

## Steps

1. Open [`memory-bank/syllabusReference.md`](../../../memory-bank/syllabusReference.md).
2. Look up the project README URL and context folder for the milestone.
3. Fetch the project README (raw GitHub URL or syllabus repo).
4. Extract all evaluation / "What We Will Evaluate" checkboxes.
5. Compare each criterion to the current repo state (pass/fail + file evidence).
6. Flag phrases like "integration of prior milestones" or "Next.js" explicitly.

## Acceptance criteria

- [ ] Output lists every evaluation bullet from the syllabus project README
- [ ] Each bullet has pass/fail and evidence path (or gap description)
- [ ] Integration requirements (prior MS modules) are called out when present
- [ ] Links to syllabus README and context folder are included in output

## When to use

- Before starting a new milestone
- After audit feedback or failed grading
- Before opening or updating a milestone PR
