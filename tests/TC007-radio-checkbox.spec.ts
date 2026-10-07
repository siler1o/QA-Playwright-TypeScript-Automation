import { test, expect } from '@playwright/test';
import { RadioCheckboxPage } from '../pages/RadioCheckboxPage';

test('TC007 - checked, exclusive, and disabled states', async ({ page }) => {
  const rc = new RadioCheckboxPage(page);

  await test.step('Step 1: terms checkbox starts unchecked', async () => {
    await rc.open();
    await expect(rc.termsCheckbox).not.toBeChecked();
    await expect(rc.termsResult).toHaveText('Not checked');
  });

  await test.step('Step 2: check it, state becomes checked', async () => {
    await rc.termsCheckbox.check();
    await expect(rc.termsCheckbox).toBeChecked();
    await expect(rc.termsResult).toHaveText('Checked ✓');
  });

  await test.step('Step 3: uncheck it, state becomes unchecked', async () => {
    await rc.termsCheckbox.uncheck();
    await expect(rc.termsCheckbox).not.toBeChecked();
    await expect(rc.termsResult).toHaveText('Unchecked');
  });

  await test.step('Step 4: select first plan option', async () => {
    await expect(rc.planGroup.getByRole('radio')).toHaveCount(3);
    await expect(rc.planResult).toHaveText('No option selected');
    await rc.starterRadio.check();
    await expect(rc.starterRadio).toBeChecked();
    await expect(rc.planResult).toHaveText('Selected: Starter');
  });

  await test.step('Step 5: second option replaces first', async () => {
    await rc.proRadio.check();
    await expect(rc.proRadio).toBeChecked();
    await expect(rc.starterRadio).not.toBeChecked();
    await expect(rc.businessRadio).not.toBeChecked();
    await expect(rc.planResult).toHaveText('Selected: Pro');
  });

  await test.step('Step 6: disabled checkbox is locked and unchanged', async () => {
    await expect(rc.disabledCheckbox).toBeDisabled();
    await expect(rc.disabledCheckbox).not.toBeChecked();
    await expect(rc.disabledResult).toHaveText('Disabled state not tested');
  });
});