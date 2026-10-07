import { test, expect } from '@playwright/test';
import { AlertsDialogsPage } from '../pages/AlertsDialogsPage';

test('TC006 - dialog content, actions, and dismissal', async ({ page }) => {
  const alerts = new AlertsDialogsPage(page);

  await test.step('Step 1: open info dialog as accessible modal', async () => {
    await alerts.open();
    await alerts.openInfoButton.click();
    await expect(alerts.infoDialog).toBeVisible();
    await expect(alerts.infoDialog).toHaveAttribute('role', 'dialog');
    await expect(alerts.infoDialog).toHaveAttribute('aria-modal', 'true');
  });

  await test.step('Step 2: heading present, × closes dialog', async () => {
    await expect(alerts.infoDialog.getByRole('heading')).toHaveText('Session Notice');
    await alerts.infoCloseButton.click();
    await expect(alerts.infoDialog).toBeHidden();
    await expect(alerts.infoResult).toHaveText('Info dialog dismissed');
  });

  await test.step('Step 3: confirm dialog open, nothing confirmed yet', async () => {
    await alerts.openConfirmButton.click();
    await expect(alerts.confirmDialog).toBeVisible();
    await expect(alerts.confirmResult).toHaveText('Awaiting confirmation');
  });

  await test.step('Step 4: Confirm records submission and closes dialog', async () => {
    await alerts.confirmOkButton.click();
    await expect(alerts.confirmResult).toHaveText('Submission confirmed!');
    await expect(alerts.confirmDialog).toBeHidden();
  });

  await test.step('Step 5: Escape dismisses keyboard dialog', async () => {
    await alerts.openEscapeButton.click();
    await expect(alerts.escapeDialog).toBeVisible();
    await alerts.pressEscape();
    await expect(alerts.escapeDialog).toBeHidden();
    await expect(alerts.escapeResult).toHaveText('Dialog closed via Escape key');
  });

  await test.step('Step 6: click inside panel keeps overlay dialog open', async () => {
    await alerts.openBackdropButton.click();
    await alerts.backdropPanel.click();
    await expect(alerts.backdropDialog).toBeVisible();
    await expect(alerts.backdropResult).toHaveText('Dialog not opened');
  });

  await test.step('Step 7: backdrop click closes dialog, no modal left', async () => {
    await alerts.clickBackdrop();
    await expect(alerts.backdropDialog).toBeHidden();
    await expect(alerts.backdropResult).toHaveText('Dialog closed via backdrop');
    await expect(alerts.openModals).toHaveCount(0);
  });
});
