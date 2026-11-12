import demoResume from "./demo-resume.json";
import { connectionPage, setConnectionDiscovery, bindConnections, resumePanel, bindResume } from "./connections.js";
import { saveDemoState } from "./storage.js";
import { scheduleMatch, scheduleSummary, displayTime, days } from "./scheduling.js";
import "./style.css";
import { defaultTheme, resolveTheme } from "./theme.js";
import { SCHOOL_CATALOGS, CAREER_INTERESTS, SKILL_OPTIONS } from "./catalog.js";
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const KEY = "ascend-demo-v1";
const seed = () => ({
  school: defaultTheme.school,
  resume: { ...demoResume },
  theme: {
    shortName: defaultTheme.shortName,
    colors: { ...defaultTheme.colors },
    contacts: { ...defaultTheme.contacts },
  },
  athlete: {
    name: "Chase Arrington",
    headline: "Campbell Student-Athlete | Business Management Student | Exploring Wealth Management & Entrepreneurship | Building ASCEND",
    about: "I’m a Business Management student and football student-athlete at Campbell University interested in wealth management and entrepreneurship. I’m building ASCEND, a career platform designed to connect student-athletes with professionals and career experiences they can pursue alongside their athletic commitments.\n\nThrough developing the demo, gathering athlete feedback, and speaking with professionals, I’ve strengthened my communication, relationship-building, and problem-solving skills. I’m looking to learn from experienced professionals and gain practical exposure to wealth management.",
    sport: "Football", year: "Senior", major: "Management, BBA",
    interests: "Wealth Management, Entrepreneurship",
    skills: "Initiative, Relationship Building, Communication, Coachability, Time Management, Teamwork, Leadership",
    location: "Raleigh, NC", graduation: "Spring 2027", photo: "/images/chase-arrington-headshot.webp",
    availability: "Winter demo availability including Wednesday", availabilityStatus: "Set weekly availability",
    windows: [{day:"Wed",start:"09:00",end:"16:00"},{day:"Sat",start:"09:00",end:"17:00"},{day:"Sun",start:"09:00",end:"17:00"}],
    startDate:"2027-01-01", endDate:"2027-02-28", hours:8, format:"Either", period:"Specific dates",
    scheduleAssumption: true,
  },
  alumni: {name:"", headline:"", school:"Campbell University", graduation:"", athleteStatus:"Former student-athlete", sport:"Football", major:"", company:"", title:"", industry:"Business operations", location:"", format:"Flexible", about:"", support:"", contactPreference:"Introduction through ASCEND", visible:false},
  company: {
    name: "Oakline Financial",
    industry: "Finance",
    description:
      "A fictional regional financial services team helping students explore careers.",
    host: "Morgan Reed",
  },
  opportunities: [
    {"id": 8, "proposal": true, "partnerExperience": true, "title": "Inside Healthcare: How Patients Access Treatment", "company": "Regeneron", "host": "Tim Aguglia \u00b7 Reimbursement Business Manager, Regeneron", "industry": "Healthcare reimbursement", "type": "Externship", "location": "Virtual", "format": "Remote", "hours": 3, "negotiable": true, "windows": [], "startDate": "", "endDate": "", "time": "Two 90-minute sessions \u00b7 3 hours total", "schedule": "Two 90-minute virtual sessions within one week (3 hours total). Dates and times arranged with Tim around athlete availability.", "description": "Explore the business side of healthcare with Tim Aguglia. Learn how reimbursement affects access to treatment, work through a fictional scenario, and discover career paths beyond clinical practice.", "goals": "Explain how reimbursement can affect access to treatment; identify career paths in healthcare business; practice clear communication and problem-solving; leave with a practical next step for career exploration.", "requirements": "Current student-athletes of any major interested in healthcare, business, sales, or pharmaceuticals. No prior healthcare experience required. Attend both sessions with a reliable internet connection.", "detailSections": [["Session One \u00b7 Explore the Field", "A 90-minute conversation on Tim\u2019s role, the reimbursement process, patient access barriers, and career paths. Bring questions about entering the industry."], ["Session Two \u00b7 Apply What You Learn", "A 90-minute guided discussion of a fictional access-to-treatment scenario. Identify barriers, explain what you would ask next, and receive feedback from Tim. No patient records or confidential company information are used."], ["Preparation", "Bring a brief introduction and two questions about healthcare careers. No specialist coursework or clinical training is required."], ["What You Leave With", "A clearer picture of healthcare reimbursement, feedback on your reasoning and communication, and a personal next step for exploring the field."], ["Participation", "Register your interest. Tim reviews requests and confirms the session schedule and participation before the experience takes place."], ["Compensation", "Compensation has not been specified."]], "compensation": "Not specified", "capacity": null, "process": "Host reviews interest and confirms participation and scheduling.", "approved": true, "restricted": false, "eyebrow": "HEALTHCARE REIMBURSEMENT \u00b7 VIRTUAL EXTERNSHIP", "disclaimer": "Tim has agreed to an opportunity in the demo. This session plan is a concept for his review; company sponsorship and session dates are not confirmed.", "logo": "/images/regeneron-logo.svg", "responsibilities": "Join both virtual sessions, bring two career questions, discuss a fictional reimbursement scenario, and explain your thinking. Tim provides industry context and feedback; no patient contact or clinical work is involved.", "activityLabel": "Your Role"},
    {"id": 7, "proposal": true, "partnerExperience": true, "windows": [{"day": "Wed", "start": "09:00", "end": "16:00"}], "startDate": "2027-01-20", "endDate": "2027-01-20", "hours": 7, "format": "In person", "negotiable": false, "title": "Inside Banking: A Focused Shadow Day", "company": "KS Bank", "industry": "Banking", "type": "Shadowing", "location": "Smithfield, NC", "time": "Wednesday, January 20 \u00b7 9:00 AM\u20134:00 PM", "schedule": "Wednesday, January 20, 2027 \u00b7 9:00 AM\u20134:00 PM ET", "compensation": "To be determined; no pay commitment", "capacity": null, "host": "Travis Bailey \u00b7 Chief Administrative Officer / EVP", "description": "Spend a day with Travis Bailey exploring community banking, seeing leadership in practice, and discovering where your interests could take you.", "goals": "Explore banking career paths, understand professional expectations, and identify a practical next step for career preparation.", "responsibilities": "Spend a day with your host: explore a staff-led banking workflow using non-customer examples, discuss career paths and skills, and ask questions about professional life.", "requirements": "Current student-athletes interested in banking or business. All majors welcome; no banking experience required.", "process": "Discuss scheduling and eligibility with host before any experience is offered.", "approved": true, "restricted": false, "logo": "/images/ks-bank-logo.svg"},
  ],
  saved: [],
  applications: [],
  reminders: [],
});
let storageAvailable = true;
let state;
try {
  state = JSON.parse(localStorage.getItem(KEY)) || seed();
} catch {
  state = seed();
  storageAvailable = false;
}
// Update only the untouched summer demo schedule; preserve custom availability.
if (state.athlete?.scheduleAssumption && state.athlete.startDate === '2027-06-01' && state.athlete.endDate === '2027-07-31' && Number(state.athlete.hours) === 5 && JSON.stringify(state.athlete.windows) === JSON.stringify([{day:'Wed',start:'14:00',end:'17:00'},{day:'Thu',start:'14:00',end:'17:00'}])) {
 const defaults=seed().athlete;
 for (const key of ['windows','startDate','endDate','hours','period','availability']) state.athlete[key]=defaults[key];
}
if (state.theme?.colors?.accent === "#b8502b") state.theme.colors.accent = defaultTheme.colors.accent;
if (state.theme?.imagery === null) delete state.theme.imagery;
if (state.athlete?.name === "Jordan Ellis" && state.athlete.sport === "Soccer") state.athlete.sport = "Women's Soccer";
if (state.athlete?.name === "Jordan Ellis" && state.athlete.major === "Business Administration") state.athlete.major = "Management, BBA";
// Retire the old fictional alumni starter without clearing user-created profiles.
if (state.alumni?.name === "Avery Parker") state.alumni = {...seed().alumni};
if (state.alumni?.format === "Remote" || state.alumni?.format === "Hybrid") state.alumni.format = "Flexible";
const sportAliases = {
  "Women's Volleyball": "Volleyball",
  "Men's Indoor Track & Field": "Men's Track & Field",
  "Men's Outdoor Track & Field": "Men's Track & Field",
  "Women's Indoor Track & Field": "Women's Track & Field",
  "Women's Outdoor Track & Field": "Women's Track & Field",
};
if (sportAliases[state.athlete?.sport]) state.athlete.sport = sportAliases[state.athlete.sport];
for (const sample of seed().opportunities) {
  const old = state.opportunities.find(o => o.id === sample.id && o.company === sample.company && o.schedule === sample.schedule);
  if (old && !old.windows && old.negotiable === undefined) {
    for (const key of ['windows','startDate','endDate','hours','format','negotiable']) if (sample[key] !== undefined) old[key] = sample[key];
  }
}
// Refresh only the original demo listings; preserve any employer-created or edited listing.
const originalSamples = {
  1: ["Jun 10, 2027 · 2:00–4:00 PM ET", "Unpaid learning experience"],
  2: ["Nov 18 · 2:00–4:00 PM", "Unpaid learning experience"],
  3: ["Dec 7–11 · flexible sessions", "$300 sample stipend"],
  4: ["Spring semester · flexible around classes", "$20/hour (sample)"],
  5: ["After graduation · weekdays", "Compensation discussed during simulated interview"],
  6: ["January–March · flexible", "$750 sample stipend"],
};
for (const sample of seed().opportunities) {
  const old = state.opportunities.find(o => o.id === sample.id && o.company === sample.company);
  if (old && originalSamples[sample.id] && old.schedule === originalSamples[sample.id][0] && old.compensation === originalSamples[sample.id][1]) {
    Object.assign(old, {schedule:sample.schedule,compensation:sample.compensation});
    if (sample.startDate && !old.startDate) old.startDate = sample.startDate;
    if (sample.endDate && !old.endDate) old.endDate = sample.endDate;
  }
}

