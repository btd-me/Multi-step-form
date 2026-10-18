# Multi-step form spec

Status: approved, ready to build.
Sources: `README.md`, `style-guide.md`, `design/*.jpg`.

## How we work

This spec drives development.
Every acceptance criterion (AC) has a stable ID, for example `AC-1.3`.
Every AC gets at least one test whose name starts with its ID, so `grep AC-1.3` finds the spec line and its tests.
We build one AC at a time: write the failing test, make it pass, refactor, then tick the box here.
If the build reveals that an AC is wrong or missing, update this file first, then the code.

All changes reach `main` through a pull request; nothing is pushed to `main` directly.
Branches are named after what they deliver, for example `ac-1.2-required-field`, or `chore/<topic>` for tooling.
A PR covers one AC, or a few tightly related ones, and ticks their boxes in this file in the same PR.
CI must pass before merging, and PRs are squash-merged so `main` has one commit per slice.

## Scope

In scope: a client-side, four-step subscription form plus a confirmation screen, matching the designs at 375px and 1440px and working from 320px up.

Out of scope: a backend, payment, real submission, authentication, persistence across reloads, and URL routing (see [D-5](#d-5-persistence) and [D-6](#d-6-url-state)).

## Glossary

- **Current step**: the step on screen.
- **Visited step**: a step the user has reached at least once, by any navigation.
  Step 1 is visited from the start.
- **Valid step**: a step whose validation ACs all pass for the data it currently holds.

## Domain data

Prices are in USD with whole dollars only.
The yearly price is 10x the monthly price, which the design presents as "2 months free".

| Plan     | Monthly | Yearly  |
| -------- | ------- | ------- |
| Arcade   | $9/mo   | $90/yr  |
| Advanced | $12/mo  | $120/yr |
| Pro      | $15/mo  | $150/yr |

| Add-on               | Description                  | Monthly | Yearly  |
| -------------------- | ---------------------------- | ------- | ------- |
| Online service       | Access to multiplayer games  | +$1/mo  | +$10/yr |
| Larger storage       | Extra 1TB of cloud save      | +$2/mo  | +$20/yr |
| Customizable profile | Custom theme on your profile | +$2/mo  | +$20/yr |

## Acceptance criteria

### 0. Navigation and step indicator

- [ ] **AC-0.1** On first load, step 1 is shown and the indicator marks step 1 as current.
- [ ] **AC-0.2** "Next Step" validates the current step and advances only if it is valid.
- [ ] **AC-0.3** "Go Back" is shown on steps 2-4, is absent on step 1, and returns to the previous step without validating.
- [ ] **AC-0.4** Moving between steps in any way preserves every value entered so far.
- [ ] **AC-0.5** The step indicator marks exactly one step as current, both visually and to assistive technology (`aria-current="step"`).
- [ ] **AC-0.6** After a step change, focus moves to the new step's heading, unless an AC says focus goes to an invalid field instead.
- [ ] **AC-0.7** Visited steps in the indicator are interactive (keyboard and pointer), and unvisited steps are not.
- [ ] **AC-0.8** Choosing an earlier visited step goes straight there without validating.
- [ ] **AC-0.9** Choosing a later visited step validates every step from the current one up to, but not including, the target.
      If all are valid, the target is shown.
      Otherwise the first invalid step is shown with its errors, and focus moves to its first invalid control.
- [ ] **AC-0.10** Choosing the current step does nothing.

### 1. Personal info

- [ ] **AC-1.1** Step 1 has Name, Email Address and Phone Number fields, each with a visible label tied to its input.
- [x] **AC-1.2** A field that is empty, or contains only whitespace and zero-width characters (U+200B, U+200C, U+200D, U+2060), is invalid, with the message "This field is required".
- [ ] **AC-1.3** A non-empty email that does not match the format in [D-10](#d-10-email-format) is invalid, with a format message.
      An empty email shows the required error (AC-1.2), not the format error.
- [ ] **AC-1.4** A phone number is invalid with a format message if it contains anything other than digits, spaces, `+`, `-`, `(` and `)`, or has fewer than 7 digits.
- [ ] **AC-1.5** A field is validated when it loses focus, and its error is shown if it is invalid.
- [ ] **AC-1.6** While a field is showing an error, it re-validates on every change, and the error disappears as soon as the value is valid.
- [ ] **AC-1.7** Submitting step 1 validates all three fields, including ones never focused, shows every error, and moves focus to the first invalid field.
- [ ] **AC-1.8** An invalid field gets the error border (Red 500), its message is shown next to its label, and the input is marked `aria-invalid="true"` with the message linked through `aria-describedby`.
- [ ] **AC-1.9** Leading and trailing whitespace is trimmed before a value is validated and stored.

### 2. Select plan

- [ ] **AC-2.1** Arcade, Advanced and Pro are shown with their icons and their prices for the current billing period.
- [ ] **AC-2.2** The plans behave as a single-choice group: arrow keys move between them, and at most one can be selected.
- [ ] **AC-2.3** No plan is selected on first arrival at step 2.
- [ ] **AC-2.4** The selected plan shows the selected style (Purple 600 border, Blue 50 background).
- [ ] **AC-2.5** A Monthly/Yearly toggle switches the billing period, and the active label is emphasized.
      Monthly is the default.
- [ ] **AC-2.6** In yearly mode, each plan shows its yearly price and "2 months free".
- [ ] **AC-2.7** Submitting with no plan selected shows an error, does not advance, and moves focus to the plan group.
- [ ] **AC-2.8** Changing the billing period keeps the selected plan and the selected add-ons.

### 3. Add-ons

- [ ] **AC-3.1** The three add-ons are shown as checkboxes with name, description and price for the current billing period.
- [ ] **AC-3.2** Clicking anywhere on an add-on card toggles it, and the whole card shows the selected style.
- [ ] **AC-3.3** Selecting zero add-ons is valid.

### 4. Summary

- [ ] **AC-4.1** The summary shows the plan as "<Plan> (<Monthly|Yearly>)" with its price.
- [ ] **AC-4.2** Each selected add-on is listed with its price, and unselected add-ons are not listed.
- [ ] **AC-4.3** With no add-ons, the add-on section and its divider are not shown.
- [ ] **AC-4.4** The total is the plan price plus the selected add-on prices, labelled "Total (per month)" or "Total (per year)", and formatted `$N/mo` or `$N/yr` with no `+` (see [D-7](#d-7-total-price-format)).
- [ ] **AC-4.5** "Change" returns to step 2 with all selections intact.
- [ ] **AC-4.6** "Confirm" shows the thank-you screen.

### 5. Thank you

- [ ] **AC-5.1** The thank-you screen shows the icon, the "Thank you!" heading and the support copy.
- [ ] **AC-5.2** After confirming, the form is closed: no step in the indicator is interactive, and step 4 stays marked as current, as in the design.
- [ ] **AC-5.3** The confirmation is announced to screen reader users.

### 6. Layout and states

- [ ] **AC-6.1** At widths below the desktop breakpoint, the mobile layout is used: a top banner with numbered steps, a floating card, and a navigation bar fixed to the bottom.
- [ ] **AC-6.2** At desktop widths, the layout is a single card with the sidebar on the left.
- [ ] **AC-6.3** No horizontal scroll from 320px wide up.
- [ ] **AC-6.4** Every interactive element, including visited steps in the indicator, has a visible hover state and a visible `:focus-visible` state.
- [ ] **AC-6.5** The layout still works at 200% browser zoom.

## Decisions

### D-1: Is a plan preselected?

**Decided: no.**
The README asks for an error when "a step is submitted, but no selection has been made", which can only happen with no default.
The Arcade highlight in the desktop design is read as showing the selected state.

### D-2: When does validation run?

**Decided: on blur, then live once an error is showing, and on submit.**
Tabbing out of an empty field shows "This field is required".
This is a known trade-off of on-blur validation, and we accept it.

### D-3: Is the step indicator clickable?

**Decided: any visited step.**
Backward jumps are free.
Forward jumps validate the steps they would skip and stop at the first invalid one (AC-0.9), so the form can never reach the summary with invalid data.

### D-4: Phone number rules

**Decided: required, allowed characters only, and at least 7 digits.**
Full E.164 parsing was rejected because it adds a large dependency for little gain in a demo.

### D-5: Persistence

**Decided: none.**
A reload starts fresh.

### D-6: URL state

**Decided: none.**
The current step lives in memory only, so there are no deep links to guard.

### D-7: Total price format

**Decided: no `+` on the total in either period.**
The monthly summary design shows `+$12/mo` and the yearly one shows `$120/yr`.
A `+` belongs on add-on rows, which add to the plan, not on a total, so the monthly design is treated as a mistake.

### D-8: Validator return shape

**Decided: error codes.**
Validators return a code such as `'required'` or `'invalidFormat'`, or `null` when the value is valid.
The UI maps codes to messages, so copy changes never touch domain code or its tests, and AC-1.8 (messages and `aria-describedby`) stays a UI concern.
Booleans were rejected because the UI could not tell "required" from "bad format".
Message strings were rejected because they mix UI copy into the domain.

### D-9: Source layout

**Decided: a hybrid of a pure domain layer and step components.**

```
src/
  domain/   pure TypeScript: validation, pricing, navigation state
  steps/    one React component per step
```

Code in `src/domain/` must not import React or perform I/O, which keeps its tests fast and free of the DOM.
Unit tests sit next to the file they cover, for example `validation.test.ts` beside `validation.ts`.
End-to-end tests, if added, go in a top-level `e2e/` folder.
Folders are created when their first file is needed, not ahead of time.
There is no `services/` folder because the app has no I/O (D-5, D-6); one arrives with the first network or storage call.

At larger scale this would become feature folders (each feature owning its own UI, model and tests) with import boundaries enforced by lint.
With one feature, that structure would only add ceremony.

### D-10: Email format

**Decided: a practical `local@domain.tld` rule, not full RFC 5322.**
A valid email has exactly one `@`, a non-empty local part with no whitespace, and a domain of non-empty, dot-separated labels made of ASCII letters, digits and hyphens, ending in a top-level domain of at least two letters.

This is stricter than the browser's `<input type="email">`, whose WHATWG rule accepts `a@a` with no top-level domain.
Out of scope: checking that the domain exists (DNS or MX lookups), quoted local parts such as `"a b"@example.com`, IP address domains, and non-ASCII (internationalized) addresses.
