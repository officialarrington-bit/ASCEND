import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("branding, section categories, employer entry, and opportunity jump", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "BUILD WHAT",
  );
  await expect(page.locator(".program-brand")).toContainText("Campbell");
  await page
    .getByRole("button", { name: "Explore Opportunities", exact: true })
    .click();
  await expect(page.locator("#opportunity-board")).toBeFocused();
  await expect(
    page
      .getByRole("region", { name: "Sample ASCEND partner experiences" })
      .locator(".card"),
  ).toHaveCount(4);
  await expect(
    page
      .getByRole("region", { name: "Other sample internships and jobs" })
      .locator(".card"),
  ).toHaveCount(2);
  await page.getByLabel("Fits my stated availability").check();
  await expect(page.locator(".card")).toHaveCount(0);
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".card")).toHaveCount(6);
  await page
    .getByRole("button", { name: "For Employers", exact: true })
    .click();
  await expect(page.locator("#role")).toHaveValue("Employer");
});
test("school identity and contact changes appear across roles and persist", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#role").selectOption("University staff");
  await page
    .getByRole("button", { name: "School settings", exact: true })
    .click();
  await page
    .getByLabel("School name", { exact: true })
    .fill("Example University");
  await page.getByLabel("Program school name").fill("Example");
  await page
    .getByLabel("Program contact name / status")
    .fill("Demo program office");
  await page.getByRole("button", { name: "Save school settings" }).click();
  await page.locator("#role").selectOption("Student-athlete");
  await expect(page.locator(".program-brand")).toContainText("Example");
  await expect(page.locator("footer")).toContainText("Demo program office");
  await expect(page.locator(".card").first()).toContainText(
    "Example University athletes",
  );
  await page.reload();
  await expect(page.locator(".program-brand")).toContainText("Example");
});
test("keyboard modal focus containment and return", async ({ page }) => {
  await page.goto("/");
  const button = page.getByRole("button", { name: "View details" }).first();
  await button.click();
  const modal = page.getByRole("dialog");
  await expect(modal).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    modal.getByRole("button", {
      name: "Register interest (simulated)",
      exact: true,
    }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close details" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", {
      name: "A day in financial strategy",
      exact: true,
    }),
  ).toBeFocused();
});
test("desktop and mobile accessibility across all role pages", async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    for (const [role, navs] of [
      [
        "Student-athlete",
        [
          "Explore opportunities",
          "My opportunities",
          "Connections",
          "My profile",
        ],
      ],
      ["Employer", ["Overview", "Create opportunity", "Company profile"]],
      ["University staff", ["Participation", "Approvals", "School settings"]],
    ]) {
      await page.locator("#role").selectOption(role);
      for (const name of navs) {
        await page.getByRole("button", { name, exact: true }).first().click();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${width} ${role} ${name} overflow`,
        ).toBe(true);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations,
          `${width} ${role} ${name}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
        ).toEqual([]);
      }
    }
  }
});

