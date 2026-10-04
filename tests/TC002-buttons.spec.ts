import { test, expect } from '@playwright/test';
import { ButtonsPage } from '../pages/ButtonsPage';

test('TC002 - Click actions and button states', async ({ page }) => {
  const buttonsPage = new ButtonsPage(page);

  await test.step('Open page and verify initial results', async () => {
    await buttonsPage.open();
    await expect(buttonsPage.coordinatesButton).toBeVisible();
    await expect(buttonsPage.doubleClickButton).toBeVisible();
    await expect(buttonsPage.rightClickButton).toBeVisible();
    await expect(buttonsPage.coordinatesResult)
      .toHaveText('Coordinates: —');
    await expect(buttonsPage.doubleClickResult)
      .toHaveText('Not double-clicked yet');
    await expect(buttonsPage.rightClickResult)
      .toHaveText('No action performed yet');
    await expect(buttonsPage.disabledButton).toBeVisible();
    await expect(buttonsPage.disabledResult)
    .toHaveText('Button is disabled — no action fires');
  });

  await test.step('Click Find Location and check unrelated results', async () => {
    await buttonsPage.showCoordinates();
    await expect(buttonsPage.coordinatesResult)
      .toHaveText(/^X: -?\d+(?:\.\d+)?px, Y: -?\d+(?:\.\d+)?px$/);
    await expect(buttonsPage.doubleClickResult)
      .toHaveText('Not double-clicked yet');
    await expect(buttonsPage.rightClickResult)
      .toHaveText('No action performed yet');
  });

  await test.step('Single-click S07 without triggering confirmation', async () => {
    await buttonsPage.singleClickDoubleClickButton();
    await expect(buttonsPage.doubleClickResult)
    .toHaveText('Not double-clicked yet');
  });

  await test.step('Double-click S07 and verify confirmation', async () => {
    await buttonsPage.doubleClick();
    await expect(buttonsPage.doubleClickResult)
        .toHaveText('Double clicked!');
  });

  await test.step('Left-click S08 without triggering the context action', async () => {
    await buttonsPage.leftClickContextButton();
    await expect(buttonsPage.rightClickResult)
    .toHaveText('No action performed yet');
  });

  await test.step('Right-click S08 and verify confirmation', async () => {
    await buttonsPage.rightClickContextButton();
    await expect(buttonsPage.rightClickResult)
    .toHaveText('Context menu triggered!');
  });

  await test.step('Verify S05 is disabled and its result is unchanged', async () => {
    await expect(buttonsPage.disabledButton).toBeDisabled();
    await expect(buttonsPage.disabledResult)
    .toHaveText('Button is disabled — no action fires');
  });
});