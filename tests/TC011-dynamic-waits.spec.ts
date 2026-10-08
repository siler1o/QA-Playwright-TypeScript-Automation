import { test, expect } from '@playwright/test';
import { DynamicWaitsPage } from '../pages/DynamicWaitsPage';

test('TC011 - wait for changing UI state without fixed sleeps', async ({ page }) => {
  const waits = new DynamicWaitsPage(page);

  await test.step('Step 1: trigger visible, delayed target absent', async () => {
    await waits.open();
    await expect(waits.delayedTrigger).toBeVisible();
    await expect(waits.delayedResult).toHaveCount(0);
  });

  await test.step('Step 2: trigger delay, target appears', async () => {
    await waits.triggerDelay();
    await expect(waits.delayedResult).toBeVisible({ timeout: 5000 });
  });

  await test.step('Step 3: spinner shows before content', async () => {
    await waits.spinnerTrigger.click();
    await expect(waits.spinner).toBeVisible();
    await expect(waits.spinnerContent).toHaveCount(0);
  });

  await test.step('Step 4: spinner hides, content shows', async () => {
    await expect(waits.spinner).toBeHidden({ timeout: 5000 });
    await expect(waits.spinnerContent).toHaveText('✅ Content loaded successfully');
  });

  await test.step('Step 5: toast shows expected message', async () => {
    await waits.toastTrigger.click();
    await expect(waits.toast).toContainText('✓ Success — action completed');
  });

  await test.step('Step 6: toast auto-dismisses within 4s', async () => {
    await expect(waits.toast).toBeHidden({ timeout: 4000 });
  });

  await test.step('Step 7: submit starts disabled, arm enables it', async () => {
    await expect(waits.submitButton).toBeDisabled();
    await waits.armButton.click();
    await expect(waits.submitButton).toBeEnabled({ timeout: 5000 });
  });

  await test.step('Step 8: click enabled submit', async () => {
    await waits.submitButton.click();
    await expect(waits.submitResult).toHaveText('Submit clicked after wait ✓');
  });
});