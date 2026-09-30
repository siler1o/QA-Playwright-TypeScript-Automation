import { test, expect } from '@playwright/test';
import { InputFieldsPage } from '../pages/InputFieldsPage';

test('TC001 - input fields', async ({ page }) => {
    const inputFields = new InputFieldsPage(page);

    await test.step('Steps 1-3: movie input and result', async () => {
    await inputFields.open();
    await inputFields.enterMovie('Interstellar');
    await expect(inputFields.movieInput).toHaveValue('Interstellar');
    await inputFields.submitMovie();
    await inputFields.assertMessage('Interstellar');
  });

    await test.step('Steps 4-5: append field', async () => {
    await inputFields.assertAppend('Avengers');
    await inputFields.appendSuffix(' Endgame');
    await inputFields.assertAppend('Avengers Endgame');
  });

    await test.step('Step 6: clear field', async () => {
    await expect(inputFields.clearInput).toHaveValue('Inception');
    await inputFields.clearField();
    await inputFields.assertClear('');
    await inputFields.assertClearMessage();
  });

    await test.step('Step 7: disabled field', async () => {
    await expect(inputFields.disabledInput).toBeDisabled();
    await inputFields.assertTabSkipsDisabled();
  });

    await test.step('Step 8: readonly field', async () => {
    const originalValue = await inputFields.readonlyInput.inputValue();
    expect(originalValue).not.toBe('');
    await expect(inputFields.readonlyInput).toHaveAttribute('readonly');
    await inputFields.readonlyInput.pressSequentially('X');
    await expect(inputFields.readonlyInput).toHaveValue(originalValue);
  });
});
