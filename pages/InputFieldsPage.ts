import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class InputFieldsPage {
  readonly movieInput: Locator;
  readonly submitButton: Locator;
  readonly resultMessage: Locator;
  readonly appendText: Locator;
  readonly clearInput: Locator;
  readonly clearButton: Locator;
  readonly clearMessage: Locator;
  readonly disabledInput: Locator;
  readonly readonlyInput: Locator;

  constructor(private readonly page: Page) {
    this.movieInput = page.getByPlaceholder('Enter a movie name…');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.resultMessage = page.getByText(/^You entered:/);
    this.appendText = page.getByTestId('input-append');
    this.clearInput = page.getByTestId('input-clear');
    this.clearButton = page.getByTestId('btn-clear-field');
    this.clearMessage = page.getByTestId('result-s04');
    this.disabledInput = page.locator('#disabledInput');
    this.readonlyInput = page.locator('#readonlyInput');
    
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/input-fields');
    await this.page.waitForLoadState('networkidle');
  }

  async enterMovie(title: string): Promise<void> {
    await this.movieInput.fill(title);
  }

  async submitMovie(): Promise<void> {
    await this.submitButton.click();
  }

  async assertMessage(title: string): Promise<void> {
    await expect(this.resultMessage).toHaveText(`You entered: ${title}`);
  }

  async assertAppend(expected: string): Promise<void> {
    await expect(this.appendText).toHaveValue(expected);
  }

  async appendSuffix(suffix: string): Promise<void> {
    await this.appendText.press('End');
    await this.appendText.pressSequentially(suffix);
    await this.appendText.press('Tab');
  }

  async clearField(): Promise<void> {
    await this.clearButton.click();
  }

  async assertClear(expected: string): Promise<void> {
    await expect(this.clearInput).toHaveValue(expected);
  }

  async assertClearMessage(): Promise<void> {
    await expect(this.clearMessage).toContainText('Field cleared');
  }

  async assertTabSkipsDisabled(): Promise<void> {
  await this.clearButton.focus();

  for (let i = 0; i < 8; i++) {
    await this.page.keyboard.press('Tab');
    await expect(this.disabledInput).not.toBeFocused();

    if (await this.readonlyInput.evaluate(
      element => element === document.activeElement
    )) {
      return;
    }
  }

  throw new Error('Tab did not reach the readonly input');
  }
}