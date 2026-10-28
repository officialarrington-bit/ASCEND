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
  imagery: { src:"/images/campbell-basketball-2016.jpg", alt:"Campbell basketball player Chris Clemons during a 2016 game", credit:"2016 archival photo: SneakinDeacon / Wikimedia Commons", license:"CC BY-SA 2.0", sourceUrl:"https://commons.wikimedia.org/wiki/File:Chris_Clemons_(basketball).jpg" }, // Licensed campus photograph; attribution is rendered next to it.
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

