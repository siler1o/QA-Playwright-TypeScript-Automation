import { test, expect } from '@playwright/test';
import { IframesPage } from '../pages/IframesPage';

test('TC015 - find and interact inside frames', async ({ page }) => {
  const frames = new IframesPage(page);
  const sample = 'Sample text';

  await test.step('Step 1: basic iframe attached, form controls accessible', async () => {
    await frames.open();
    await expect(frames.basicIframe).toBeAttached();
    await expect(frames.basicFrame.getByTestId('iframe-name-input')).toBeEditable();
    await expect(frames.basicFrame.getByTestId('iframe-submit-btn')).toBeEnabled();
  });

  await test.step('Step 2: fill and submit inside the frame', async () => {
    await frames.submitBasic(sample);
    await expect(frames.basicFrame.locator('#result')).toHaveText(`Hello, ${sample}!`);
  });

  await test.step('Step 3: preferences frame dropdown and Save accessible', async () => {
    await frames.prefsIframe.scrollIntoViewIfNeeded(); // iframes are loading="lazy"; Firefox and WebKit skip off-screen ones
    await expect(frames.prefsFrame.getByTestId('iframe-lang-select')).toBeVisible();
    await expect(frames.prefsFrame.getByTestId('iframe-save-btn')).toBeVisible();
  });

  await test.step('Step 4: choose non-default preference, Save enabled', async () => {
    const select = frames.prefsFrame.getByTestId('iframe-lang-select');
    await expect(select).toHaveValue('');
    await select.selectOption('python');
    await expect(select).toHaveValue('python');
    await expect(frames.prefsFrame.getByTestId('iframe-save-btn')).toBeEnabled();
  });

  await test.step('Step 5: nested input reachable two levels deep', async () => {
    await expect(frames.outerIframe).toBeAttached();
    await frames.outerIframe.scrollIntoViewIfNeeded();
    await expect(frames.innerFrame.getByTestId('iframe-inner-input')).toBeEditable();
  });

  await test.step('Step 6: submit nested form, page result reflects value', async () => {
    await frames.innerFrame.getByTestId('iframe-inner-input').fill(sample);
    await frames.innerFrame.getByTestId('iframe-inner-submit').click();
    await expect(frames.innerFrame.locator('#inner-result')).toHaveText(`Unlocked with: ${sample} ✓`);
    await expect(frames.nestedResult).toHaveText(`Inner frame: unlocked with "${sample}"`);
  });

  await test.step('Step 7: dynamic frame button appears and is clickable', async () => {
    await frames.dynamicIframe.scrollIntoViewIfNeeded();
    const reveal = frames.dynamicFrame.getByRole('button', { name: 'Reveal Secret' });
    await expect(reveal).toBeVisible({ timeout: 5000 });
    await frames.dynamicFrame.getByRole('textbox', { name: 'Reveal code input' }).fill(sample);
    await reveal.click();
    await expect(frames.dynamicResult).toHaveText(`Dynamic content: revealed "${sample}"`);
  });
});
