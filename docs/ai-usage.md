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

### AC-1.3: Email format validator (PR #5)

- **My brief:** `isValidEmail(email)` returning `true | false`, checking for an empty field first, with my passing and failing inputs; domain validation out of scope.
- **Pushback I accepted:** a boolean return would make an empty email and a malformed one look the same, which breaks D-8 and my own "empty first" constraint.
  Kept `isValidEmail` as a private boolean helper and made the public `validateEmail` return `'required' | 'invalidFormat' | null`.
  Also added real-world passing formats (dots, plus addressing, subdomains, uppercase) and split `b@@a..com`, which broke two rules at once, into single-rule cases.
- **Delegated:** I asked Claude to use its recommended options for the open points: a TLD of two or more letters, no DNS or MX lookups, and no full RFC 5322 or non-ASCII addresses.
  Claude wrote these up as D-10 in the spec.
- **Mutation check:** Claude broke the regex in seven ways before opening the PR; removing the end anchor was not caught, so it added a test for trailing text after the address.
- **Found in review:** no changes.
  I considered splitting the email at spaces, and decided against it: a validator should report problems, not rewrite input, and an inner space is almost always a typo only the user can fix.
  Surrounding spaces are handled by trimming (AC-1.9).

### AC-1.4: Phone number format validator (PR #6)

- **My brief:** written from a template Claude gave me.
  `validatePhoneNumber` returning `'required' | 'invalidFormat' | null` with a private `isValidPhoneNumber` helper, an empty check first, a leading `+` only, 7 to 15 digits, my own passing and failing inputs, and an explicit out-of-scope list.
- **Pushback I accepted:** "parentheses around the area code only" could not be tested without country-specific rules, which I had ruled out, so it became "at most one balanced pair containing only digits".
  I also added failing inputs for rules that had none (a non-leading `+`, two `+`, 16 digits, a dot, letters, unbalanced parentheses) and passing inputs at the 7- and 15-digit boundaries and with hyphens.
- **Delegated:** the implementation, the tests from the agreed list, and the D-4 rewrite in the spec.
- **Mutation check:** Claude broke the validator in twelve ways, including off-by-one digit limits, a `+` allowed anywhere, missing anchors and empty parentheses; all were caught.
- **Found in review:** _to fill in after my review._
