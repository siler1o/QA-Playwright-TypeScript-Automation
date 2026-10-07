import type { Locator, Page } from '@playwright/test';

export class RadioCheckboxPage {
  readonly termsCheckbox: Locator;
  readonly termsResult: Locator;
  readonly planGroup: Locator;
  readonly starterRadio: Locator;
  readonly proRadio: Locator;
  readonly businessRadio: Locator;
  readonly planResult: Locator;
  readonly disabledCheckbox: Locator;
  readonly disabledResult: Locator;

  constructor(private readonly page: Page) {
    this.termsCheckbox = page.getByTestId('chk-accept-terms');
    this.termsResult = page.getByTestId('result-s01');
    this.planGroup = page.getByTestId('radio-plan-group');
    this.starterRadio = page.getByTestId('radio-plan-starter');
    this.proRadio = page.getByTestId('radio-plan-pro');
    this.businessRadio = page.getByTestId('radio-plan-business');
    this.planResult = page.getByTestId('result-s02');
    this.disabledCheckbox = page.getByTestId('chk-disabled');
    this.disabledResult = page.getByTestId('result-s05');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/radio-checkbox');
    await this.page.waitForLoadState('networkidle');
  }
}