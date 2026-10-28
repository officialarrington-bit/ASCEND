import { test, expect } from "@playwright/test";
const role = async (p, r) => p.locator("#role").selectOption(r);
const nav = async (p, n) =>
  p.getByRole("button", { name: n, exact: true }).first().click();
test("complete athlete to employer and staff journey persists", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await nav(page, "My profile");
  await page.getByLabel("Full name", { exact: true }).fill("Riley Demo");
  await page.getByLabel("Career interests").fill("Finance");
  await page.getByRole("button", { name: "Save profile" }).click();
  await nav(page, "Explore opportunities");
  await page.getByLabel("Search opportunities").fill("financial");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".match")).toContainText("finance interest");
  await page
    .getByRole("button", {
      name: "Save A day in financial strategy",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "View details" }).click();
  await page
    .getByRole("button", { name: "Register interest (simulated)", exact: true })
    .click();
  await role(page, "Employer");
  await expect(page.locator(".participant")).toContainText("Riley Demo");
  await page.getByLabel("Participation status").selectOption("Registered");
  await page
    .getByLabel("Next step / scheduling")
    .fill("Meet Morgan at reception November 12 at 9 AM.");
  await page.getByRole("button", { name: "Save participation update" }).click();
  await role(page, "University staff");
  await expect(page.locator(".participant")).toContainText("Riley Demo");
  await expect(page.getByLabel("Participation status")).toHaveValue(
    "Registered",
  );
  await page.getByLabel("Attendance recorded").check();
  await page.getByRole("button", { name: "Save participation update" }).click();
  await role(page, "Student-athlete");
  await nav(page, "My opportunities");
  await expect(page.locator("main")).toContainText(
    "Meet Morgan at reception November 12 at 9 AM.",
  );
  await expect(page.locator("main")).toContainText("Attendance recorded");
  await page.reload();
  await nav(page, "My opportunities");
  await expect(page.locator("main")).toContainText("Meet Morgan");
  expect(errors).toEqual([]);
});
test("employer creation requires approval before discovery", async ({
  page,
}) => {
  await page.goto("/");
  await role(page, "Employer");
  await nav(page, "Create opportunity");
  for (const [name, value] of [
    ["Opportunity title", "Finance discovery workshop"],
    ["Schedule / timing", "Fridays, flexible"],
    ["Compensation", "Unpaid"],
    ["Description", "Explore finance with a fictional team."],
    ["Learning goals", "Learn financial analysis"],
    ["Eligibility / requirements", "All majors welcome"],
  ])
    await page.getByLabel(name, { exact: false }).fill(value);
  await page.getByRole("button", { name: "Submit for staff approval" }).click();
  await expect(page.locator("main")).toContainText("Awaiting staff approval");
  await role(page, "Student-athlete");
  await page.getByLabel("Search opportunities").fill("Finance discovery");
  await expect(page.locator(".card")).toHaveCount(0);
  await role(page, "University staff");
  await nav(page, "Approvals");
  await page
    .getByRole("button", { name: "Approve opportunity", exact: true })
    .click();
  await role(page, "Student-athlete");
  await expect(page.locator(".card")).toHaveCount(1);
  await expect(page.locator(".card")).toContainText(
    "Finance discovery workshop",
  );
});
test("mobile navigation, filters, dialog keyboard, reminders and reset", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByLabel("Filter by industry").selectOption("Technology");
  await expect(page.locator(".card")).toHaveCount(1);
  await page.getByRole("button", { name: "View details" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await nav(page, "Connections");
  await page
    .getByRole("button", { name: "Set follow-up reminder" })
    .first()
    .click();
  await page.getByLabel("Follow-up date").fill("2026-11-15");
  await page
    .getByLabel("Follow-up note")
    .fill("Thank Morgan for the conversation");
  await page.getByRole("button", { name: "Save local reminder" }).click();
  await expect(page.locator("main")).toContainText("Thank Morgan");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.locator("main")).not.toContainText("Thank Morgan");
});
