import { test, expect } from '@playwright/test';
import { MultiSelectPage } from '../pages/MultiSelectPage';

test('TC012 - select, deselect, filter, and clear choices', async ({ page }) => {
  const ms = new MultiSelectPage(page);

  await test.step('Step 1: native multi-select visible, nothing selected', async () => {
    await ms.open();
    await expect(ms.multiSelect.locator('option')).toHaveText(['Playwright', 'Cypress', 'Selenium', 'WebdriverIO']);
    await expect(ms.multiSelect).toHaveValues([]);
  });

  await test.step('Step 2: select one option', async () => {
    await ms.selectMulti(['playwright'], 'Playwright selected');
    await expect(ms.multiSelect).toHaveValues(['playwright']);
  });

  await test.step('Step 3: add a second option, first stays selected', async () => {
    await ms.selectMulti(['playwright', 'selenium'], 'Playwright, Selenium selected');
    await expect(ms.multiSelect).toHaveValues(['playwright', 'selenium']);
  });

  await test.step('Step 4: deselect one option, others remain', async () => {
    await ms.preselectAllButton.click();
    await expect(ms.deselectSelect).toHaveValues(['playwright', 'cypress', 'selenium', 'webdriverio']);
    await ms.deselectSelect.selectOption(['playwright', 'selenium', 'webdriverio']);
    await expect(ms.deselectSelect).toHaveValues(['playwright', 'selenium', 'webdriverio']);
    await expect(ms.deselectResult).toHaveText('Remaining selected: Playwright, Selenium, WebdriverIO');
  });

  await test.step('Step 5: custom checkbox multi-select, count matches', async () => {
    await ms.customTrigger.click();
    await ms.option(ms.customScenario, 'react').click();
    await ms.option(ms.customScenario, 'svelte').click();
    await expect(ms.selectedOptions(ms.customScenario)).toHaveCount(2);
    await expect(ms.customTrigger).toContainText('2 selected');
    await expect(ms.customResult).toHaveText('React, Svelte selected');
    await ms.customTrigger.click(); // close panel, it covers S05 below
  });

  await test.step('Step 6: Clear All resets count and options', async () => {
    await ms.bulkTrigger.click();
    await ms.option(ms.bulkScenario, 'vue').click();
    await ms.option(ms.bulkScenario, 'angular').click();
    await expect(ms.bulkTrigger).toContainText('2 selected');
    await ms.clearAllButton.click();
    await expect(ms.selectedOptions(ms.bulkScenario)).toHaveCount(0);
    await expect(ms.bulkTrigger).toContainText('Select frameworks');
    await expect(ms.bulkResult).toHaveText('Cleared — nothing selected');
  });
});