import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class FileUploadPage {
  readonly singleInput: Locator;
  readonly singleResult: Locator;
  readonly multiInput: Locator;
  readonly multiResult: Locator;
  readonly typeInput: Locator;
  readonly typeError: Locator;
  readonly typeResult: Locator;
  readonly sizePanel: Locator;
  readonly sizeLimit: Locator;
  readonly sizeInput: Locator;
  readonly sizeError: Locator;
  readonly sizeResult: Locator;
  readonly progressPanel: Locator;
  readonly uploadButton: Locator;
  readonly progressResult: Locator;

  constructor(private readonly page: Page) {
    this.singleInput = page.getByTestId('fu-single-input');
    this.singleResult = page.getByTestId('result-s01');
    this.multiInput = page.getByTestId('fu-multi-input');
    this.multiResult = page.getByTestId('result-s02');
    this.typeInput = page.getByTestId('fu-type-input');
    this.typeError = page.getByTestId('scenario-fu-type').getByRole('alert');
    this.typeResult = page.getByTestId('result-s05');
    this.sizePanel = page.getByTestId('fu-size-panel');
    this.sizeLimit = this.sizePanel.locator('strong').first();
    this.sizeInput = page.getByTestId('fu-size-input');
    this.sizeError = this.sizePanel.locator('.error-msg');
    this.sizeResult = page.getByTestId('result-s06');
    this.progressPanel = page.getByTestId('fu-progress-panel');
    this.uploadButton = page.getByTestId('fu-upload-btn');
    this.progressResult = page.getByTestId('result-s08');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/file-upload', { waitUntil: 'domcontentloaded' });
  }

  async selectSingle(file: { name: string; mimeType: string; buffer: Buffer }): Promise<void> {
    // first change event can fire before React hydrates and get lost, so retry (setInputFiles is safe to repeat)
    await expect(async () => {
      await this.singleInput.setInputFiles(file);
      await expect(this.singleResult).toContainText(file.name, { timeout: 1000 });
    }).toPass();
  }

  async maxSizeBytes(): Promise<number> {
    const mb = parseFloat(await this.sizeLimit.innerText()); // "2 MB"
    return mb * 1024 * 1024;
  }
}