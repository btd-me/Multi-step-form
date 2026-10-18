# AI usage log

How I used Claude Code (an AI coding assistant) on this project.
This log feeds the "How I used AI" section of the README.

## How I work with AI

- I own the spec, the decisions, the briefs and the review; Claude drafts.
- For each acceptance criterion (AC), I write a short brief: scope, contract, test inputs and constraints.
  Claude implements the code and tests from it and opens a pull request.
- I review each PR like a teammate's: I run it, try to break it, and merge only what I can explain line by line.
- Some parts I build by hand, without AI: the forward-jump navigation logic (AC-0.9) and one full step's UI.

## Log

### Project setup

- **Delegated:** Vite + React + TypeScript scaffold, Vitest and Testing Library, Prettier, Husky hooks, GitHub Actions CI and the PR template.
- **Delegated:** a first draft of `docs/spec.md`, with acceptance criteria drawn from the README and the design files.
- **My decisions:** all nine spec decisions (D-1 to D-9), including no preselected plan, on-blur validation, a clickable step indicator for visited steps, error codes from validators, and the source layout.
- **Changed in review:** added "why" and notes sections to the PR template after writing the first PR description by hand.

### AC-1.2: Required field validator (PR #4)

- **My brief:** a general validator that returns `'required'` or `null`, handles zero-width characters as well as whitespace, with my list of test inputs.
- **Pushback I accepted:** dropped field-specific validators from the brief as scope creep (they belong to AC-1.3 and AC-1.4), and switched the return type back to error codes to match D-8.
- **Delegated:** `validateEmpty` and its tests; Claude also chose the exact zero-width set (U+200B to U+200D and U+2060) where my brief was open.
- **Found in review:** my test list did not catch a regex missing its global flag, so `'\u200B\u200B'` would have passed as non-empty.
  I added a test for it, plus one for a space inside a value.
- **AI mistake caught:** Claude's first commit wrote the regex with the literal invisible characters instead of `\u` escapes, so it read as `/[-]/g` in the editor.
  Fixed to escapes before merge.