// Add the proposed KS Bank example without resetting saved athlete data.
state.opportunities = state.opportunities.filter(o => ![1, 6].includes(o.id));
const featured = [7, 8].map(id => seed().opportunities.find(o => o.id === id));
state.opportunities = featured;
state.saved = (state.saved || []).filter(id => [7, 8].includes(Number(id)));
state.applications = (state.applications || []).filter(a => [7, 8].includes(Number(a.opportunity)));
const conceptPresentation = {
  2: {company:"Juniper Health Group",logo:"/images/concept-juniper.svg",title:"Inside Healthcare Operations",responsibilities:"Follow a sample service workflow, discuss how teams coordinate scheduling and patient services, and bring two questions about healthcare administration."},
  3: {company:"Northstar Digital",logo:"/images/concept-northstar.svg",title:"Build Your Technology Career",responsibilities:"Join guided product and engineering conversations, review a fictional user problem, and discuss the skills behind different technology roles."},
  4: {company:"Fieldwork Creative",logo:"/images/concept-fieldwork.svg",title:"Brand & Marketing Intern",responsibilities:"Research a sample audience, help plan campaign content, and summarize performance findings with feedback from a supervisor."},
  5: {company:"Cedarworks Supply",logo:"/images/concept-cedarworks.svg",title:"Operations Associate",responsibilities:"Support customer requests, maintain operational records, and identify improvements to day-to-day business workflows."},
};
for (const o of state.opportunities) {
  const design = conceptPresentation[o.id];
  if (design && o.company === design.company) Object.assign(o, design, {concept:true,activityLabel:"Your Role"});
}


let role = "Student-athlete",
  page = "Home",
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
const persist = () => {
  try { storageAvailable = saveDemoState(localStorage, KEY, state); }
  catch { storageAvailable = false; }
  return storageAvailable;
};
let pendingPhoto;
let profileEditing = false;
// Upgrade only untouched demo copy; preserve any headline or bio the athlete edited.
if (state.athlete?.name === "Chase Arrington") {
  if (state.athlete.headline === 'Campbell Football Student-Athlete | Business Management | Exploring Trust & Wealth Management') state.athlete.headline = seed().athlete.headline;
  if (state.athlete.about === 'I’m a business management student and football student-athlete at Campbell University, expecting to graduate in spring 2027. I’m interested in trust and wealth management and building relationships that help people plan for their future. Through ASCEND, I’m exploring how student-athletes can gain meaningful career experience alongside their athletic commitments. I’m looking for opportunities to learn from professionals through shadowing, career conversations, and internships.') state.athlete.about = seed().athlete.about;
}

// Apply Chase's approved pitch profile once; retain availability, résumé, and later edits.
if (state.athlete?.name === "Chase Arrington" && !state.chaseProfileNov9Approved) {
  const approved = seed().athlete;
  for (const field of ["headline", "about", "interests", "skills"]) state.athlete[field] = approved[field];
  state.chaseProfileNov9Approved = true;
  persist();
}

// Include the confirmed shadow-day window in Chase's pitch availability once.
// Keep his other saved days and all non-schedule profile fields.
if (state.athlete?.name === "Chase Arrington" && !state.jan20ShadowAvailabilityAdded) {
  state.athlete.windows = [{day:"Wed",start:"09:00",end:"16:00"}, ...(state.athlete.windows || []).filter(w=>w.day !== "Wed")];
  state.athlete.startDate = "2027-01-01";
  state.athlete.endDate = "2027-02-28";
  state.athlete.hours = Math.max(7, Number(state.athlete.hours) || 0);
  state.athlete.format = "Either";
  state.athlete.availabilityStatus = "Set weekly availability";
  state.athlete.availability = "See stated schedule";
  state.athlete.scheduleAssumption = true;
  state.jan20ShadowAvailabilityAdded = true;
  persist();
}

// Clear Eric's practice connection once; keep his directory profile and Travis's current status.
if (!state.ericPracticeConnectionClearedNov9) {
  if (state.network) delete state.network['eric-caruth'];
  state.ericPracticeConnectionClearedNov9 = true;
  persist();
}

