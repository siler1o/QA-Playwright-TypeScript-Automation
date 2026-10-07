import type { Locator, Page } from '@playwright/test';

export class DatePickerPage {
  readonly basicInput: Locator;
  readonly basicResult: Locator;
  readonly calendarTrigger: Locator;
  readonly calendarPanel: Locator;
  readonly calendarGrid: Locator;
  readonly dayButtons: Locator;
  readonly calendarResult: Locator;
  readonly constrainedInput: Locator;
  readonly constrainedResult: Locator;

  constructor(private readonly page: Page) {
    this.basicInput = page.getByTestId('dp-basic-input');
    this.basicResult = page.getByTestId('result-s01');
    this.calendarTrigger = page.getByTestId('dp-calendar-trigger');
    this.calendarPanel = page.getByTestId('dp-calendar-panel');
    this.calendarGrid = this.calendarPanel.getByRole('grid');
    this.dayButtons = page.getByTestId('dp-day-btn');
    this.calendarResult = page.getByTestId('result-s02');
    this.constrainedInput = page.getByTestId('dp-constrained-input');
    this.constrainedResult = page.getByTestId('result-s05');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/date-picker');
    await this.page.waitForLoadState('networkidle');
  }

  async openCalendar(): Promise<void> {
    await this.calendarTrigger.click();
  }

  async isRangeUnderflow(): Promise<boolean> {
    return this.constrainedInput.evaluate((el: HTMLInputElement) => el.validity.rangeUnderflow);
  }

    async supportsNativeDate(): Promise<boolean> {
    // WebKit on Windows downgrades type="date" to text, so min/max aren't enforced
    return this.constrainedInput.evaluate((el: HTMLInputElement) => el.type === 'date');
  }
}