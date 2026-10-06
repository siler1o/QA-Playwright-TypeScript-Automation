import { test, expect } from '@playwright/test';
import { FormsPage } from '../pages/FormsPage';

test('TC003 - forms valid submission and validation', async ({ page }) => {
  const forms = new FormsPage(page);

  const firstName = 'Reuben';
  const lastName = 'Silerio';
  const phone = '9876543210';
  const dob = '1995-06-15';

  await test.step('Steps 1-4: fill F02 and choose Male', async () => {
    await forms.open();
    await forms.assertPersonalFormVisible();

    await forms.fillPersonalDetails(firstName, lastName, phone, dob);
    await forms.assertPersonalValues(firstName, lastName, phone, dob);

    await forms.chooseMale();
    await forms.assertOnlyMaleChecked();
    await forms.savePersonalDetails();
  });

  await test.step('Step 5: success message includes first name', async () => {
    await forms.assertSavedName(firstName);
  });

  await test.step('Steps 6-7: reset F02, empty submit, required-field errors', async () => {
    await forms.resetPersonalDetails();
    await forms.assertPersonalEmpty();

    await forms.savePersonalDetails();
    await forms.assertPersonalNotAccepted();
    await forms.assertPersonalRequiredErrors();
  });

  await test.step('Step 8: F01 invalid email is rejected', async () => {
    await forms.login('not-an-email', 'secret123');
    await forms.assertInvalidEmailRejected();
  });

  await test.step('Steps 9-10: F05 mismatched passwords', async () => {
    await forms.fillAccountSetup('secret123', 'wrong456');
    await expect(forms.termsCheckbox).toBeChecked();
    await expect(forms.password).not.toHaveValue(await forms.confirmPassword.inputValue());

    await forms.submitAccountSetup();
    await forms.assertPasswordMismatch();
  });
});