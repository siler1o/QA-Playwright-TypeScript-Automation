![Playwright + TypeScript — Web automation, Page Objects, cross-browser testing, and GitHub Actions](media/playwright-typescript-banner.png)

# Playwright + TypeScript
### Cross-browser QA automation portfolio

[![Playwright Tests](https://github.com/siler1o/QA-Playwright-TypeScript-Automation/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/siler1o/QA-Playwright-TypeScript-Automation/actions/workflows/playwright.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square)
![POM](https://img.shields.io/badge/Architecture-Page_Object_Model-0F766E?style=flat-square)
![Browsers](https://img.shields.io/badge/Browser_projects-3-7C3AED?style=flat-square)

**A growing UI automation framework that turns documented test steps into repeatable browser checks.**

Built against [QA Playground](https://qaplayground.com), using reusable page objects, Playwright assertions, named test steps, and GitHub Actions.

[**View CI runs →**](https://github.com/siler1o/QA-Playwright-TypeScript-Automation/actions/workflows/playwright.yml) · [Test tracker (.xlsx)](test-cases/QA_Playground_TypeScript_Playwright_Test_Suite.xlsx) · [Test specs](tests) · [Page objects](pages) · [Author](https://github.com/siler1o)

| Implemented coverage | Browser projects | Execution evidence |
| :--- | :--- | :--- |
| **14 test cases · Inputs, Buttons, Forms, Dropdowns, Data table, Dialogs, Radio & checkbox, Date picker, Links, Tabs, Dynamic waits, Multi select, File upload, Drag & drop** | **Chromium · Firefox · WebKit** | **HTML report + retry traces** |

## What this project demonstrates

- **Page Object Model:** each practice page has one page object in [`pages/`](pages) holding its locators and reusable interactions.
- **Readable test flow:** `test.step()` labels map the automated checks to the documented test-case steps.
- **State and behavior checks:** verify values, results, disabled state, keyboard focus, readonly behavior, and validation errors.
- **Browser-level scenarios:** modal dialogs, new tabs and popups, HTTP status checks, file uploads, drag and drop, and waits for changing UI without fixed sleeps.
- **Cross-browser execution:** the same tests run in three desktop browser projects.
- **Continuous integration:** GitHub Actions installs dependencies and browsers, runs the suite, and uploads its HTML report.

## Test-case tracker

[**Download the QA Playground test-suite tracker (.xlsx)**](test-cases/QA_Playground_TypeScript_Playwright_Test_Suite.xlsx?raw=true)

This repository copy preserves the uploaded workbook for reference alongside the automation code. It is a snapshot and does not automatically sync with the original tracker or GitHub Actions results. Download it to open in Excel or another compatible spreadsheet application.

## Current test coverage

### [TC001 — Input fields](tests/TC001-input-fields.spec.ts)

| TC001 steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–3 | Enter and submit `Interstellar` | Input value and submitted result match |
| 4–5 | Append ` Endgame`, then press Tab | `Avengers` becomes `Avengers Endgame` |
| 6 | Clear the prefilled field | Starts as `Inception`; becomes empty; confirmation appears |
| 7 | Check disabled input and tab navigation | Disabled state; Tab reaches readonly input without focusing disabled input |
| 8 | Read readonly value and attempt typing | Nonempty value, readonly attribute, and unchanged value after typing |

### [TC002 — Click actions and button states](tests/TC002-buttons.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1 | Open the Buttons page | S02, S05, S07, and S08 buttons are visible; initial result messages match |
| 2 | Click Find Location (S02) | Numeric X/Y coordinates appear; S07 and S08 results stay unchanged |
| 3–4 | Single-click, then double-click S07 | A single click leaves the initial message; double-click displays `Double clicked!` |
| 5–6 | Left-click, then right-click S08 | Left-click leaves the initial message; right-click displays `Context menu triggered!` |
| 7 | Inspect Disabled button (S05) | Button is disabled; its result matches the initial message |

The coordinates assertion validates the numeric text format, not the accuracy of the button position. S05 is checked initially and at the end of the test; no click is attempted on the disabled button.

### [TC003 — Forms](tests/TC003-forms.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–4 | Fill the personal-details form, choose Male, and save | Entered values match; only Male is checked |
| 5 | Read the success message | Message includes the first name |
| 6–7 | Reset, then save the empty form | Fields clear; required-field errors appear; no save is accepted |
| 8 | Log in with an invalid email | Email error appears; no login success |
| 9–10 | Submit account setup with mismatched passwords | Terms stay checked; mismatch error appears; no success message |

### [TC004 — Dropdowns](tests/TC004-dropdowns.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1 | Open the Dropdowns page | Fruit select shows its placeholder |
| 2 | Choose Apple by visible text | Value is `apple`; result confirms Apple |
| 3 | Choose India by value | Label is India; value is `india` |
| 4 | Select Batman, then add Aquaman in the multi-select | Exactly two heroes are selected |
| 5 | Open the custom priority listbox and choose High Priority | Trigger and result show High Priority |
| 6–7 | Search `Pun` in the city combobox and select Pune | Only Pune remains in the options; result confirms Pune |

### [TC005 — Data table](tests/TC005-data-table.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–3 | Open the table and read headers, row numbers, and count | Seven headers in order; rows 1–5; `25 books — page 1 of 5` |
| 4 | Search `Clean Code` | Only matching rows remain; count updates |
| 5 | Clear the search and open page 2 | Full table returns; rows 6–10 appear |
| 6–8 | Click Book Name three times | Ascending, descending, then original order |
| 9–11 | Open Add Book, save empty, then cancel | Name and Author errors appear; count is unchanged |

The sort checks compare the page order against a sorted copy of the visible names, so they do not depend on hard-coded data. TC005 verifies required-field validation only; it does not add a book.

### [TC006 — Alerts and dialogs](tests/TC006-alerts-dialogs.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Open the info dialog, then close it with × | `role="dialog"` and `aria-modal="true"`; heading is Session Notice; result confirms dismissal |
| 3–4 | Open the confirm dialog, then click Confirm | Result waits for confirmation, then shows `Submission confirmed!` |
| 5 | Press Escape on the keyboard dialog | Dialog closes; result confirms the Escape key |
| 6–7 | Click inside the panel, then on the backdrop | Inside click keeps it open; backdrop click closes it; no modal remains |

The backdrop click targets the overlay beside the panel, because the sticky site navigation covers the overlay's top corner.

### [TC007 — Radio buttons and checkboxes](tests/TC007-radio-checkbox.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–3 | Check, then uncheck the terms checkbox | Starts unchecked; becomes checked; returns to unchecked |
| 4–5 | Select Starter, then Pro | Three radios exist; Pro replaces Starter, and only one stays selected |
| 6 | Inspect the disabled checkbox | Disabled and unchanged |

### [TC008 — Date picker](tests/TC008-date-picker.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Fill `2026-10-15` into the native date input | Input type is `date`; value and result match exactly |
| 3–4 | Open the calendar and pick a day | Grid is expanded; result matches the chosen day's `data-date` |
| 5–6 | Read the constrained input's `min`, then enter the day before it | Valid ISO minimum; the earlier date is flagged out of range |

Playwright's WebKit build on Windows renders `type="date"` as a text field and does not enforce `min`. In that browser, step 6 records a test annotation instead of failing.

### [TC009 — Links](tests/TC009-links.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Follow the internal link | Same tab opens the link's `href`; tab count stays at one |
| 3–4 | Open the external course link | `target="_blank"`; exactly one new tab opens at the `href`; the original tab stays on Links |
| 5 | Request the broken link's URL | HTTP request returns status 500 |
| 6 | Inspect the anchor link | Label, `href="#anchor-target"`, and target element ID match |

### [TC010 — Tabs and windows](tests/TC010-tabs-windows.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Record the URL, then capture the popup from the new-tab link | Tab count goes from one to two |
| 3 | Wait for the new tab to load | New tab URL matches the link's `href` |
| 4 | Bring the original tab to the front and click Mark as Returned | URL is unchanged; the page still responds |
| 5 | Close the new tab | Tab is closed; tab count returns to one |

### [TC011 — Dynamic waits](tests/TC011-dynamic-waits.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Trigger the delayed element | Absent first; appears within a bounded timeout |
| 3–4 | Trigger the loading spinner | Spinner shows before content; then hides and content appears |
| 5–6 | Trigger the success toast | Expected message appears; toast closes within 4 seconds |
| 7–8 | Arm the delayed button, then click Submit | Starts disabled; becomes enabled; click succeeds |

Every wait is a Playwright assertion with a timeout. The test never uses a fixed sleep.

### [TC012 — Multi select](tests/TC012-multi-select.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–3 | Select one, then two options in the native multi-select | Starts empty; selected values and result match each step |
| 4 | Pre-select all, then deselect Cypress | Cypress is removed; the other three remain |
| 5 | Check two options in the custom checkbox list | Trigger shows `2 selected`; result names both |
| 6 | Check two options, then click Clear All | Count resets; no option remains selected |

### [TC013 — File upload](tests/TC013-file-upload.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–3 | Select one file, then two files | Names and sizes appear; multiple input holds two files |
| 4–5 | Upload a text file to the image-only input | `accept="image/*"`; type error appears |
| 6–7 | Read the maximum size and upload a file one byte larger | Fixture exceeds the limit; size error appears |
| 8 | Inspect the progress scenario with no file | Upload is disabled; no progress bar starts |

Fixtures are created in memory with `Buffer`, so the repository needs no sample files. The oversize file is sized from the limit shown on the page.

### [TC014 — Drag and drop](tests/TC014-drag-drop.spec.ts)

| Steps | Interaction | Verification |
| :--- | :--- | :--- |
| 1–2 | Drag the basic item into the drop zone | Zone starts empty; item moves in; result confirms the drop |
| 3–4 | Drag card-2 into zone-b | Zone-b contains the card once; zones A and C are unchanged |
| 5 | Drag item-3 above item-1 in the sortable list | Item-3 is first; same five items remain |
| 6–7 | Drag task-2 from Todo to Done | Task leaves Todo and appears once in Done |

**Scope:** fourteen test cases with named steps, configured for Chromium, Firefox, and WebKit—forty-two test/browser combinations per full run, before retries. These are desktop browser configurations, not physical-device tests.

[Successful CI run for the TC002 implementation](https://github.com/siler1o/QA-Playwright-TypeScript-Automation/actions/runs/37226807309) · Use the badge above for current workflow status.

The Tab check currently allows up to eight presses from the Clear button to the readonly input. Changes to the practice page's focus order may require updating that check.

Some pages can ignore the first interaction if it happens before React finishes hydrating. TC011–TC014 retry that first action until the page responds; later steps use plain actions.

## Run locally

Install **Node.js 22** and Git, then run:

```powershell
git clone https://github.com/siler1o/QA-Playwright-TypeScript-Automation.git
cd QA-Playwright-TypeScript-Automation
npm.cmd ci
npx.cmd playwright install
npx.cmd playwright test
```

These commands use Windows PowerShell-compatible executable names. On macOS or Linux, use `npm` and `npx` instead of `npm.cmd` and `npx.cmd`. On Linux, install browser system dependencies with `npx playwright install --with-deps`.

| Task | PowerShell command |
| :--- | :--- |
| Run all configured browsers | `npx.cmd playwright test` |
| Run Chromium only | `npx.cmd playwright test --project=chromium` |
| Run one test case | `npx.cmd playwright test tests/TC014-drag-drop.spec.ts` (use any file in `tests/`) |
| Show the browser during execution | `npx.cmd playwright test --project=chromium --headed` |
| Open the HTML report | `npx.cmd playwright show-report` |

Tests require internet access to the public practice website.

## GitHub Actions CI

The [workflow](.github/workflows/playwright.yml) runs on:

- Pushes to `main`.
- Pull requests targeting `main`.
- Manual execution using `workflow_dispatch`.

Each run checks out the code, sets up Node.js 22, installs locked dependencies with `npm ci`, installs Playwright browsers and system dependencies, and executes all configured browser projects.

| CI setting | Behavior |
| :--- | :--- |
| `forbidOnly` | Rejects accidentally committed `test.only()` |
| `retries` | Up to two retries for failed tests in CI; zero locally |
| `workers` | One worker in CI |
| `trace` | Captures the first retry for investigation |
| Report retention | HTML artifact retained for 14 days |

A test that passes only on retry is reported as flaky; a green job should still be reviewed for retries. CI executes tests and preserves reports; application deployment is not configured.

### Inspect a CI report

1. Open [Actions](https://github.com/siler1o/QA-Playwright-TypeScript-Automation/actions) and select a run.
2. Open the `test` job to inspect execution logs.
3. Return to the run summary and download the **playwright-report** artifact.
4. Extract the archive. From your local project, serve the extracted report folder:

```powershell
npx.cmd playwright show-report "C:\path\to\extracted\playwright-report"
```

Use the folder containing `index.html`. Reports are uploaded after test failures too, when generated and the workflow has not been canceled. Traces are available when a retry was executed.

## Project map

| Path | Purpose |
| :--- | :--- |
| [Test-suite tracker](test-cases/QA_Playground_TypeScript_Playwright_Test_Suite.xlsx) | Downloadable Excel workbook snapshot |
| [`pages/InputFieldsPage.ts`](pages/InputFieldsPage.ts) | Page locators, actions, and reusable assertions |
| [`tests/TC001-input-fields.spec.ts`](tests/TC001-input-fields.spec.ts) | Test orchestration and named verification steps |
| [`pages/ButtonsPage.ts`](pages/ButtonsPage.ts) | Button and result locators; single-, double-, and right-click actions |
| [`tests/TC002-buttons.spec.ts`](tests/TC002-buttons.spec.ts) | Button outcomes, unchanged results, and disabled-state checks |
| [`pages/FormsPage.ts`](pages/FormsPage.ts) | Login, personal-details, and account-setup locators, actions, and assertions |
| [`tests/TC003-forms.spec.ts`](tests/TC003-forms.spec.ts) | Valid submission, reset, and validation checks |
| [`pages/DropdownsPage.ts`](pages/DropdownsPage.ts) | Native select, multi-select, custom listbox, and combobox interactions |
| [`tests/TC004-dropdowns.spec.ts`](tests/TC004-dropdowns.spec.ts) | Selection outcomes across all dropdown types |
| [`pages/DataTablePage.ts`](pages/DataTablePage.ts) | Table, search, sort, pagination, and Add Book dialog locators and actions |
| [`tests/TC005-data-table.spec.ts`](tests/TC005-data-table.spec.ts) | Header, search, pagination, sort, and add-validation checks |
| [`pages/AlertsDialogsPage.ts`](pages/AlertsDialogsPage.ts) | Dialog triggers, panels, and backdrop click |
| [`tests/TC006-alerts-dialogs.spec.ts`](tests/TC006-alerts-dialogs.spec.ts) | Modal attributes, close, confirm, Escape, and backdrop checks |
| [`pages/RadioCheckboxPage.ts`](pages/RadioCheckboxPage.ts) | Checkbox, radio group, and disabled-control locators |
| [`tests/TC007-radio-checkbox.spec.ts`](tests/TC007-radio-checkbox.spec.ts) | Checked, exclusive, and disabled-state checks |
| [`pages/DatePickerPage.ts`](pages/DatePickerPage.ts) | Native date input, calendar grid, and range-validation helpers |
| [`tests/TC008-date-picker.spec.ts`](tests/TC008-date-picker.spec.ts) | Date entry, calendar selection, and minimum-date checks |
| [`pages/LinksPage.ts`](pages/LinksPage.ts) | Internal, external, broken, and anchor link locators |
| [`tests/TC009-links.spec.ts`](tests/TC009-links.spec.ts) | Same-tab, new-tab, HTTP status, and anchor checks |
| [`pages/TabsWindowsPage.ts`](pages/TabsWindowsPage.ts) | New-tab link and popup capture |
| [`tests/TC010-tabs-windows.spec.ts`](tests/TC010-tabs-windows.spec.ts) | Popup capture, tab switching, and tab-count checks |
| [`pages/DynamicWaitsPage.ts`](pages/DynamicWaitsPage.ts) | Delayed element, spinner, toast, and delayed-button locators |
| [`tests/TC011-dynamic-waits.spec.ts`](tests/TC011-dynamic-waits.spec.ts) | Bounded waits for changing UI states |
| [`pages/MultiSelectPage.ts`](pages/MultiSelectPage.ts) | Native and custom multi-select locators, scoped per scenario |
| [`tests/TC012-multi-select.spec.ts`](tests/TC012-multi-select.spec.ts) | Select, deselect, count, and Clear All checks |
| [`pages/FileUploadPage.ts`](pages/FileUploadPage.ts) | File inputs, validation messages, and size-limit reader |
| [`tests/TC013-file-upload.spec.ts`](tests/TC013-file-upload.spec.ts) | Single, multiple, type, size, and disabled-upload checks |
| [`pages/DragDropPage.ts`](pages/DragDropPage.ts) | Drop zones, sortable list, and Kanban column locators |
| [`tests/TC014-drag-drop.spec.ts`](tests/TC014-drag-drop.spec.ts) | Zone drops, list reorder, and column transfer checks |
| [`playwright.config.ts`](playwright.config.ts) | Base URL, browser projects, reports, and CI behavior |
| [`tsconfig.json`](tsconfig.json) | TypeScript settings and Node type definitions |
| [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) | Automated GitHub Actions execution |
| [`package-lock.json`](package-lock.json) | Locked dependency versions for repeatable installation |

Generated dependencies, reports, and test results are excluded from Git. The TypeScript configuration is version-controlled. The current workflow runs Playwright tests; it does not include a separate TypeScript type-checking step.

## Next steps

- Implement the next test case from the tracker using the same POM and named-step structure.
- Expand page objects and assertions as new cases are implemented.
- Improve diagnostics and review reliability across all three browsers.

## More QA work

Built by **Reuben Silerio**, a QA Engineer with experience in web and mobile testing, release validation, and QA coordination.

[Profile](https://github.com/siler1o) · [Selenium + Python](https://github.com/siler1o/selenium-qa-automation-portfolio) · [Postman + Newman](https://github.com/siler1o/postman-api-testing-portfolio)
