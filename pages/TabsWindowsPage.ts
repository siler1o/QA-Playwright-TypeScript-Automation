import type { Locator, Page } from '@playwright/test';

export class TabsWindowsPage {
  readonly openNewTabLink: Locator;
  readonly markReturnedButton: Locator;
  readonly switchResult: Locator;

  constructor(private readonly page: Page) {
    this.openNewTabLink = page.getByTestId('tw-open-and-return');
    this.markReturnedButton = page
      .getByTestId('scenario-tw-switch-back')
      .getByRole('button', { name: 'Mark as Returned' });
    this.switchResult = page.getByTestId('result-s03');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/tabs-windows', { waitUntil: 'domcontentloaded' });
  }

  async openNewTab(): Promise<Page> {
    // start listening before the click, or the popup can be missed
    const popupPromise = this.page.waitForEvent('popup');
    await this.openNewTabLink.click();
    return popupPromise;
  }
}