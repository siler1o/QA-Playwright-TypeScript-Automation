import { expect } from '@playwright/test';
import type { FrameLocator, Locator, Page } from '@playwright/test';

export class IframesPage {
  readonly basicIframe: Locator;
  readonly basicFrame: FrameLocator;
  readonly basicResult: Locator;
  readonly prefsIframe: Locator;
  readonly prefsFrame: FrameLocator;
  readonly outerIframe: Locator;
  readonly innerFrame: FrameLocator;
  readonly nestedResult: Locator;
  readonly dynamicIframe: Locator;
  readonly dynamicFrame: FrameLocator;
  readonly dynamicResult: Locator;

  constructor(private readonly page: Page) {
    this.basicIframe = page.getByTestId('iframe-basic');
    this.basicFrame = page.frameLocator('[data-testid="iframe-basic"]');
    this.basicResult = page.getByTestId('result-s01');
    this.prefsIframe = page.locator('iframe[title="Form Iframe"]');
    this.prefsFrame = page.frameLocator('iframe[title="Form Iframe"]');
    this.outerIframe = page.getByTestId('iframe-outer');
    this.innerFrame = page.frameLocator('[data-testid="iframe-outer"]').frameLocator('iframe[title="Inner Frame"]');
    this.nestedResult = page.getByTestId('result-s04');
    this.dynamicIframe = page.getByTestId('iframe-dynamic');
    this.dynamicFrame = page.frameLocator('[data-testid="iframe-dynamic"]');
    this.dynamicResult = page.getByTestId('result-s05');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/iframes', { waitUntil: 'domcontentloaded' });
  }

  async submitBasic(text: string): Promise<void> {
    // the page result listens for the frame's message; a submit before React hydrates is missed, so retry (safe to repeat)
    await expect(async () => {
      await this.basicFrame.getByTestId('iframe-name-input').fill(text);
      await this.basicFrame.getByTestId('iframe-submit-btn').click();
      await expect(this.basicResult).toHaveText(`Submitted: ${text}`, { timeout: 1000 });
    }).toPass();
  }
}
