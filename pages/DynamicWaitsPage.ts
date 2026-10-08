import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class DynamicWaitsPage {
  readonly delayedTrigger: Locator;
  readonly delayedResult: Locator;
  readonly spinnerTrigger: Locator;
  readonly spinner: Locator;
  readonly spinnerContent: Locator;
  readonly toastTrigger: Locator;
  readonly toast: Locator;
  readonly armButton: Locator;
  readonly submitButton: Locator;
  readonly submitResult: Locator;

  constructor(private readonly page: Page) {
    this.delayedTrigger = page.getByTestId('dw-trigger-delayed');
    this.delayedResult = page.getByTestId('dw-delayed-result');
    this.spinnerTrigger = page.getByTestId('dw-trigger-spinner');
    this.spinner = page.getByTestId('dw-spinner');
    this.spinnerContent = page.getByTestId('dw-spinner-content');
    this.toastTrigger = page.getByTestId('dw-trigger-toast');
    this.toast = page.getByTestId('dw-toast');
    this.armButton = page.getByTestId('dw-arm-enable');
    this.submitButton = page.getByTestId('dw-submit-btn');
    this.submitResult = page.getByTestId('result-s05');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/dynamic-waits', { waitUntil: 'domcontentloaded' });
  }

  async triggerDelay(): Promise<void> {
    // first click can land before React hydrates and do nothing, so retry until the button reacts
    await expect(async () => {
      if (await this.delayedTrigger.isEnabled()) await this.delayedTrigger.click();
      await expect(this.delayedTrigger).toBeDisabled({ timeout: 1000 });
    }).toPass();
  }
}