if (state.athlete?.name === "Chase Arrington" && !state.resume?.data) {
  if (!state.resume) state.resume = { ...demoResume };
  state.resumeNov9Installed = true;
  persist();
}
// Restore the requested pitch starting state once, without resetting the athlete profile.
if (!state.pitchStartingStateNov9Ready) {
  state.applications = state.applications.filter(a => ![5, 7].includes(Number(a.opportunity)) && state.opportunities.some(o => o.id === a.opportunity));
  if (state.network) delete state.network['travis-bailey'];
  state.pitchStartingStateNov9Ready = true;
  persist();
}

state.alumni ||= seed().alumni;
if (state.athlete.name === "Chase Arrington" && !state.athlete.photo && !state.athlete.photoRemoved) state.athlete.photo = seed().athlete.photo;
// Retain existing user profiles. Upgrade only the untouched original sample.
if (state.athlete?.name === "Jordan Ellis") { state.athlete = seed().athlete; }
const originalFinance = state.opportunities.find(o => o.id === 1 && o.company === "Oakline Financial" && o.title === "A day in financial strategy");
if (originalFinance) Object.assign(originalFinance, seed().opportunities[0]);

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
    "Home",
    "Explore Opportunities",
    "My Opportunities",
    "Connections",
    "My Profile",
  ],
  Alumni: ["Alumni profile", "Student connections"],
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
const GRADUATION_OPTIONS = ["Not sure yet", ...Array.from({length:6},(_,i)=>2026+i).flatMap(year=>["Winter","Spring","Summer","Fall"].map(term=>`${term} ${year}`))];
const ALUMNI_GRADUATIONS = ["Prefer not to say", ...Array.from({length:87},(_,i)=>2026-i).flatMap(year=>["Winter","Spring","Summer","Fall"].map(term=>`${term} ${year}`)), "Before 1940"];
const LOCATION_OPTIONS = ["Buies Creek, NC","Raleigh, NC","Durham, NC","Charlotte, NC","Anywhere in North Carolina","Anywhere in the United States","International opportunities","Open to relocation","No location preference"];
const ALUMNI_SUPPORT = ["Career conversations","Resume feedback","Interview preparation","Mentoring","Job shadowing","Company visits","Internship introductions","Job search guidance","Industry insights","International career guidance"];
const selectedValues = (value) => Array.isArray(value) ? value : String(value || "").split(",").map(s => s.trim()).filter(Boolean);
const multiSelect = (label, name, values, current) => {
  const chosen = selectedValues(current).map(v => values.find(item => item.toLowerCase() === v.toLowerCase()) || v);
  return `<fieldset class="multi-select"><legend>${esc(label)}</legend><details><summary>${chosen.length ? esc(chosen.join(", ")) : "Choose one or more"}</summary><div class="multi-options">${values.map(v => `<label class="check"><input type="checkbox" name="${name}" value="${esc(v)}" ${chosen.includes(v) ? "checked" : ""}>${esc(v)}</label>`).join("")}</div></details></fieldset>`;
};
const textArea = (label, name, value, maxlength) =>
  `<label class="wide-field">${label}<textarea name="${name}" maxlength="${maxlength}" rows="4">${esc(value || "")}</textarea></label>`;
const timeOptions = Array.from({length:48}, (_,i) => `${String(Math.floor(i/2)).padStart(2,"0")}:${i%2 ? "30" : "00"}`);
const timeSelect = (label, name, value) =>
  `<label>${label}<select name="${name}">${timeOptions.map(t => `<option value="${t}" ${t === value ? "selected" : ""}>${displayTime(t)}</option>`).join("")}</select></label>`;
