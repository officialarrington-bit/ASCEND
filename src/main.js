import "./style.css";
import { defaultTheme, resolveTheme } from "./theme.js";
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const KEY = "ascend-demo-v1";
const seed = () => ({
  school: defaultTheme.school,
  theme: {
    shortName: defaultTheme.shortName,
    colors: { ...defaultTheme.colors },
    contacts: { ...defaultTheme.contacts },
  },
  athlete: {
    name: "Jordan Ellis",
    sport: "Soccer",
    year: "Junior",
    major: "Business Administration",
    interests: "Finance, Technology",
    skills: "Teamwork, Excel, leadership",
    location: "Raleigh, NC",
    availability: "Flexible",
  },
  company: {
    name: "Oakline Financial",
    industry: "Finance",
    description:
      "A fictional regional financial services team helping students explore careers.",
    host: "Morgan Reed",
  },
  opportunities: [
    {
      id: 1,
      title: "A day in financial strategy",
      company: "Oakline Financial",
      industry: "Finance",
      type: "Shadowing",
      location: "Raleigh, NC",
      time: "Half day",
      schedule: "Nov 12 · 9:00 AM–1:00 PM",
      compensation: "Unpaid learning experience",
      capacity: 8,
      host: "Morgan Reed",
      description:
        "Go behind the scenes with a finance team. Sit in on a planning session, explore a sample portfolio, and hear how different careers begin.",
      goals:
        "Understand financial planning, practice analytical thinking, and meet professionals.",
      requirements:
        "All majors welcome. Bring curiosity and one question for the team.",
      process: "Register interest; the host confirms your place.",
      approved: true,
      restricted: true,
    },
    {
      id: 2,
      title: "Inside healthcare operations",
      company: "Juniper Health Group",
      industry: "Healthcare administration",
      type: "Company visit",
      location: "Durham, NC",
      time: "2 hours",
      schedule: "Nov 18 · 2:00–4:00 PM",
      compensation: "Unpaid learning experience",
      capacity: 12,
      host: "Alex Chen",
      description:
        "Explore how a fictional healthcare organization coordinates people, systems, and patient services.",
      goals:
        "Explore operations, service design, and healthcare administration.",
      requirements: "All academic years welcome.",
      process: "Register interest for host confirmation.",
      approved: true,
      restricted: true,
    },
    {
      id: 3,
      title: "Build your technology career",
      company: "Northstar Digital",
      industry: "Technology",
      type: "Externship",
      location: "Remote",
      time: "1 week",
      schedule: "Dec 7–11 · flexible sessions",
      compensation: "$300 sample stipend",
      capacity: 6,
      host: "Sam Rivera",
      description:
        "Explore product development through guided sessions with engineering and product teams.",
      goals: "Learn product discovery and map technology career paths.",
      requirements: "Interest in technology; no coding experience required.",
      process: "Submit a simulated application for review.",
      approved: true,
      restricted: false,
    },
    {
      id: 4,
      title: "Brand & marketing intern",
      company: "Fieldwork Creative",
      industry: "Marketing",
      type: "Internship",
      location: "Raleigh, NC",
      time: "10 hours/week",
      schedule: "Spring semester · flexible around classes",
      compensation: "$20/hour (sample)",
      capacity: 2,
      host: "Taylor Brooks",
      description:
        "Support a fictional campaign with audience research, content planning, and performance reports.",
      goals: "Practice campaign planning and communication.",
      requirements: "Sophomore or above; interest in marketing.",
      process: "Submit a simulated application for review.",
      approved: true,
      restricted: false,
    },
    {
      id: 5,
      title: "Operations associate",
      company: "Cedarworks Supply",
      industry: "Business operations",
      type: "Job",
      location: "Charlotte, NC",
      time: "Full time",
      schedule: "After graduation · weekdays",
      compensation: "Compensation discussed during simulated interview",
      capacity: 2,
      host: "Casey Lane",
      description:
        "Explore an early-career role improving daily workflows and supporting customers.",
      goals: "Develop process improvement and business operations skills.",
      requirements:
        "Graduating students; organizational and communication skills.",
      process: "Submit a simulated application; employment is not guaranteed.",
      approved: true,
      restricted: false,
    },
    {
      id: 6,
      title: "Business leadership fellowship",
      company: "Cedarworks Supply",
      industry: "Business operations",
      type: "Fellowship",
      location: "Remote",
      time: "5 hours/week",
      schedule: "January–March · flexible",
      compensation: "$750 sample stipend",
      capacity: 4,
      host: "Casey Lane",
      description:
        "A guided introduction to team leadership and operational problem solving.",
      goals: "Build a practical leadership plan and explore business roles.",
      requirements: "All majors welcome.",
      process: "Submit a simulated application for review.",
      approved: true,
      restricted: true,
    },
  ],
  saved: [],
  applications: [],
  reminders: [],
});
let state;
try {
  state = JSON.parse(localStorage.getItem(KEY)) || seed();
} catch {
  state = seed();
}
let role = "Student-athlete",
  page = "Explore opportunities",
  selected = null,
  toast = "",
  filters = {
    search: "",
    industry: "",
    type: "",
    location: "",
    time: "",
    availability: false,
  };
