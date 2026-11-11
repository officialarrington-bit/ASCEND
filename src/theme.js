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
  imagery: { src:"/images/kamden-sixkiller-2026.webp", alt:"Campbell quarterback Kamden Sixkiller preparing to throw", credit:"Photo: Campbell Athletics / GoCamels", license:"Challenge demo", sourceUrl:"https://gocamels.com/news/2026/9/3/football-sixkiller-a-sooners-journey-to-the-creek.aspx" },
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