function match(o) {
  let reasons = [];
  if (selectedValues(state.athlete.interests).includes(o.industry))
    reasons.push("Matches your " + o.industry.toLowerCase() + " interest");
  reasons.push(scheduleMatch(state.athlete, o).label);
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
  <header class="masthead"><a class="program-brand" href="#" data-action="home" aria-label="${esc(programName())} home"><img class="athletics-mark" src="/images/campbell-camel.png" alt="" aria-hidden="true"><span class="brand-school">${esc(theme.shortName)}</span><span class="brand-divider" aria-hidden="true"></span><span class="brand-program">ASCEND<span class="brand-arrow">${arrow}</span></span></a><div class="masthead-tools"><label class="role-label visible-role" for="role">View As<select id="role">${Object.keys(navs).map(value => `<option value="${esc(value)}" ${value === role ? "selected" : ""}>${esc({"Student-athlete":"Student-Athlete","University staff":"University Staff"}[value] || value)}</option>`).join("")}</select></label></div></header>
  <div class="navigation-bar"><nav aria-label="${esc(role)} navigation">${navs[role].map((n) => `<button class="nav-item ${page === n ? "active" : ""}" ${page === n ? 'aria-current="page"' : ""} data-page="${n}">${n}</button>`).join("")}</nav></div>
  <div class="demo-banner"><strong>Demo</strong></div>
  ${!storageAvailable ? `<div class="note" role="status">Session-only mode: browser storage is unavailable. Changes work until this page closes. Open this file in a regular browser tab to retain edits between visits.</div>` : ""}
  <main id="main-content" tabindex="-1">${content()}</main>
  ${page === "Home" ? faq() : ""}<footer><div><strong>${esc(programName())}</strong><p>Built for student-athletes at ${esc(state.school)}.</p></div><div class="footer-demo"><strong>About This Demo</strong><p>Independent challenge demo. Requests and registrations are simulated in this browser.</p><button class="reset-button footer-reset" data-action="reset">Reset Demo</button></div></footer>
  ${selected ? details() : ""}${toast ? `<div class="toast" role="status">${esc(toast)}</div>` : ""}`;
  document
    .querySelectorAll(".panel h3, .card h3")
    .forEach((el) => (el.style.scrollMarginTop = "20px"));
  if (selected) {
    for (const el of document.querySelectorAll(
      ".skip-link,.masthead,.navigation-bar,.demo-banner,main,footer",
    ))
      el.inert = true;
  }
  bind();
}
function heading(k, title, sub, extra = "") {
  return `<div class="page-heading"><div><div class="eyebrow">${k}</div><h1>${title}</h1><p>${sub}</p></div>${extra}</div>`;
}
function content() {
  if (new URLSearchParams(window.location.search).get('profile-review') === 'tim-aguglia') return connectionPage(state);
  if (role === "Student-athlete") {
    if (page === "Home") return hero();
    if (page === "Explore Opportunities") return board();
    if (page === "Find your direction") return direction();
    if (page === "My Profile") return profile();
    if (page === "Connections") return connections();
    return myOpportunities();
  }
  if (role === "Alumni") return page === "Alumni profile" ? alumniProfile() : alumniConnections();
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
    `<form id="school-form" class="panel form-grid">${field("School name", "school", state.school)}${field("Program school name", "shortName", t.shortName)}${field("Program accent (demo palette)", "accent", t.colors.accent, "color")}${field("Program contact name / status", "contactName", t.contacts.name)}${field("Program contact email (optional, non-sensitive)", "contactEmail", t.contacts.email, "email", false)}<div class="note">Campbell palette verified against the university brand guide on October 28, 2026. School-supported athlete verification is a future feature; NCAA IDs do not establish identity or eligibility.</div><button class="primary">Save school settings</button></form>`
  );
}
function hero() {
  const t = resolveTheme(state);
  const media = t.imagery
    ? `<figure class="hero-photo"><img src="${esc(t.imagery.src)}" alt="${esc(t.imagery.alt)}"><figcaption><a href="${esc(t.imagery.sourceUrl)}" target="_blank" rel="noopener">${esc(t.imagery.credit)}</a> · Challenge demo · Cropped for display</figcaption></figure>`
    : `<div class="hero-track" aria-hidden="true"><svg class="track-graphic" viewBox="0 0 520 400" fill="none"><path d="M80 480V225C80 45 465 45 465 225V480M117 480V225C117 92 428 92 428 225V480M154 480V225C154 139 391 139 391 225V480M191 480V225C191 186 354 186 354 225V480" stroke="currentColor" stroke-width="1.5"/><path d="m236 297 75-75m-74 0h74v74" stroke="var(--accent)" stroke-width="15"/><path d="M30 350h470M30 370h470" stroke="currentColor" stroke-width="1"/></svg><div class="track-caption"><span>DRIVE. DISCIPLINE. DIRECTION.</span><strong>YOUR NEXT<br>STARTING LINE.</strong></div><div class="track-number">01 / THE NEXT CHAPTER</div></div>`;
  return `<section class="program-hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="hero-rally">FIGHT AS ONE.</div><h1 id="hero-title">BUILD WHAT<br>COMES AFTER<br><span>THE GAME.</span></h1><p>Connect with professionals and alumni ready to help you build your career beyond sports.</p></div>${media}</section>
 <section class="rooted-panel rooted-start" aria-labelledby="rooted-title"><figure class="rooted-photo"><img src="/images/campbell-volleyball-champions.webp" alt="Campbell volleyball team celebrates its 2025 CAA championship"><figcaption>Photo: <a href="https://gocamels.com/news/2025/11/23/volleyball-caa-champions-camels-win-thriller-to-secure-title.aspx" target="_blank" rel="noopener">Campbell Athletics / GoCamels</a> · Cropped for display</figcaption></figure><div class="rooted-copy"><span class="eyebrow">ROOTED IN BUIES CREEK</span><h2 id="rooted-title">Your ambition.<br>A community behind it.</h2><div class="program-path" aria-label="Three ways to use ASCEND">
 <button class="path-step" data-build-profile><div><strong>SHOW YOUR STORY</strong><p>Share your background, career interests, and résumé.</p><span class="path-link">View My Profile ${arrow}</span></div></button>
 <button class="path-step" data-page="Connections"><div><strong>MAKE A CONNECTION</strong><p>Meet professionals and alumni ready to help.</p><span class="path-link">Discover People ${arrow}</span></div></button>
 <button class="path-step" data-action="explore"><div><strong>GAIN EXPERIENCE</strong><p>Explore opportunities that fit your interests and availability.</p><span class="path-link">Explore Opportunities ${arrow}</span></div></button></div></div></section>`;
}
function faq() {
 return `<section class="demo-faq"><h2>Frequently Asked Questions</h2><details class="panel"><summary>Who can use ASCEND?</summary><p>Proposed model: current student-athletes at participating universities, including graduates who continue competing. Former athletes can stay connected as alumni. Each opportunity sets its own enrollment, graduation, location, and experience requirements. University verification is planned; this demo does not verify eligibility.</p></details><details class="panel"><summary>Are the opportunities real?</summary><p>Listings currently show illustrative examples, not open positions. Professionals featured in Connections have agreed to appear; proposed help is labeled.</p></details><details class="panel"><summary>How does scheduling work?</summary><p>Save your available dates, days, and hours in your profile. ASCEND compares them with listing requirements. Employers confirm final arrangements; travel time is not included.</p></details><details class="panel"><summary>Do requests reach professionals?</summary><p>Requests are simulated in this browser. Direct messaging is a planned feature for a future pilot.</p></details></section>`;
}
function direction() {
 return heading("YOUR STARTING POINT","What do you need right now?","You can explore before building your profile.")+`<div class="cards"><section class="panel"><h2>I’m not sure what career I want.</h2><p>Explore different fields through career conversations.</p><button class="primary" data-guide="explore">Find people to learn from</button></section><section class="panel"><h2>I know my interests but need guidance.</h2><p>Choose a field and find relevant professionals.</p><form id="guidance-form">${select("Career field","field",["Home Healthcare","Trust and wealth management","Healthcare reimbursement","Sales and business development"])}<button class="primary">Find guidance</button></form></section><section class="panel"><h2>I’m ready for experience.</h2><p>Explore listings and compare them with your availability.</p><button class="primary" data-guide="experience">Explore Opportunities</button></section></div>`;
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
      (!filters.availability || ["fits", "flexible"].includes(scheduleMatch(state.athlete, o).status)),
  );
  const section = (partner, title) => {
    let entries = list.filter((o) => isPartnerExperience(o) === partner);
    return `<section class="opportunity-section" aria-label="${title}"><div class="section-title"><h2>${title} <span>${entries.length}</span></h2></div><div class="cards">${entries.map(card).join("") || '<div class="empty">No matches here. Try another filter.</div>'}</div></section>`;
  };
  return (
    `<section id="opportunity-board" tabindex="-1"><div class="board-heading"><h2>Explore Opportunities</h2><button class="text-button" data-page="My Profile">Edit interests ${arrow}</button></div><div class="filter-panel"><div class="filters"><label class="search"><span aria-hidden="true">⌕</span><input id="search" aria-label="Search opportunities" placeholder="Search roles or employers" value="${esc(filters.search)}"></label>${["industry", "type", "location", "time"].map((k) => `<label class="filter-label">${{ industry: "Career field", type: "Experience", location: "Location", time: "Time" }[k]}<select data-filter="${k}" aria-label="Filter by ${k}"><option value="">${{ industry: "All fields", type: "All types", location: "All locations", time: "Any time" }[k]}</option>${option([...new Set(state.opportunities.filter((o) => o.approved).map((o) => o[k]))], filters[k])}</select></label>`).join("")}</div><div class="board-meta"><label class="availability-check"><input type="checkbox" id="availability-match" ${filters.availability ? "checked" : ""}> Fits My Availability <small>(includes flexible)</small></label><span class="results-count" role="status">${list.length} ${list.length === 1 ? "listing" : "listings"} · examples unless labeled otherwise</span><button class="text-button" data-action="clear">Clear filters</button></div></div>
 ${filters.availability ? [ ["fits", "Fits Your Availability"], ["flexible", "Flexible—Confirm With Host"] ].map(([status, title]) => { const entries = list.filter(o => scheduleMatch(state.athlete, o).status === status); return entries.length ? `<section class="opportunity-section" aria-label="${title}"><div class="section-title"><h2>${title} <span>${entries.length}</span></h2></div><div class="cards">${entries.map(card).join("")}</div></section>` : ""; }).join("") || `<div class="empty">No matching or flexible experiences. Try adjusting your filters.</div>` : section(true, "Career Experiences") + section(false, "Internships & Jobs")}
 <div class="note"><strong>About schedule matching</strong><span>Matches use your saved availability. Flexible experiences still need host confirmation. Travel time is not included.</span></div></section>`
  );
}
function card(o) {
  return `<article class="card ${["Internship", "Fellowship", "Job"].includes(o.type) ? "long-experience" : "short-experience"}"><div class="card-top"><div class="company-icon ${o.logo ? "company-logo" : ""} ${o.industry === "Technology" ? "blue" : ""}">${o.logo ? `<img src="${esc(o.logo)}" alt="${esc(o.company)} logo">` : esc(o.company.split(" ").map(x => x[0]).join(""))}</div><button class="save ${state.saved.includes(o.id) ? "saved" : ""}" data-save="${o.id}" aria-label="${state.saved.includes(o.id) ? "Unsave" : "Save"} ${esc(o.title)}" aria-pressed="${state.saved.includes(o.id)}">${state.saved.includes(o.id) ? "★" : "☆"}</button></div><div class="company-name">${esc(o.company)} ${[7, 8].includes(o.id) ? "" : `<span>· ${esc(o.concept ? "Concept" : (o.cardLabel || "Illustrative example"))}</span>`}</div><h3><button class="title-button" data-details="${o.id}">${esc(o.title)}</button></h3><div class="card-category"><span class="tag">${esc(o.type)}</span><span>${esc(o.industry)}</span></div><div class="card-facts"><span>⌖ ${esc(o.location)}</span><span>◷ ${esc(o.time)}</span></div><p class="schedule-status" data-status="${scheduleMatch(state.athlete, o).status}">${esc(scheduleMatch(state.athlete, o).label)}</p><div class="card-footer">${o.restricted ? "<small>Campbell athletes</small>" : ""}<button data-details="${o.id}" class="text-button">View details ${arrow}</button></div></article>`;
}
function details() {
  let o = state.opportunities.find((x) => x.id === selected);
  let a = state.applications.find((x) => x.opportunity === o.id);
  return `<div class="modal-backdrop"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="detail-title" tabindex="-1"><button class="close" data-action="close" aria-label="Close details">×</button>${o.logo ? `<div class="opportunity-brand"><img src="${esc(o.logo)}" alt="${esc(o.company)} logo"></div>` : ""}<div class="eyebrow">${esc(o.eyebrow || (o.proposal ? "KS BANK · JOB SHADOWING" : o.concept ? `${o.company} · ${o.type}`.toUpperCase() : "ILLUSTRATIVE EXAMPLE · NOT AN OPEN POSITION"))}</div><h2 id="detail-title">${esc(o.title)}</h2><p>${esc(o.company)} · Host: ${esc(o.host)}</p><span class="tag">${esc(o.type)}</span>${o.concept ? `<span class="tag concept-label">Concept</span>` : ""}<p>${esc(o.description)}</p><details class="opportunity-more"><summary>Experience Details</summary><dl>${[
    ["Learning goals", o.goals],
    ...(o.responsibilities ? [[o.activityLabel || "Your day", o.responsibilities]] : []),
    [
      "Eligibility",
      o.requirements +
        (o.restricted
          ? " Restricted to " + state.school + " athletes in this demo."
          : ""),
    ],
    ["Schedule", o.schedule],
    ...(o.detailSections || []),
    ...(!o.proposal ? [["Required availability", scheduleSummary(o)]] : []),
    ["Location", o.location],
    ...(!o.proposal ? [["Compensation", o.compensation], ["Capacity", o.capacity == null ? "To be determined" : o.capacity + " participants"], ["Process", o.process]] : []),
  ]
    .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`)
    .join(
      "",
    )}</dl></details>${match(o).length ? `<div class="note">${match(o).map(esc).join(" · ")}</div>` : ""}<p class="muted">${esc(o.disclaimer || (o.proposal ? "Date and hours confirmed with Travis Bailey. Experience activities remain illustrative; registration is a demo." : o.concept ? "Fictional company and opportunity for demonstration. No opening or offer exists." : "Hosts confirm eligibility and selection."))}</p>${role === "Student-athlete" && o.approved ? `<button class="primary" data-apply="${o.id}" ${a ? 'data-page="My Opportunities"' : ""}>${a ? "View in My Opportunities" : /Shadowing|Company visit|Externship/.test(o.type) ? "Register interest (simulated)" : "Submit application (simulated)"}</button>` : ""}</section></div>`;
}

function legacyScheduleFields(value, employer) {
  return `<fieldset class="schedule-editor"><legend>${employer ? "Required schedule" : "Your availability"}</legend><p>Enter one window per day, in Eastern time. ${employer ? "Select required days, or mark scheduling negotiable." : "Select days you are available. Unselected days are unavailable."}</p>
  ${select("Planning period", "period", ["Specific dates", "Summer", "Fall", "Spring"], value.period || "Specific dates")}
  <div class="schedule-dates">${field("Start date", "startDate", value.startDate || "", "date")}${field("End date", "endDate", value.endDate || "", "date")}${field(employer ? "Expected hours per week" : "Maximum hours per week", "hours", value.hours || "", "number")}${select(employer ? "Work format" : "Work format preference", "format", employer ? ["In person", "Remote", "Hybrid"] : ["Either", "In person", "Remote", "Hybrid"], value.format || (employer ? "In person" : "Either"))}</div>
  ${employer ? `<label class="check"><input type="checkbox" name="negotiable" ${value.negotiable ? "checked" : ""}> Scheduling is negotiable with the athlete</label>` : ""}
  <div class="week-windows">${days.map(day => { const w = value.windows?.find(w=>w.day===day); return `<div class="day-window"><label class="check"><input type="checkbox" name="day-${day}" ${w ? "checked" : ""}>${day}</label><label>From (${day})<input type="time" name="start-${day}" value="${esc(w?.start || "13:00")}"></label><label>Until (${day})<input type="time" name="end-${day}" value="${esc(w?.end || "17:00")}"></label></div>`; }).join("")}</div><p class="schedule-error" role="alert"></p></fieldset>`;
}
function scheduleFields(value, employer) {
  if (employer) return legacyScheduleFields(value, true);
  const status = value.availabilityStatus || (value.windows?.length ? "Set weekly availability" : "Add schedule later");
  const windows = days.map(day => {
    const w = value.windows?.find(item => item.day === day);
    return `<div class="day-window"><label class="check"><input type="checkbox" name="day-${day}" ${w ? "checked" : ""}>${day}</label>${timeSelect("From", "start-"+day, w?.start || "13:00")}${timeSelect("Until", "end-"+day, w?.end || "17:00")}</div>`;
  }).join("");
  return `<fieldset class="schedule-editor"><legend>Your availability</legend>
    <p>Your availability is used for matching and stays out of your profile preview. Times are Eastern.</p>${value.scheduleAssumption ? '<p class="note">Demo availability for the pitch. Confirm your actual classes, training and travel before using it.</p>' : ""}
    ${select("Availability", "availabilityStatus", ["Add schedule later","Set weekly availability"], status)}
    <div id="athlete-schedule">
      ${select("Planning period", "period", ["Specific dates","Summer","Fall","Spring"], value.period || "Specific dates")}
      <div class="schedule-dates">${field("Start date", "startDate", value.startDate || "", "date", false)}${field("End date", "endDate", value.endDate || "", "date", false)}${select("Maximum hours per week", "hours", ["","5","10","15","20","25","30","35","40"], String(value.hours || ""))}${select("Work format preference", "format", ["Either","In person","Remote","Hybrid"], value.format || "Either")}</div>
      <div class="week-windows">${windows}</div>
    </div><p class="schedule-error" role="alert"></p>
  </fieldset>`;
}
function readSchedule(data, form, employer=false) {
  if (!employer && data.availabilityStatus === "Add schedule later") {
    return {windows:[],startDate:"",endDate:"",period:data.period || "Specific dates",hours:0,format:data.format || "Either",negotiable:false,availabilityStatus:"Add schedule later"};
  }
  const windows = days.filter(day=>data[`day-${day}`]).map(day=>({day,start:data[`start-${day}`],end:data[`end-${day}`]}));
  const error = (!!data.startDate !== !!data.endDate) ? "Enter both dates, or leave both blank." : data.startDate && data.endDate < data.startDate ? "End date must follow start date." : !(Number(data.hours)>0 && Number(data.hours)<=168) ? "Select weekly hours." : windows.some(w=>!w.start || !w.end || w.start>=w.end) ? "Each selected day needs an end time after its start time." : !windows.length && !data.negotiable ? "Select at least one day." : "";
  if (error) {
    const message = form.querySelector(".schedule-error");
    message.textContent = error;
    message.scrollIntoView({block:"center", behavior:"smooth"});
    return null;
  }
  form.querySelector(".schedule-error").textContent = "";
  for (const day of days) for (const prefix of ["day", "start", "end"]) delete data[`${prefix}-${day}`];
  return {windows, startDate:data.startDate, endDate:data.endDate, period:data.period, hours:Number(data.hours), format:data.format, negotiable:!!data.negotiable, ...(!employer && {availabilityStatus:"Set weekly availability"})};
}

function profile() {
  const catalog = SCHOOL_CATALOGS[state.school] || SCHOOL_CATALOGS["Campbell University"];
  return (
    `<section class="profile-preview panel"><div class="profile-cover"><span>CAMPBELL ASCEND</span><span>FIGHT AS ONE.</span></div><div class="profile-body"><div class="profile-avatar">${state.athlete.photo ? `<img src="${esc(state.athlete.photo)}" alt="${esc(state.athlete.name)} profile photo">` : `<span>${esc(state.athlete.name.split(" ").map(n=>n[0]).join(""))}</span>`}</div><span class="eyebrow">ATHLETE PROFILE</span><div class="athlete-identity"><div><h2>${esc(state.athlete.name)}</h2><p class="athlete-headline">${esc(state.athlete.headline || "Add a headline")}</p></div><button type="button" class="secondary" id="edit-profile" aria-expanded="${profileEditing}" aria-controls="profile-editor">Edit profile</button></div><p class="athlete-summary">${esc(state.school)} · ${esc(state.athlete.sport)} · ${esc(state.athlete.graduation || "Graduation to confirm")}</p><section class="athlete-profile-section"><h3>Career Interests</h3><div class="profile-tags">${selectedValues(state.athlete.interests).map(v=>`<span class="tag">${esc(v)}</span>`).join("")}</div></section><section class="athlete-profile-section"><h3>About</h3><p>${esc(state.athlete.about || "Add a short introduction.")}</p></section>${resumePanel(state)}<details class="athlete-more"><summary>Skills & Profile Details</summary><dl class="athlete-facts"><div><dt>University</dt><dd>${esc(state.school)}</dd></div><div><dt>Sport</dt><dd>${esc(state.athlete.sport)}</dd></div><div><dt>Major</dt><dd>${esc(state.athlete.major)}</dd></div><div><dt>Graduation</dt><dd>${esc(state.athlete.graduation || "To confirm")}</dd></div><div><dt>Preferred location</dt><dd>${esc(state.athlete.location)}</dd></div></dl><section class="athlete-profile-section"><h3>Skills</h3><div class="profile-tags">${selectedValues(state.athlete.skills).map(v=>`<span class="tag">${esc(v)}</span>`).join("")}</div></section></details></div></section>
    <section id="profile-editor" class="profile-editor" ${profileEditing ? '' : 'hidden'}>
    <form id="profile-form" class="panel form-grid" novalidate>
      <h2 class="wide-field">Edit profile</h2>
      ${field("Full name", "name", state.athlete.name)}
      ${select("Expected graduation", "graduation", GRADUATION_OPTIONS, state.athlete.graduation || "Not sure yet")}
      <label class="wide-field">Profile photo<input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp"><small>Choose a JPG, PNG, or WebP up to 5 MB. Photo stays in this demo.</small><span id="photo-status" role="status"></span></label>
      <button type="button" class="secondary" id="remove-photo">Remove photo</button>
      ${select("University", "school", Object.keys(SCHOOL_CATALOGS), state.school)}
      ${select("Sport", "sport", catalog.sports, state.athlete.sport)}
      ${select("Academic year", "year", ["Freshman","Sophomore","Junior","Senior","Graduate"], state.athlete.year)}
      ${select("Major", "major", catalog.majors, state.athlete.major)}
      ${select("Preferred location", "location", LOCATION_OPTIONS, state.athlete.location)}
      ${field("Headline", "headline", state.athlete.headline || "")}
      ${textArea("About", "about", state.athlete.about || "", 1000)}
      ${multiSelect("Career interests", "interests", CAREER_INTERESTS, state.athlete.interests)}
      ${multiSelect("Skills", "skills", SKILL_OPTIONS, state.athlete.skills)}
      ${scheduleFields(state.athlete, false)}
      <p class="muted">Choose skills you can discuss confidently. Interests guide exploration; this is not a validated career assessment. Profile data stays in this browser.</p><p class="profile-error" role="alert" tabindex="-1"></p><div class="wide-field profile-edit-actions"><button type="submit" class="primary">Save profile</button><button type="button" class="secondary" id="cancel-profile-edit">Cancel</button></div>
    </form></section>`
  );
}
function myOpportunities() {
  let as = state.applications.filter(a => state.opportunities.some(o => o.id === a.opportunity));
  return (
    heading(
      "KEEP MOVING",
      "My Opportunities",
      "Your saved possibilities, activity, and next steps in one place.",
    ) +
    `<h2>Registrations & applications</h2>${
      as.length
        ? as
            .map((a) => {
              let o = state.opportunities.find((o) => o.id === a.opportunity);
              return `<div class="panel activity"><div><span class="tag">${esc(/Shadowing|Company visit|Externship/.test(o.type) ? "Interest Registered · Demo" : "Application Submitted · Demo")}</span><h3>${esc(o.title)}</h3><p>${esc(o.company)}${[7, 8].includes(o.id) ? "" : (o.concept ? " · Concept" : " · Illustrative Example")}</p><p class="muted">Demo only. Nothing was sent to the host.</p>${a.attended ? '<span class="tag">Attendance recorded (sample)</span>' : ""}</div><button class="secondary" data-details="${o.id}">View opportunity</button></div>`;
            })
            .join("")
        : '<div class="empty">Save an opportunity or register interest to keep it here.</div>'
    }<h2>Saved for later</h2><div class="cards">${
      state.opportunities
        .filter((o) => state.saved.includes(o.id) && o.approved)
        .map(card)
        .join("") ||
      '<div class="empty">Save an opportunity with the star to revisit it here.</div>'
    }</div>`
  );
}
function alumniCard(editable=false) {
  const a=state.alumni;
  if (!a.name) return '<div class="panel"><h2>Create your alumni profile</h2><p>Your education describes your background, not who you can support.</p></div>';
  return `<article class="panel alumni-card"><span class="eyebrow">ALUMNI PROFILE</span><h2>${esc(a.name)}</h2><strong>${esc(a.headline)}</strong><p>${esc(a.title)} · ${esc(a.company)}</p><p>${esc(a.school)} · ${esc(a.graduation)} · ${esc(a.athleteStatus)}${a.athleteStatus === "Former student-athlete" ? " · "+esc(a.sport) : ""}</p><p>${esc(a.major)} · ${esc(a.location)} · ${esc(a.format)}</p><h3>About</h3><p>${esc(a.about)}</p><h3>Ways I can help</h3><div class="profile-tags">${selectedValues(a.support).map(v=>`<span class="tag">${esc(v)}</span>`).join("")}</div><p>${esc(a.contactPreference)}</p><small>Demo profile. Introductions are not sent.</small>${!editable ? `<button class="secondary" data-reminder="${esc(a.name)}">Plan a conversation</button>` : ""}</article>`;
}
function alumniProfile() {
 const a=state.alumni, catalog=SCHOOL_CATALOGS[a.school] || SCHOOL_CATALOGS["Campbell University"];
 return heading("GIVE BACK. OPEN DOORS.","Alumni profile","Help athletes understand your background and the support you can offer.")+alumniCard(true)+`<form id="alumni-form" class="panel form-grid">
 ${field("Full name","name",a.name)}${field("Headline","headline",a.headline)}
 ${select("University","school",Object.keys(SCHOOL_CATALOGS),a.school)}${select("Graduation","graduation",ALUMNI_GRADUATIONS,a.graduation)}
 ${select("Athletics background","athleteStatus",["Former student-athlete","Alumnus / alumna (not a former athlete)"],a.athleteStatus)}${select("Former sport","sport",["Not applicable",...catalog.sports],a.sport)}
 ${select("Major","major",catalog.majors,a.major)}${field("Organization","company",a.company)}${field("Job title","title",a.title)}
 ${select("Career field","industry",CAREER_INTERESTS,a.industry)}${select("Location","location",LOCATION_OPTIONS,a.location)}${select("Preferred meeting format","format",["Video","Phone","In person","Flexible"],a.format)}
 ${textArea("About","about",a.about,1000)}${multiSelect("Ways I can help","support",ALUMNI_SUPPORT,a.support)}
 ${select("Preferred introduction","contactPreference",["Introduction through ASCEND","University staff introduction"],a.contactPreference)}
 <label class="check"><input type="checkbox" name="visible" ${a.visible ? "checked" : ""}>Show my profile in the demo athlete connections directory</label><button class="primary">Save alumni profile</button></form>`;
}
function alumniConnections() {
 return heading("STUDENT CONNECTIONS","Support the next chapter","Preview the athlete you could support. Real messaging and verified introductions are future features.")+`<article class="panel"><span class="eyebrow">DEMO ATHLETE</span><h2>${esc(state.athlete.name)}</h2><strong>${esc(state.athlete.headline)}</strong><p>${esc(state.athlete.sport)} · ${esc(state.athlete.major)}</p><p>${esc(state.athlete.about)}</p><h3>Career interests</h3><p>${esc(state.athlete.interests)}</p></article><form id="alumni-note-form" class="panel form-grid">${textArea("Private preparation note","note",state.alumniNote || "",1000)}<button class="primary">Save preparation note</button><p>This preparation note stays in your browser.</p></form>`;
}
function connections() {
 return heading("CONNECTIONS", "People Ready to Help You Move Forward", "Connect with professionals and alumni open to sharing their experience, answering questions, and preparing you for your next step.") + connectionPage(state);
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
    `<form id="create-form" class="panel form-grid">${field("Opportunity title", "title")}${select("Industry", "industry", CAREER_INTERESTS)}${select("Experience type", "type", ["Shadowing", "Company visit", "Externship", "Internship", "Fellowship", "Job"])}${field("Location", "location", state.athlete.location)}${select("Time commitment", "time", ["Half day", "2 hours", "1 week", "5 hours/week", "10 hours/week", "Full time"])}${field("Schedule / timing", "schedule")}${scheduleFields({}, true)}${field("Compensation (state unpaid if applicable)", "compensation")}${field("Capacity", "capacity", 5, "number")}${field("Named host", "host", state.company.host)}${field("Description", "description")}${field("Learning goals", "goals")}${field("Eligibility / requirements", "requirements")}${field("Application or registration process", "process", "Register interest for host review.")}${select("Eligibility scope", "restricted", ["Participating school athletes", "Open eligibility"])}${select("Listing category", "category", ["Sample ASCEND partner experience", "Other sample internship or job"])}<button class="primary">Submit for staff approval</button></form>`
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
          return `<form class="panel participant form-grid" data-participant="${a.id}"><div><h3>${esc(state.athlete.name)}</h3><p>${esc(o.title)}</p><p>${esc(state.athlete.sport)} · ${esc(state.athlete.year)} · ${esc(state.athlete.major)}</p><p>Interests: ${esc(state.athlete.interests)}<br>Skills: ${esc(state.athlete.skills)}<br>Availability: ${esc(scheduleSummary(state.athlete))} · ${esc(state.athlete.location)}</p></div>${select("Participation status", "status", statuses, a.status)}${field("Next step / scheduling / follow-up (simulated)", "next", a.next)}<label class="check"><input type="checkbox" name="attended" ${a.attended ? "checked" : ""}> Attendance recorded (sample)</label><button class="primary">Save participation update</button></form>`;
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
  document.querySelectorAll('[data-build-profile]').forEach(b=>b.onclick=()=>{page='My Profile';profileEditing=false;render();window.scrollTo(0,0);});
  document.querySelectorAll('[data-direction]').forEach(b=>b.onclick=()=>{page='Find your direction';render();window.scrollTo(0,0);});
  document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>{if(b.dataset.guide==='experience'){page='Explore Opportunities';render();document.querySelector('#opportunity-board')?.scrollIntoView();}else{setConnectionDiscovery({explore:true});page='Connections';render();window.scrollTo(0,0);}});
  const guidance=document.querySelector('#guidance-form');if(guidance)guidance.onsubmit=e=>{e.preventDefault();setConnectionDiscovery({field:new FormData(guidance).get('field')});page='Connections';render();window.scrollTo(0,0);};

  const editProfile=document.querySelector('#edit-profile');
  if (editProfile) editProfile.onclick=()=>{
    profileEditing=true;
    document.querySelector('#profile-editor').hidden=false;
    editProfile.setAttribute('aria-expanded','true');
    document.querySelector('#profile-form [name="name"]').focus();
    document.querySelector('#profile-editor').scrollIntoView({block:'start',behavior:'smooth'});
  };
  const cancelProfile=document.querySelector('#cancel-profile-edit');
  if (cancelProfile) cancelProfile.onclick=()=>{
    profileEditing=false; pendingPhoto=undefined; render();
    document.querySelector('#edit-profile').focus();
    document.querySelector('.profile-preview').scrollIntoView({block:'start',behavior:'smooth'});
  };
  bindConnections(state, persist, render, notify);
  bindResume(state, persist, notify);
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
        selected = null;
        if(page === "Connections") setConnectionDiscovery();
        profileEditing = false; pendingPhoto = undefined;
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
          page = "Explore Opportunities";
          render();
          window.scrollTo(0, 0);
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
          window.scrollTo(0, 0);
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
            status: "Interest Registered · Demo",
            next: "Demo only. No request was sent and no place is reserved.",
            attended: false,
          });
          persist();
        }
        selected = null;
        page = "My Opportunities";
        notify("Interest registered in this demo. Nothing was sent to the host.");
        window.scrollTo(0, 0);
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
  const scheduleStatus = document.querySelector('#profile-form [name="availabilityStatus"]');
  if (scheduleStatus) {
    const updateSchedule = () => {
      const enabled = scheduleStatus.value === "Set weekly availability";
      const section = document.querySelector("#athlete-schedule");
      section.hidden = !enabled;
      section.querySelectorAll("input,select").forEach(control => control.disabled = !enabled);
      section.querySelectorAll('.day-window').forEach(row => {
        const day = row.querySelector('input[type="checkbox"]');
        const updateDay = () => row.querySelectorAll('select,input[type="time"]').forEach(control => control.disabled = !enabled || !day.checked);
        day.onchange = updateDay; updateDay();
      });
    };
    scheduleStatus.onchange = updateSchedule;
    updateSchedule();
  }
  const schoolChoice = document.querySelector('#profile-form [name="school"]');
  if (schoolChoice) schoolChoice.onchange = () => {
    const catalog = SCHOOL_CATALOGS[schoolChoice.value];
    if (!catalog) return;
    for (const [name, values] of [["sport",catalog.sports],["major",catalog.majors]]) {
      const control = document.querySelector(`#profile-form [name="${name}"]`);
      const old = control.value;
      control.innerHTML = option(values, values.includes(old) ? old : values[0]);
    }
  };
  const photoInput = document.querySelector('#profile-photo');
  if (photoInput) photoInput.onchange = async () => {
    const file = photoInput.files[0]; if (!file) return;
    const status = document.querySelector('#photo-status');
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5*1024*1024) { status.textContent = "Choose a JPG, PNG, or WebP smaller than 5 MB."; return; }
    status.textContent = "Preparing photo…";
    const save = document.querySelector('#profile-form button[type="submit"]'); save.disabled = true;
    const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url; await img.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 400;
      const size = Math.min(img.width,img.height);
      canvas.getContext('2d').drawImage(img,(img.width-size)/2,(img.height-size)/2,size,size,0,0,400,400);
      pendingPhoto = canvas.toDataURL('image/jpeg',0.82);
      document.querySelector('.profile-avatar').innerHTML = `<img src="${pendingPhoto}" alt="Selected profile photo preview">`;
      status.textContent = "Photo ready. Click Save profile to keep it.";
    } catch { status.textContent = "Could not read that photo. Try another image."; }
    finally { URL.revokeObjectURL(url); save.disabled = false; }
  };
  const removePhoto = document.querySelector('#remove-photo');
  if (removePhoto) removePhoto.onclick = () => { pendingPhoto = ''; document.querySelector('.profile-avatar').textContent = state.athlete.name.split(' ').map(n=>n[0]).join(''); document.querySelector('#photo-status').textContent = 'Photo removed. Click Save profile to keep this change.'; };
  document.querySelectorAll('.multi-select input[type="checkbox"]').forEach(input => input.onchange = () => {
    const container=input.closest('.multi-select'); const chosen=[...container.querySelectorAll('input:checked')].map(i=>i.value);
    container.querySelector('summary').textContent=chosen.length ? chosen.join(', ') : 'Choose one or more';
  });
  form("profile-form", (d, f) => {
    const error = f.querySelector('.profile-error');
    if (!d.name.trim() || !d.headline.trim()) { error.textContent = "Add your name and headline before saving."; error.focus(); return; }
    const scheduling = readSchedule(d, f);
    if (!scheduling) return;
    const values = new FormData(f);
    d.interests = values.getAll("interests").join(", ");
    d.skills = values.getAll("skills").join(", ");
    f.querySelector('.profile-error').textContent = "";
    const nextSchool = d.school;
    delete d.school;
    const athlete = { ...state.athlete, ...d, ...scheduling, photo: pendingPhoto === undefined ? state.athlete.photo || "" : pendingPhoto, photoRemoved: pendingPhoto === "" ? true : pendingPhoto ? false : state.athlete.photoRemoved, scheduleAssumption:state.athlete.scheduleAssumption && JSON.stringify(scheduling.windows) === JSON.stringify(state.athlete.windows) && scheduling.startDate === state.athlete.startDate && scheduling.endDate === state.athlete.endDate, availability: scheduling.windows.length ? "See stated schedule" : "Availability to confirm" };
    state.school = nextSchool;
    state.athlete = athlete;
    state.profileCreated = true;
    profileEditing = false;
    pendingPhoto = undefined;
    const saved = persist();
    notify(saved ? "Profile saved in this browser. Matches updated." : "Profile updated for this session. Browser storage is blocked; edits will not survive closing this page.");
    document.querySelector('.profile-preview').scrollIntoView({block:"start"});
  });
  form("alumni-form", (d,f) => {
    d.support = new FormData(f).getAll('support').join(', '); d.visible = !!d.visible;
    if(d.athleteStatus !== "Former student-athlete") d.sport = "Not applicable";
    state.alumni = d; const saved=persist(); notify(saved ? "Alumni profile saved. Athlete connections updated." : "Alumni profile updated for this session only.");
  });
  const alumniBackground=document.querySelector('#alumni-form [name="athleteStatus"]');
  if(alumniBackground){ const update=()=>{ const sport=document.querySelector('#alumni-form [name="sport"]'); sport.disabled=alumniBackground.value !== 'Former student-athlete'; }; alumniBackground.onchange=update; update(); }
  form("alumni-note-form",d=>{state.alumniNote=d.note;persist();notify('Preparation note saved in the demo.');});
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
    const scheduling = readSchedule(d, f, true);
    if (!scheduling) return;
    state.opportunities.push({
      ...d,
      ...scheduling,
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


window.addEventListener("ascend:open-opportunity", (event) => {
  const id = Number(event.detail);
  if (!state.opportunities.some(o => o.id === id)) return;
  page = "Explore Opportunities"; selected = id; render();
  document.querySelector(".modal")?.focus();
});
