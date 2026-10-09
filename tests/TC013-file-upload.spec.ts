import { test, expect } from '@playwright/test';
import { FileUploadPage } from '../pages/FileUploadPage';

// in-memory fixtures, no files on disk
const textFile = (name: string, size = 12) => ({ name, mimeType: 'text/plain', buffer: Buffer.alloc(size, 'a') });

test('TC013 - file selection and upload validation', async ({ page }) => {
  const upload = new FileUploadPage(page);
  const sample = textFile('sample.txt');
  const sample1 = textFile('sample1.txt');
  const sample2 = textFile('sample2.txt');
  let oversize: ReturnType<typeof textFile>;

  await test.step('Step 1: fixtures ready, upload controls visible', async () => {
    expect(sample.buffer.length).toBeGreaterThan(0);
    await upload.open();
    await expect(upload.singleInput).toBeVisible();
    await expect(upload.multiInput).toBeVisible();
  });

  await test.step('Step 2: select one file on single input', async () => {
    await upload.selectSingle(sample);
    await expect(upload.singleResult).toHaveText('"sample.txt" selected (12 B)');
  });

  await test.step('Step 3: select two files on multiple input', async () => {
    await upload.multiInput.setInputFiles([sample1, sample2]);
    await expect(upload.multiResult).toHaveText('2 file(s) selected: sample1.txt, sample2.txt');
    expect(await upload.multiInput.evaluate((el: HTMLInputElement) => el.files!.length)).toBe(2);
  });

  await test.step('Step 4: image input accepts images only', async () => {
    await expect(upload.typeInput).toHaveAttribute('accept', 'image/*');
  });

  await test.step('Step 5: non-image file shows type error', async () => {
    await upload.typeInput.setInputFiles(sample);
    await expect(upload.typeError).toHaveText('⚠ "sample.txt" is not an image file. Only image/* is accepted.');
    await expect(upload.typeResult).toHaveText('Type error: "sample.txt" rejected');
  });

  await test.step('Step 6: read max size, build larger fixture', async () => {
    const maxBytes = await upload.maxSizeBytes();
    oversize = textFile('oversize.txt', maxBytes + 1);
    expect(oversize.buffer.length).toBeGreaterThan(maxBytes);
  });

  await test.step('Step 7: oversize file shows size error', async () => {
    await upload.sizeInput.setInputFiles(oversize);
    await expect(upload.sizeError).toHaveText('⚠ File is too large (2.0 MB). Maximum allowed is 2 MB.');
    await expect(upload.sizeResult).toHaveText('Size error: 2.0 MB exceeds 2 MB');
  });

  await test.step('Step 8: no file selected, Upload disabled, no progress', async () => {
    await expect(upload.uploadButton).toBeDisabled();
    await expect(upload.progressPanel.getByRole('progressbar')).toHaveCount(0);
    await expect(upload.progressResult).toHaveText('Progress not tracked');
  });
});