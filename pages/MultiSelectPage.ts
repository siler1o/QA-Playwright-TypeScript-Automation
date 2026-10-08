import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class MultiSelectPage {
  readonly multiSelect: Locator;
  readonly multiResult: Locator;
  readonly preselectAllButton: Locator;
  readonly deselectSelect: Locator;
  readonly deselectResult: Locator;
  readonly customScenario: Locator;
  readonly customTrigger: Locator;
  readonly customResult: Locator;
  readonly bulkScenario: Locator;
  readonly bulkTrigger: Locator;
  readonly clearAllButton: Locator;
  readonly bulkResult: Locator;

  constructor(private readonly page: Page) {
    // several scenarios reuse the same test IDs, so scope each one to its card
    const multi = page.getByTestId('scenario-ms-multi');
    const deselect = page.getByTestId('scenario-ms-deselect');
    this.customScenario = page.getByTestId('scenario-ms-custom');
    this.bulkScenario = page.getByTestId('scenario-ms-select-all');

    this.multiSelect = multi.getByTestId('ms-native-select');
    this.multiResult = page.getByTestId('result-s02');
    this.preselectAllButton = deselect.getByTestId('ms-deselect-trigger');
    this.deselectSelect = deselect.getByTestId('ms-native-select');
    this.deselectResult = page.getByTestId('result-s03');
    this.customTrigger = this.customScenario.getByTestId('ms-custom-trigger');
    this.customResult = page.getByTestId('result-s04');
    this.bulkTrigger = this.bulkScenario.getByTestId('ms-custom-trigger');
    this.clearAllButton = this.bulkScenario.getByTestId('ms-clear-all-btn');
    this.bulkResult = page.getByTestId('result-s05');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/multi-select', { waitUntil: 'domcontentloaded' });
  }

  async selectMulti(values: string[], expectedResult: string): Promise<void> {
    // first select can run before React hydrates and the result never updates, so retry (selectOption is safe to repeat)
    await expect(async () => {
      await this.multiSelect.selectOption(values);
      await expect(this.multiResult).toHaveText(expectedResult, { timeout: 1000 });
    }).toPass();
  }

  option(scenario: Locator, value: string): Locator {
    return scenario.locator(`[data-testid="ms-custom-option"][data-value="${value}"]`);
  }

  selectedOptions(scenario: Locator): Locator {
    return scenario.locator('[data-testid="ms-custom-option"][aria-selected="true"]');
  }
}