# Campbell ASCEND redesign — sources and approval status

## Identity and branding

This is an original, student-built concept for the Presidential Innovation Challenge. “Campbell ASCEND” is plain text, not an official university mark. ASCEND remains identified as the underlying platform. No official logos, supplied partner marks, testimonials, verified placement outcomes, or adoption claims are included.

**Official color verification remains blocked.** On October 28, 2026, read-only requests to all four supplied/intended reference destinations below returned proxy `403 Forbidden` responses. The redesign uses black (#000000), white (#ffffff), and the existing app's orange accent (#b8502b). That orange is retained from the earlier prototype, **not represented as Campbell's official orange**. Do not describe this as a completed official-brand implementation. Update the theme only after consulting an accessible current official guide or receiving an approved branding asset.

Intended official source for verification: https://brand.campbell.edu/visual-identity/color-palette/ . Its availability, contents, and current color values could not be verified here. The university's main site, https://www.campbell.edu/ , is also included in the saved network additions so the correct current brand guide can be located.

Reference URLs supplied in the brief:

- https://ohiostatebuckeyes.com/sports/2024/9/11/bucks-go-pro-2-0
- https://purduesports.com/student-athlete-internship-program
- https://gocamels.com/

Their page designs were not inspected because of the access block. No page copy, photos, layout assets, or marks were extracted or reused. The athletics direction comes from the user's brief: bold headings, a program masthead, restrained orange accents, clear navigation, and an opportunity-first workflow.

The environment draft now adds `brand.campbell.edu`, `www.campbell.edu`, `campbell.edu`, `gocamels.com`, `ohiostatebuckeyes.com`, and `purduesports.com`. Saving the draft does not enable these domains in this running instance or publish the configuration. Review and save the settings, then publish the environment; access and official branding must still be rechecked afterward.

## Imagery and permission inventory

No photography is bundled. No Campbell campus settings, student-athletes, events, stock models, employers, or relationships are depicted. No appropriate licensed or approved photographs were supplied or accessible for verification. Public website availability alone is not a reuse license.

The hero track-lane SVG and arrow are original geometric graphics authored in this project. They are decorative, carry no university marks, and do not represent an actual facility or event. No external image or font requests are required. On mobile the decorative hero graphic is omitted to keep the product accessible sooner.

For a photographic version, supply an approved image and documented permission/license. Ideally include campus, multiple men's and women's sports, and academic/professional preparation. Add each file's exact source, creator, license or written permission, allowed uses, credit, and any applicable model/property releases to this document. Then configure `imagery` in `src/theme.js` with `src`, accurate `alt`, `credit`, `sourceUrl`, and `license`. The hero supports cover cropping with a visible credit; actual cropping must be reviewed once an image is supplied. Never label generic stock subjects as Campbell athletes.

## Reusable school theme

`src/theme.js` owns default school name, short program name, platform name, palette, concept statement, optional imagery metadata, and program contact details. University staff → School settings can edit school/program names, accent, and contact text for the browser-local demo. The program name, athlete eligibility text, hero, and footer update across roles. Another school is not presented as a customer or partner.

Keep configuration non-sensitive. Real program contact details must be authorized before entry. Image URLs are rendered as images only; no raw HTML is used. Custom accent colors need a new contrast check before presentation. Optional imagery is trusted maintainer configuration, not a user upload system.

## Demonstration boundaries

“Sample ASCEND partner experiences” illustrates a proposed relationship model, not existing partners. Category and athlete eligibility are separate: partner-style listings can have open eligibility, and other listings are not automatically exclusive. New employer listings explicitly choose a category, then await human staff approval. Short experiences use an orange card rule; internships, fellowships, and jobs use a black rule, reinforced by textual type labels.

All profiles, employers, listings, activity, compensation, registrations, and placements remain fictional. No university endorsement, partnership, identity verification, or job guarantee is implied. No real messages or reminders are sent. State remains in local browser storage. Existing saved browser data is preserved; original sample listings are assigned display categories without resetting the demo.

## Validation

The original athlete → employer → staff → athlete journey, creation/approval flow, persistence, filters, saving, reminders, and reset remain covered. Added checks exercise the hero actions, category separation, availability filtering, school theme persistence, modal keyboard focus containment/return, all role navigation layouts at 1440/390/320px, and automated WCAG A/AA checks including contrast on all ten role pages at those widths. Automated checks supplement manual screenshot inspection; they do not establish comprehensive accessibility compliance. No image-cropping check can be claimed without a photograph.
