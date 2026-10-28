// Program identity lives here so another school can configure its own concept.
// Campbell primary HEX colors verified against its official brand guide.
export const defaultTheme = {
  school: "Campbell University",
  shortName: "Campbell",
  platform: "ASCEND",
  colors: { accent: "#f47725", black: "#1E252B", white: "#ffffff" },
  brandStatus:
    "Campbell primary HEX palette verified October 28, 2026.",
  conceptLabel:
    "Student-built concept for the Presidential Innovation Challenge",
  imagery: { src:"/images/campbell-campus.jpg", alt:"Panoramic view of Campbell University campus in Buies Creek", credit:"Photo: Stormsnsnow / Wikimedia Commons", license:"CC BY-SA 4.0", sourceUrl:"https://commons.wikimedia.org/wiki/File:CampbellUniversityStudentUnionPanorama.jpg" }, // Licensed campus photograph; attribution is rendered next to it.
  contacts: {
    label: "Program contact",
    name: "To be confirmed for a future pilot",
    email: "",
  },
};
export function resolveTheme(state) {
  const saved = state.theme || {};
  return {
    ...defaultTheme,
    ...saved,
    school: state.school,
    colors: { ...defaultTheme.colors, ...saved.colors },
    contacts: { ...defaultTheme.contacts, ...saved.contacts },
  };
}