const app = document.querySelector("#app");
const esc = (x) =>
  String(x ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const persist = () => localStorage.setItem(KEY, JSON.stringify(state));
function notify(t) {
  toast = t;
  render();
  setTimeout(() => {
    toast = "";
    document.querySelector(".toast")?.remove();
  }, 3500);
}
const navs = {
  "Student-athlete": [
    "Explore opportunities",
    "My opportunities",
    "Connections",
    "My profile",
  ],
  Employer: ["Overview", "Create opportunity", "Company profile"],
  "University staff": ["Participation", "Approvals", "School settings"],
};
const option = (values, value = "") =>
  values
    .map((v) => `<option ${v === value ? "selected" : ""}>${esc(v)}</option>`)
    .join("");
const field = (label, name, value = "", type = "text", required = true) =>
  `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required ? "required" : ""}></label>`;
const select = (label, name, values, value = "") =>
  `<label>${label}<select name="${name}">${option(values, value)}</select></label>`;
function match(o) {
  let reasons = [];
  if (state.athlete.interests.toLowerCase().includes(o.industry.toLowerCase()))
    reasons.push("Matches your " + o.industry.toLowerCase() + " interest");
  if (state.athlete.availability === "Flexible" && /flexible/i.test(o.schedule))
    reasons.push("Flexible timing matches your availability");
  if (state.athlete.availability === o.time)
    reasons.push("Matches your preferred time commitment");
  return reasons;
}
function programName() {
  return `${resolveTheme(state).shortName} ASCEND`;
}
function isPartnerExperience(o) {
  return o.partnerExperience ?? ([1, 2, 3, 6].includes(o.id) || !!o.owner);
}
function closeDetails() {
  const id = selected;
  selected = null;
  render();
  document.querySelector(`[data-details="${id}"]`)?.focus();
}
function render() {
  const theme = resolveTheme(state);
  for (const [key, value] of Object.entries(theme.colors)) {
    if (/^#[0-9a-f]{6}$/i.test(value))
      document.documentElement.style.setProperty(`--${key}`, value);
  }
  document.title = programName() + " · Career experiences";
  app.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a>
  <div class="concept-bar"><div><span class="concept-dot"></span>${esc(theme.conceptLabel)}</div><span>Proposed program · Not university endorsed</span></div>
  <header class="masthead"><a class="program-brand" href="#" data-action="home" aria-label="${esc(programName())} home"><span class="brand-school">${esc(theme.shortName)}</span><span class="brand-program">ASCEND<span class="brand-arrow">${arrow}</span></span></a><div class="brand-divider"></div><div class="brand-descriptor">THE NEXT CHAPTER<br><strong>STARTS WITH YOU.</strong></div><div class="masthead-tools"><label class="role-label">INTERACTIVE DEMO ROLE<select id="role">${option(Object.keys(navs), role)}</select></label><button class="reset-button" data-action="reset">Reset demo</button></div></header>
  <div class="navigation-bar"><nav aria-label="${esc(role)} navigation">${navs[role].map((n) => `<button class="nav-item ${page === n ? "active" : ""}" ${page === n ? 'aria-current="page"' : ""} data-page="${n}">${n}</button>`).join("")}</nav><span class="workspace-context">${esc(role)} workspace <span class="status-dot"></span></span></div>
  <div class="demo-banner"><strong>THIS IS A WORKING DEMO.</strong><span>Fictional employers. Sample opportunities. Simulated activity. No secured partnerships or university endorsement.</span></div>
  <main id="main-content" tabindex="-1">${content()}</main>
  <footer><div><strong>${esc(programName())}</strong><p>A proposed next step for ${esc(state.school)} student-athletes.</p><span>Powered by the ASCEND platform</span></div><div class="footer-contact"><strong>${esc(theme.contacts.label)}</strong><p>${esc(theme.contacts.name)}</p>${theme.contacts.email ? `<p>${esc(theme.contacts.email)}</p>` : ""}</div><div class="footer-demo"><strong>Concept, not commitment.</strong><p>Browser-local demo. Data stays in this browser; no shared live service. No real applications or messages are sent.</p><span>${esc(theme.conceptLabel)}</span></div></footer>
  ${selected ? details() : ""}${toast ? `<div class="toast" role="status">${esc(toast)}</div>` : ""}`;
  document
    .querySelectorAll(".panel h3, .card h3")
    .forEach((el) => (el.style.scrollMarginTop = "20px"));
  if (selected) {
    for (const el of document.querySelectorAll(
      ".skip-link,.concept-bar,.masthead,.navigation-bar,.demo-banner,main,footer",
    ))
      el.inert = true;
  }
  bind();
}
function heading(k, title, sub, extra = "") {
  return `<div class="page-heading"><div><div class="eyebrow">${k}</div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;
}
function content() {
  if (role === "Student-athlete") {
    if (page === "Explore opportunities") return board();
    if (page === "My profile") return profile();
    if (page === "Connections") return connections();
    return myOpportunities();
  }
  if (role === "Employer") {
    if (page === "Create opportunity") return createForm();
    if (page === "Company profile") return companyForm();
    return employer();
  }
  if (page === "Approvals") return approvals();
  if (page === "School settings") return schoolSettings();
  return staff();
}
function schoolSettings() {
  const t = resolveTheme(state);
  return (
    heading(
      "PROGRAM IDENTITY",
      "Built for your university.",
      "Keep the program identity consistent across every role. Changes are local to this browser.",
    ) +
    `<form id="school-form" class="panel form-grid">${field("School name", "school", state.school)}${field("Program school name", "shortName", t.shortName)}${field("Program accent (demo palette)", "accent", t.colors.accent, "color")}${field("Program contact name / status", "contactName", t.contacts.name)}${field("Program contact email (optional, non-sensitive)", "contactEmail", t.contacts.email, "email", false)}<div class="note">Official Campbell colors still require verification against an accessible official branding guide. The original demo accent is retained. School-supported athlete verification is a future feature; NCAA IDs do not establish identity or eligibility.</div><button class="primary">Save school settings</button></form>`
  );
}
function hero() {
  const t = resolveTheme(state);
  const media = t.imagery
    ? `<figure class="hero-photo"><img src="${esc(t.imagery.src)}" alt="${esc(t.imagery.alt)}"><figcaption>${esc(t.imagery.credit)} · ${esc(t.imagery.license)}</figcaption></figure>`
    : `<div class="hero-track" aria-hidden="true"><svg class="track-graphic" viewBox="0 0 520 400" fill="none"><path d="M80 480V225C80 45 465 45 465 225V480M117 480V225C117 92 428 92 428 225V480M154 480V225C154 139 391 139 391 225V480M191 480V225C191 186 354 186 354 225V480" stroke="currentColor" stroke-width="1.5"/><path d="m236 297 75-75m-74 0h74v74" stroke="var(--accent)" stroke-width="15"/><path d="M30 350h470M30 370h470" stroke="currentColor" stroke-width="1"/></svg><div class="track-caption"><span>DRIVE. DISCIPLINE. DIRECTION.</span><strong>YOUR NEXT<br>STARTING LINE.</strong></div><div class="track-number">01 / THE NEXT CHAPTER</div></div>`;
  return `<section class="program-hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow">${esc(programName())} / PROPOSED PROGRAM</div><h1 id="hero-title">BUILD WHAT<br>COMES AFTER<br><span>THE GAME.</span></h1><p>Explore careers, connect with employers, and gain professional experience while competing at ${esc(t.shortName)}.</p><div class="hero-actions"><button class="primary" data-action="explore">Explore Opportunities ${arrow}</button><button class="hero-secondary" data-action="employers">For Employers ${arrow}</button></div><span class="hero-disclaimer">Student-built concept. Real ambition. All experiences shown are samples.</span></div>${media}</section>
 <div class="program-path" aria-label="How the proposed program works">${[
   ["01", "FIND YOUR DIRECTION", "Explore your interests."],
   ["02", "MAKE A CONNECTION", "Meet employers. Experience the work."],
   ["03", "TAKE THE NEXT STEP", "Explore internships, fellowships & jobs."],
   ["04", "KEEP MOVING FORWARD", "Build relationships. Track next steps."],
 ]
   .map(
     ([n, title, desc]) =>
       `<div><span>${n}</span><div><strong>${title}</strong><p>${desc}</p></div></div>`,
   )
   .join("")}</div>`;
}
function board() {
  const list = state.opportunities.filter(
    (o) =>
      o.approved &&
      (!filters.search ||
        `${o.title} ${o.company} ${o.description}`
          .toLowerCase()
          .includes(filters.search.toLowerCase())) &&
      ["industry", "type", "location", "time"].every(
        (k) => !filters[k] || o[k] === filters[k],
      ) &&
      (!filters.availability ||
        (state.athlete.availability === "Flexible"
          ? /flexible/i.test(o.schedule)
          : state.athlete.availability === o.time)),
  );
  const section = (partner, title, desc) => {
    let entries = list.filter((o) => isPartnerExperience(o) === partner);
    return `<section class="opportunity-section" aria-label="${title}"><div class="section-title"><div><div class="eyebrow">${partner ? "01 / EXPERIENCE THE POSSIBILITIES" : "02 / EXPLORE THE NEXT LEVEL"}</div><h2>${title} <span>${entries.length}</span></h2><p>${desc}</p></div><span class="section-sample">SAMPLE LISTINGS ONLY</span></div><div class="cards">${entries.map(card).join("") || '<div class="empty">No opportunities match these filters in this category. Try another search or clear filters.</div>'}</div></section>`;
  };
  return (
    hero() +
    `<section id="opportunity-board" tabindex="-1"><div class="board-heading"><div><div class="eyebrow">YOUR CAREER. YOUR PACE.</div><h2>FIND YOUR NEXT OPPORTUNITY.</h2></div><button class="text-button" data-page="My profile">Update your interests ${arrow}</button></div><div class="filter-panel"><div class="filters"><label class="search"><span aria-hidden="true">⌕</span><input id="search" aria-label="Search opportunities" placeholder="Search experiences, roles, or employers" value="${esc(filters.search)}"></label>${["industry", "type", "location", "time"].map((k) => `<label class="filter-label">${{ industry: "Career interest", type: "Experience type", location: "Location", time: "Time commitment" }[k]}<select data-filter="${k}" aria-label="Filter by ${k}"><option value="">${{ industry: "All industries", type: "All experience types", location: "All locations", time: "Any time commitment" }[k]}</option>${option([...new Set(state.opportunities.filter((o) => o.approved).map((o) => o[k]))], filters[k])}</select></label>`).join("")}</div><div class="board-meta"><label class="availability-check"><input type="checkbox" id="availability-match" ${filters.availability ? "checked" : ""}> Matches my availability <span>(${esc(state.athlete.availability)})</span></label><span class="results-count" role="status">${list.length} sample ${list.length === 1 ? "opportunity" : "opportunities"}</span><button class="text-button" data-action="clear">Clear filters</button></div></div>
 ${section(true, "Sample ASCEND partner experiences", "A proposed approach: work with companies to arrange experiences for participating athletes. These fictional examples are not secured partnerships.")}
 ${section(false, "Other sample internships and jobs", "Additional fictional listings to explore. These are not verified vacancies, exclusive opportunities, or guaranteed employment.")}
 <div class="note"><strong>MATCHES, EXPLAINED.</strong><span>Matches use selected interests and stated availability, not AI. Interest selection is not a validated career assessment. Hosts confirm scheduling and eligibility.</span></div></section>`
  );
}
function card(o) {
  let m = match(o);
  return `<article class="card ${["Internship", "Fellowship", "Job"].includes(o.type) ? "long-experience" : "short-experience"}"><div class="card-top"><div class="company-icon ${o.industry === "Technology" ? "blue" : ""}">${esc(
    o.company
      .split(" ")
      .map((x) => x[0])
      .join(""),
  )}</div><button class="save ${state.saved.includes(o.id) ? "saved" : ""}" data-save="${o.id}" aria-label="${state.saved.includes(o.id) ? "Unsave" : "Save"} ${esc(o.title)}" aria-pressed="${state.saved.includes(o.id)}">${state.saved.includes(o.id) ? "★" : "☆"}</button></div><div class="company-name">${esc(o.company)} <span>· Fictional</span></div><h3><button class="title-button" data-details="${o.id}">${esc(o.title)}</button></h3><div class="card-category"><span class="tag">${esc(o.type)}</span><span>${esc(o.industry)}</span></div><p class="card-description">${esc(o.description)}</p><div class="card-facts"><span>⌖ ${esc(o.location)}</span><span>◷ ${esc(o.time)}</span></div><div class="card-compensation">${esc(o.compensation)}</div><div class="match">${m.length ? "✧ " + esc(m[0]) : "◇ Explore a new direction"}</div><div class="card-footer"><small>${o.restricted ? esc(state.school) + " athletes" : "Open eligibility · see details"}</small><button data-details="${o.id}" class="text-button">View details ${arrow}</button></div></article>`;
}
function details() {
  let o = state.opportunities.find((x) => x.id === selected);
  let a = state.applications.find((x) => x.opportunity === o.id);
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabindex="-1"><button class="close" data-action="close" aria-label="Close details">×</button><div class="eyebrow">SAMPLE OPPORTUNITY · FICTIONAL EMPLOYER</div><h2 id="detail-title">${esc(o.title)}</h2><p>${esc(o.company)} · Host: ${esc(o.host)}</p><span class="tag">${esc(o.type)}</span><p>${esc(o.description)}</p><dl>${[
    ["Learning goals", o.goals],
    [
      "Eligibility",
      o.requirements +
        (o.restricted
          ? " Restricted to " + state.school + " athletes in this demo."
          : ""),
    ],
    ["Schedule", o.schedule + " · " + o.time],
    ["Location", o.location],
    ["Compensation", o.compensation],
    ["Capacity", o.capacity + " participants"],
    ["Process", o.process],
  ]
    .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`)
    .join(
      "",
    )}</dl>${match(o).length ? `<div class="note">${match(o).map(esc).join(" · ")}</div>` : ""}<p class="muted">Simulated activity only. Hosts make selection decisions; participation and employment are not guaranteed.</p>${role === "Student-athlete" && o.approved ? `<button class="primary" data-apply="${o.id}" ${a ? "disabled" : ""}>${a ? "Interest submitted" : /Shadowing|Company visit/.test(o.type) ? "Register interest (simulated)" : "Submit application (simulated)"}</button>` : ""}</section></div>`;
}
function profile() {
  return (
    heading(
      "YOUR STORY",
      "More than a student-athlete",
      "Help hosts understand your interests, strengths, and availability.",
    ) +
    `<form id="profile-form" class="panel form-grid">${field("Full name", "name", state.athlete.name)}${field("University", "school", state.school)}${field("Sport", "sport", state.athlete.sport)}${select("Academic year", "year", ["Freshman", "Sophomore", "Junior", "Senior", "Graduate"], state.athlete.year)}${field("Major", "major", state.athlete.major)}${field("Career interests (comma-separated)", "interests", state.athlete.interests)}${field("Skills", "skills", state.athlete.skills)}${field("Preferred location", "location", state.athlete.location)}${select("Availability", "availability", ["Flexible", "Half day", "2 hours", "1 week", "5 hours/week", "10 hours/week", "Full time"], state.athlete.availability)}<p class="muted">Interest selection is not a validated career assessment. Use fictional information; avoid sensitive information.</p><button class="primary">Save profile</button></form>`
  );
}
function myOpportunities() {
  let as = state.applications;
  return (
    heading(
      "KEEP MOVING",
      "My opportunities",
      "Your saved possibilities, activity, and next steps in one place.",
    ) +
    `<h2>Registrations & applications</h2>${
      as.length
        ? as
            .map((a) => {
              let o = state.opportunities.find((o) => o.id === a.opportunity);
              return `<div class="panel activity"><div><span class="tag">${esc(a.status)}</span><h3>${esc(o.title)}</h3><p>${esc(o.company)} · Fictional</p><strong>Next step</strong><p>${esc(a.next)}</p>${a.attended ? '<span class="tag">Attendance recorded (sample)</span>' : ""}</div><button class="secondary" data-details="${o.id}">View opportunity</button></div>`;
            })
            .join("")
        : '<div class="empty">Your next chapter is open. Register interest in an opportunity to see your next steps here.</div>'
    }<h2>Saved for later</h2><div class="cards">${
      state.opportunities
        .filter((o) => state.saved.includes(o.id) && o.approved)
        .map(card)
        .join("") ||
      '<div class="empty">Save an opportunity with the star to revisit it here.</div>'
    }</div>`
  );
}
function connections() {
  return (
    heading(
      "BUILD RELATIONSHIPS",
      "A conversation can open a door",
      "Sample contacts to practice thoughtful follow-up. No messages are sent.",
    ) +
    `<div class="cards">${[
      ["Morgan Reed", "Employer host · Oakline Financial"],
      ["Avery Parker", "Sample alumni contact · Business operations"],
    ]
      .map(
        ([n, d]) =>
          `<article class="panel"><div class="company-icon">${n
            .split(" ")
            .map((x) => x[0])
            .join(
              "",
            )}</div><h3>${n}</h3><p>${d}</p><p class="muted">Fictional contact</p><button class="secondary" data-reminder="${n}">${state.reminders.some((r) => r.name === n) ? "Update reminder" : "Set follow-up reminder"}</button></article>`,
      )
      .join(
        "",
      )}</div><h2>Local follow-up reminders</h2>${state.reminders.map((r) => `<div class="panel">${esc(r.name)} · ${esc(r.date)}<p>${esc(r.note)}</p><small>Simulated reminder · displayed here only; no notification is sent.</small></div>`).join("") || '<div class="empty">No reminders yet. Choose a contact to plan a follow-up.</div>'}<form id="reminder-form" class="panel form-grid" hidden>${field("Contact", "name")}${field("Follow-up date", "date", "", "date")}${field("Follow-up note", "note")}<button class="primary">Save local reminder</button></form>`
  );
}
function companyForm() {
  return (
    heading(
      "YOUR ORGANIZATION",
      "Introduce your team",
      "Help athletes understand the people and experiences behind your organization.",
    ) +
    `<form id="company-form" class="panel form-grid">${field("Fictional company name", "name", state.company.name)}${field("Industry", "industry", state.company.industry)}${field("Description", "description", state.company.description)}${field("Named host", "host", state.company.host)}<button class="primary">Save company profile</button></form>`
  );
}
function createForm() {
  return (
    heading(
      "OPEN A DOOR",
      "Create an opportunity",
      "Create a sample experience. University staff must approve it before athletes can discover it.",
    ) +
    `<form id="create-form" class="panel form-grid">${field("Opportunity title", "title")}${select("Industry", "industry", ["Finance", "Healthcare administration", "Technology", "Marketing", "Business operations"])}${select("Experience type", "type", ["Shadowing", "Company visit", "Externship", "Internship", "Fellowship", "Job"])}${field("Location", "location", state.athlete.location)}${select("Time commitment", "time", ["Half day", "2 hours", "1 week", "5 hours/week", "10 hours/week", "Full time"])}${field("Schedule / timing", "schedule")}${field("Compensation (state unpaid if applicable)", "compensation")}${field("Capacity", "capacity", 5, "number")}${field("Named host", "host", state.company.host)}${field("Description", "description")}${field("Learning goals", "goals")}${field("Eligibility / requirements", "requirements")}${field("Application or registration process", "process", "Register interest for host review.")}${select("Eligibility scope", "restricted", ["Participating school athletes", "Open eligibility"])}${select("Listing category", "category", ["Sample ASCEND partner experience", "Other sample internship or job"])}<button class="primary">Submit for staff approval</button></form>`
  );
}
function metrics(items) {
  return `<div class="metrics">${items.map(([v, l]) => `<div><span class="eyebrow">SAMPLE DATA</span><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>`;
}
function employer() {
  let owned = state.opportunities.filter(
    (o) => o.company === state.company.name || o.owner,
  );
  let apps = state.applications.filter((a) =>
    owned.some((o) => o.id === a.opportunity),
  );
  return (
    heading(
      "MAKE CONNECTIONS COUNT",
      "Potential meets opportunity.",
      "Organize meaningful experiences and build recruiting relationships.",
      `<button class="primary" data-page="Create opportunity">+ Create opportunity</button>`,
    ) +
    metrics([
      [owned.length, "Sample opportunities"],
      [apps.length, "Expressions of interest"],
      [
        apps.filter((a) => a.status === "Completed experience").length,
        "Completed experiences",
      ],
    ]) +
    `<h2>Your experiences</h2>${owned.map((o) => `<div class="panel activity"><div><h3>${esc(o.title)}</h3><p>${esc(o.schedule)} · Host: ${esc(o.host)}</p></div><span class="tag">${o.approved ? "Approved" : "Awaiting staff approval"}</span></div>`).join("")}<h2>Interested athletes</h2><p class="muted">All participants and activity are simulated. Status changes and next steps appear in the athlete view.</p>${participantRows(apps, true)}`
  );
}
const statuses = [
  "Interest submitted",
  "Registered",
  "Application under review",
  "Interview",
  "Completed experience",
  "Reported placement",
  "Not selected",
];
function participantRows(as, editable = false) {
  return as.length
    ? as
        .map((a) => {
          let o = state.opportunities.find((o) => o.id === a.opportunity);
          return `<form class="panel participant form-grid" data-participant="${a.id}"><div><h3>${esc(state.athlete.name)}</h3><p>${esc(o.title)}</p><p>${esc(state.athlete.sport)} · ${esc(state.athlete.year)} · ${esc(state.athlete.major)}</p><p>Interests: ${esc(state.athlete.interests)}<br>Skills: ${esc(state.athlete.skills)}<br>Availability: ${esc(state.athlete.availability)} · ${esc(state.athlete.location)}</p></div>${select("Participation status", "status", statuses, a.status)}${field("Next step / scheduling / follow-up (simulated)", "next", a.next)}<label class="check"><input type="checkbox" name="attended" ${a.attended ? "checked" : ""}> Attendance recorded (sample)</label><button class="primary">Save participation update</button></form>`;
        })
        .join("")
    : '<div class="empty">No athlete interest yet. Switch to Student-athlete and register interest in an approved experience.</div>';
}
function staff() {
  return (
    heading(
      "UNIVERSITY WORKSPACE",
      "See the journey take shape.",
      "Coordinate opportunities, participation, and human follow-through.",
    ) +
    metrics([
      [state.applications.length, "Expressions of interest"],
      [
        state.applications.filter((a) => a.status === "Completed experience")
          .length,
        "Completed experiences",
      ],
      [
        state.applications.filter((a) => a.status === "Interview").length,
        "Interviews",
      ],
      [
        state.applications.filter((a) => a.status === "Reported placement")
          .length,
        "Reported placements",
      ],
    ]) +
    `<div class="note">Sample data · Expressions of interest are not completed experiences or employment outcomes. Reported placements are unverified demo statuses.</div><h2>Athlete participation</h2><div class="filters">${["sport", "year", "interests"].map((k) => `<label>${{ sport: "Sport", year: "Academic year", interests: "Career interest" }[k]}<select data-staff-filter="${k}"><option value="">All</option>${option(k === "interests" ? state.athlete.interests.split(",").map((s) => s.trim()) : [state.athlete[k]])}</select></label>`).join("")}</div><div id="participants">${participantRows(state.applications)}</div>`
  );
}
function approvals() {
  let pending = state.opportunities.filter((o) => !o.approved);
  return (
    heading(
      "HUMAN REVIEW",
      "Opportunity approvals",
      "Staff review the host, requirements, and schedule before an opportunity reaches athletes.",
    ) +
    pending
      .map(
        (o) =>
          `<div class="panel"><div class="eyebrow">FICTIONAL EMPLOYER · PENDING REVIEW</div><h3>${esc(o.title)}</h3><p>${esc(o.company)} · ${esc(o.host)}</p><p>${esc(o.description)}</p><button class="secondary" data-details="${o.id}">Review full details</button> <button class="primary" data-approve="${o.id}">Approve opportunity</button></div>`,
      )
      .join("") +
    (pending.length
      ? ""
      : '<div class="empty">All caught up. Employer-created experiences will appear here for review.</div>')
  );
}
function bind() {
  document.querySelector("#role").onchange = (e) => {
    role = e.target.value;
    page = navs[role][0];
    selected = null;
    render();
  };
  document.querySelectorAll("[data-page]").forEach(
    (b) =>
      (b.onclick = () => {
        page = b.dataset.page;
        render();
        window.scrollTo(0, 0);
      }),
  );
  document.querySelectorAll("[data-action]").forEach(
    (b) =>
      (b.onclick = (e) => {
        e.preventDefault();
        let a = b.dataset.action;
        if (a === "reset") {
          if (confirm("Reset all local demo changes?")) {
            state = seed();
            persist();
            selected = null;
            notify("Demo reset to sample data.");
          }
        }
        if (a === "close") closeDetails();
        if (a === "explore") {
          document.querySelector("#opportunity-board")?.focus();
          document
            .querySelector("#opportunity-board")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (a === "employers") {
          role = "Employer";
          page = "Overview";
          render();
          window.scrollTo(0, 0);
        }

        if (a === "clear") {
          filters = {
            search: "",
            industry: "",
            type: "",
            location: "",
            time: "",
            availability: false,
          };
          render();
        }
        if (a === "home") {
          page = navs[role][0];
          render();
        }
      }),
  );
  document.querySelectorAll("[data-save]").forEach(
    (b) =>
      (b.onclick = () => {
        let id = +b.dataset.save;
        state.saved = state.saved.includes(id)
          ? state.saved.filter((x) => x !== id)
          : [...state.saved, id];
        persist();
        render();
      }),
  );
  document.querySelectorAll("[data-details]").forEach(
    (b) =>
      (b.onclick = () => {
        selected = +b.dataset.details;
        render();
        document.querySelector(".modal").focus();
      }),
  );
  document.querySelectorAll("[data-apply]").forEach(
    (b) =>
      (b.onclick = () => {
        let id = +b.dataset.apply;
        if (!state.applications.some((a) => a.opportunity === id)) {
          state.applications.push({
            id: Date.now(),
            opportunity: id,
            status: "Interest submitted",
            next: "Await host review. Your host will confirm availability and next steps in this demo.",
            attended: false,
          });
          persist();
        }
        selected = null;
        notify(
          "Simulated interest submitted. View next steps in My opportunities.",
        );
      }),
  );
  document.querySelectorAll("[data-filter]").forEach(
    (s) =>
      (s.onchange = () => {
        filters[s.dataset.filter] = s.value;
        render();
        document.querySelector(`[data-filter="${s.dataset.filter}"]`)?.focus();
      }),
  );
  const availability = document.querySelector("#availability-match");
  if (availability)
    availability.onchange = () => {
      filters.availability = availability.checked;
      render();
      document.querySelector("#availability-match").focus();
    };
  let search = document.querySelector("#search");
  if (search)
    search.oninput = (e) => {
      let pos = e.target.selectionStart;
      filters.search = e.target.value;
      render();
      let s = document.querySelector("#search");
      s.focus();
      s.setSelectionRange(pos, pos);
    };
  const form = (id, fn) => {
    let f = document.getElementById(id);
    if (f)
      f.onsubmit = (e) => {
        e.preventDefault();
        fn(Object.fromEntries(new FormData(f)), f);
      };
  };
  form("profile-form", (d) => {
    state.school = d.school;
    delete d.school;
    state.athlete = d;
    persist();
    notify("Profile updated. Opportunity matches now reflect your choices.");
  });
  form("company-form", (d) => {
    let old = state.company.name;
    state.opportunities
      .filter((o) => o.company === old)
      .forEach((o) => (o.company = d.name));
    state.company = d;
    persist();
    notify("Company profile saved.");
  });
  form("school-form", (d) => {
    state.school = d.school;
    state.theme = {
      ...resolveTheme(state),
      shortName: d.shortName,
      colors: { ...resolveTheme(state).colors, accent: d.accent },
      contacts: {
        ...resolveTheme(state).contacts,
        name: d.contactName,
        email: d.contactEmail,
      },
    };
    persist();
    notify("Program identity updated throughout the demo.");
  });
  form("create-form", (d, f) => {
    if (+d.capacity < 1 || !Number.isInteger(+d.capacity)) {
      f.elements.capacity.setCustomValidity(
        "Enter a whole number of at least 1.",
      );
      f.elements.capacity.reportValidity();
      f.elements.capacity.oninput = () =>
        f.elements.capacity.setCustomValidity("");
      return;
    }
    state.opportunities.push({
      ...d,
      id: Date.now(),
      capacity: +d.capacity,
      company: state.company.name,
      restricted: d.restricted === "Participating school athletes",
      approved: false,
      owner: true,
      partnerExperience: d.category === "Sample ASCEND partner experience",
    });
    persist();
    page = "Overview";
    notify("Opportunity sent to University staff → Approvals.");
  });
  document.querySelectorAll("[data-approve]").forEach(
    (b) =>
      (b.onclick = () => {
        state.opportunities.find((o) => o.id === +b.dataset.approve).approved =
          true;
        persist();
        notify("Approved. This opportunity is now on the athlete board.");
      }),
  );
  document.querySelectorAll("[data-participant]").forEach(
    (f) =>
      (f.onsubmit = (e) => {
        e.preventDefault();
        let d = Object.fromEntries(new FormData(f)),
          a = state.applications.find((x) => x.id === +f.dataset.participant);
        Object.assign(a, {
          status: d.status,
          next: d.next,
          attended: !!d.attended,
        });
        persist();
        notify("Participation updated. The athlete can see the new next step.");
      }),
  );
  document.querySelectorAll("[data-reminder]").forEach(
    (b) =>
      (b.onclick = () => {
        let f = document.querySelector("#reminder-form");
        f.hidden = false;
        f.elements.name.value = b.dataset.reminder;
        f.elements.date.focus();
      }),
  );
  form("reminder-form", (d) => {
    state.reminders = state.reminders.filter((r) => r.name !== d.name);
    state.reminders.push(d);
    persist();
    notify("Local reminder saved. No notification will be sent.");
  });
  document.querySelectorAll("[data-staff-filter]").forEach(
    (s) =>
      (s.onchange = () => {
        let show = [...document.querySelectorAll("[data-staff-filter]")].every(
          (s) =>
            !s.value || state.athlete[s.dataset.staffFilter].includes(s.value),
        );
        document.querySelector("#participants").style.display = show
          ? ""
          : "none";
        let existing = document.querySelector("#filter-empty");
        if (existing) existing.remove();
        if (!show)
          document
            .querySelector("#participants")
            .insertAdjacentHTML(
              "afterend",
              '<div id="filter-empty" class="empty">No participants match these filters.</div>',
            );
      }),
  );
  let modal = document.querySelector(".modal");
  if (modal) {
    modal.onkeydown = (e) => {
      if (e.key === "Escape") {
        closeDetails();
      }
      if (e.key === "Tab") {
        let els = [
          ...modal.querySelectorAll("button:not(:disabled),a,input,select"),
        ];
        if (
          e.shiftKey &&
          (document.activeElement === els[0] ||
            document.activeElement === modal)
        ) {
          e.preventDefault();
          els.at(-1).focus();
        } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
          e.preventDefault();
          els[0].focus();
        }
      }
    };
  }
}
render();
