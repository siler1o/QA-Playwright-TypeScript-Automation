import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

// Playwright CSS and getBy* locators pierce open shadow roots, so plain chaining reaches inside each host
export class ShadowDomPage {
  readonly basicHost: Locator;
  readonly basicButton: Locator;
  readonly clickCount: Locator;
  readonly basicResult: Locator;
  readonly host1: Locator;
  readonly host2: Locator;
  readonly hostsResult: Locator;
  readonly outerHost: Locator;
  readonly innerHost: Locator;
  readonly innerButton: Locator;
  readonly nestedResult: Locator;
  readonly formHost: Locator;
  readonly nameInput: Locator;
  readonly roleSelect: Locator;
  readonly submitButton: Locator;
  readonly formResult: Locator;

  constructor(private readonly page: Page) {
    this.basicHost = page.getByTestId('shadow-host-basic');
    this.basicButton = this.basicHost.getByTestId('shadow-btn-basic');
    this.clickCount = this.basicHost.locator('#shadow-click-count');
    this.basicResult = page.getByTestId('result-s01');
    this.host1 = page.locator('[data-host-id="host-1"]');
    this.host2 = page.locator('[data-host-id="host-2"]');
    this.hostsResult = page.getByTestId('result-s02');
    this.outerHost = page.getByTestId('shadow-outer-host');
    this.innerHost = this.outerHost.locator('[data-inner="true"]');
    this.innerButton = this.innerHost.getByTestId('shadow-inner-btn');
    this.nestedResult = page.getByTestId('result-s03');
    this.formHost = page.getByTestId('shadow-form-host');
    this.nameInput = this.formHost.getByLabel('Full name');
    this.roleSelect = this.formHost.getByLabel('Role');
    this.submitButton = this.formHost.getByTestId('shadow-submit-btn');
    this.formResult = page.getByTestId('result-s04');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/shadow-dom', { waitUntil: 'domcontentloaded' });
  }

  // Shadow content and its listeners attach after hydration, so an early click can be lost.
  // Retry only while the result still shows its initial text, so a counted click never lands twice.
  async clickUntilResultChanges(button: Locator, result: Locator, initialText: string): Promise<void> {
    await expect(async () => {
      if ((await result.innerText()) === initialText) await button.click();
      await expect(result).not.toHaveText(initialText, { timeout: 1000 });
    }).toPass();
  }
}
