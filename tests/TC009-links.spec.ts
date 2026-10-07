import { test, expect } from '@playwright/test';
import { LinksPage } from '../pages/LinksPage';

test('TC009 - navigation, href, and tab behavior', async ({ page, context }) => {
  const links = new LinksPage(page);
  let internalHref: string;
  let externalHref: string;
  let startTabs: number;

  await test.step('Step 1: record internal href and current URL', async () => {
    await links.open();
    await expect(page).toHaveURL(/\/practice\/links$/);
    internalHref = await links.href(links.internalAboutLink);
    expect(internalHref).toBe('/about-us');
  });

  await test.step('Step 2: internal link opens href in same tab', async () => {
    await links.internalAboutLink.click();
    await expect(page).toHaveURL(new URL(internalHref, page.url()).href);
    expect(context.pages()).toHaveLength(1);
  });

  await test.step('Step 3: back on Links, record external href and tab count', async () => {
    await page.goBack();
    await expect(page).toHaveURL(/\/practice\/links$/);
    externalHref = await links.href(links.externalCourseLink);
    expect(externalHref).toMatch(/^https:\/\//);
    await expect(links.externalCourseLink).toHaveAttribute('target', '_blank');
    startTabs = context.pages().length;
  });

  await test.step('Step 4: external link opens one new tab, original stays', async () => {
    const popupPromise = page.waitForEvent('popup');
    await links.externalCourseLink.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL((url) => url.href.startsWith(externalHref));
    expect(context.pages()).toHaveLength(startTabs + 1);
    await expect(page).toHaveURL(/\/practice\/links$/);
    await popup.close();
  });

  await test.step('Step 5: broken link returns HTTP error', async () => {
    const brokenHref = await links.href(links.brokenSameTabLink);
    const response = await page.request.get(brokenHref);
    expect(response.ok()).toBe(false);
    expect(response.status()).toBe(500);
  });

  await test.step('Step 6: anchor link label and href match its target', async () => {
    await expect(links.anchorLink).toHaveText('Links Anchor Text — Test Cases TC09');
    await expect(links.anchorLink).toHaveAttribute('href', '#anchor-target');
    await expect(links.anchorTarget).toHaveAttribute('id', 'anchor-target');
  });
});