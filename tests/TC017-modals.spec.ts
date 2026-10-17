import { test, expect } from '@playwright/test';
import { ModalsPage } from '../pages/ModalsPage';

test('TC017 - open, close, and scope modal windows', async ({ page }) => {
  const modals = new ModalsPage(page);

  await test.step('Step 1: trigger visible, simple modal absent', async () => {
    await modals.open();
    await expect(modals.openSimpleButton).toBeVisible();
    await expect(modals.simpleModal).toHaveCount(0);
    await expect(modals.simpleResult).toHaveText('Not opened yet');
  });

  await test.step('Step 2: open simple modal, heading matches', async () => {
    // first click can land before React hydrates, so retry until the modal shows
    await expect(async () => {
      if (!(await modals.simpleModal.count())) await modals.openSimpleButton.click();
      await expect(modals.simpleModal).toBeVisible({ timeout: 1000 });
    }).toPass();
    await expect(modals.simpleModal.getByRole('heading')).toHaveText('Simple Modal');
    await expect(modals.simpleResult).toHaveText('Opened');
  });

  await test.step('Step 3: Close hides modal, result updates', async () => {
    await modals.closeSimpleButton.click();
    await expect(modals.simpleModal).toHaveCount(0);
    await expect(modals.simpleResult).toHaveText('Closed');
  });

  await test.step('Step 4: scope Details to the Advanced Locators card', async () => {
    await expect(modals.courseCards).toHaveCount(2);
    await expect(modals.detailsButton('Advanced Locators')).toHaveCount(1);
  });

  await test.step('Step 5: Details opens that card\'s modal', async () => {
    await modals.detailsButton('Advanced Locators').click();
    await expect(modals.courseModal.getByRole('heading')).toHaveText('Advanced Locators');
    await expect(modals.courseResult).toHaveText('Opened Advanced Course');
    await modals.closeCourseButton.click();
    await expect(modals.courseModal).toHaveCount(0);
  });

  await test.step('Step 6: backdrop click closes modal, page usable again', async () => {
    await modals.openSimpleButton.click();
    await expect(modals.simpleModal).toBeVisible();
    await modals.clickBackdrop(modals.simpleModal);
    await expect(modals.simpleModal).toHaveCount(0);
    await modals.openSimpleButton.click({ trial: true }); // overlay no longer intercepts clicks
  });
});
