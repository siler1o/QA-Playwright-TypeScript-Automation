import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { TabsWindowsPage } from '../pages/TabsWindowsPage';

test('TC010 - popup capture and page switching', async ({ page, context }) => {
  const tabs = new TabsWindowsPage(page);
  let originalUrl: string;
  let baselineTabs: number;
  let newTab: Page;

  await test.step('Step 1: record original URL and tab count', async () => {
    await tabs.open();
    await expect(page).toHaveURL(/\/practice\/tabs-windows$/);
    originalUrl = page.url();
    baselineTabs = context.pages().length;
    expect(baselineTabs).toBe(1);
  });

  await test.step('Step 2: capture new page while opening tab link', async () => {
    newTab = await tabs.openNewTab();
    expect(context.pages()).toHaveLength(baselineTabs + 1);
  });

  await test.step('Step 3: new tab reaches the link href', async () => {
    const href = (await tabs.openNewTabLink.getAttribute('href'))!;
    await newTab.waitForLoadState('domcontentloaded');
    await expect(newTab).toHaveURL(new URL(href, originalUrl).href);
  });

  await test.step('Step 4: switch back, original tab unchanged and usable', async () => {
    await page.bringToFront();
    await expect(page).toHaveURL(originalUrl);
    await expect(tabs.switchResult).toHaveText('New tab opened — now switch back to this tab');
    await tabs.markReturnedButton.click();
    await expect(tabs.switchResult).toHaveText('Switched back to original tab ✓');
  });

  await test.step('Step 5: close new tab, count back to baseline', async () => {
    await newTab.close();
    expect(newTab.isClosed()).toBe(true);
    expect(context.pages()).toHaveLength(baselineTabs);
  });
});