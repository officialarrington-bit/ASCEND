// Program identity lives here so another school can configure its own concept.
// Do not describe the retained demo orange as verified Campbell branding.
export const defaultTheme = {
  school: "Campbell University",
  shortName: "Campbell",
  platform: "ASCEND",
  colors: { accent: "#b8502b", black: "#000000", white: "#ffffff" },
  brandStatus:
    "Official Campbell color verification pending; original demo accent retained.",
  conceptLabel:
    "Student-built concept for the Presidential Innovation Challenge",
  imagery: null, // Add only an approved { src, alt, credit, sourceUrl, license } asset.
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
