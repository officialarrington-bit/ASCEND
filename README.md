# ASCEND

An interactive student-athlete career platform demonstration for the Presidential Innovation Challenge. Campbell University is a proposed pilot, with no implied endorsement or secured partnerships. All employers, people, opportunities, compensation, and activity are fictional samples.

## Run

Node.js 20.19+ or 22.12+ (validated with Node 24), npm.

```sh
npm ci
npm run dev -- --port 5173
```

Open the address reported by Vite in your local browser. This cloud onboarding session does not provide a public preview link. To run on your computer, download the project and run these commands there.

```sh
npm run build
npm run preview -- --port 4173
npm test
```

The browser tests use `/usr/bin/chromium`, available in this cloud environment. Set `CHROMIUM_PATH` to another Chromium executable when needed. Tests cover profile changes, search, saving, interest, cross-role visibility, participation status and attendance, persistence, employer creation and approval, mobile overflow, modal Escape handling, reminders, and reset.

## Deploy

The production output is `dist/`. Upload its contents to a static hosting service, or connect this repository to a host with build command `npm run build` and output directory `dist`. No backend, credentials, or environment variables are required. No deployment has been performed by this task.

## Three-minute pitch

- **0:00–0:25 — The problem.** “Athletes develop discipline, teamwork, and resilience. ASCEND helps universities turn those strengths into career conversations and experiences. Universities are the proposed customers; athletes use it free and employers initially participate free. Pricing is still being researched. This is fictional sample data, and Campbell is a proposed pilot.”
- **0:25–1:10 — The athlete.** Open My profile, adjust interests to Finance, and save. Return to Explore opportunities, search “financial,” and explain the visible interest match. Open “A day in financial strategy” and register simulated interest. Open My opportunities to show the next step.
- **1:10–1:45 — The employer.** Switch the Demo role to Employer. Show the interested athlete, set status to Registered, and enter “Meet Morgan at reception November 12 at 9 AM.” Save. Explain that humans organize useful experiences and build relationships; the app keeps the work together.
- **1:45–2:25 — The university.** Switch to University staff. Show participation, attendance, and the separate sample metrics for interest, completed experiences, interviews, and reported placements. Explain that staff review new employer opportunities in Approvals. For a longer demo, create an opportunity as Employer, approve it as staff, and find it as an athlete.
- **2:25–3:00 — Close the loop.** Return to Student-athlete → My opportunities to show the updated next step. “ASCEND organizes the journey; people secure employers, approve experiences, and build relationships. This prototype stores data only in this browser. A real pilot would need shared secure storage, school-supported verification, access controls, and validated operating processes.”

## Boundaries

One editable demo athlete and one employer workspace, with additional fictional employers on the board. Roles are presentation modes, not authenticated accounts. No email, notifications, real applications, identity verification, payments, employment guarantees, or shared backend. Follow-up reminders appear locally only. School-supported verification is a future feature; NCAA IDs are not used. Interest selection is not a validated career assessment. Restricted experiences are labeled by participating school; other listings have open eligibility. Reset demo clears local changes after confirmation. Browser storage can be cleared by the browser and is scoped to each site/origin.

Implementation: vanilla JavaScript and CSS, Vite, and Playwright. No university logos, testimonials, NIL offerings, subscriptions, project marketplace, social feed, or unvalidated pricing.

## Downloadable single-file demonstration

`npm run package:demo` also creates `dist/ascend-demo.html`, bundling all JavaScript and CSS without external requests. Download that file for a portable demo. The production single-file build was verified over a local HTTP server, including cross-role registration and mobile layout. Direct file navigation is blocked by this cloud browser's administrative policy, so opening a downloaded file directly was not validated here; serve it with `python -m http.server --directory dist 4173` if your browser restricts local files.

## Campbell ASCEND redesign

The concept now uses an athletics-inspired text identity, a black/white program masthead, a compact opening section with Explore Opportunities and For Employers actions, a four-step program introduction, and two distinct listing groups. Career-interest, experience-type, location, and time filters remain connected to the board; an additional availability filter uses the demo athlete's stated availability. Compensation and eligibility are visible on the cards. All three role views share the visual treatment.

See [DESIGN-SOURCES.md](DESIGN-SOURCES.md) for reference access results, the **unverified official-color requirement**, image permissions, and theme configuration. No unapproved logo or photo was added. The original orange accent remains provisional. Supply approved photography and enable access to the official guide to finish those aspects of the brief.

Theme defaults live in `src/theme.js`; staff can configure the school/program name, local demo accent, and program contact text. `npm test` runs seven browser tests, including automated accessibility and layout checks across all role pages at desktop and mobile widths.
