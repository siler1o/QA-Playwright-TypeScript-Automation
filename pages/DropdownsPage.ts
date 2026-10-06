import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class DropdownsPage {
  readonly fruitSelect: Locator;
  readonly fruitResult: Locator;
  readonly countrySelect: Locator;
  readonly countryResult: Locator;
  readonly heroSelect: Locator;
  readonly heroResult: Locator;
  readonly priorityTrigger: Locator;
  readonly priorityList: Locator;
  readonly priorityResult: Locator;
  readonly citySearch: Locator;
  readonly cityResults: Locator;
  readonly cityResult: Locator;

  constructor(private readonly page: Page) {
    this.fruitSelect = page.getByTestId('fruit-select');
    this.fruitResult = page.getByTestId('result-s01');
    this.countrySelect = page.getByTestId('country-select');
    this.countryResult = page.getByTestId('result-s02');
    this.heroSelect = page.getByTestId('hero-select');
    this.heroResult = page.getByTestId('result-s04');
    this.priorityTrigger = page.getByTestId('priority-dropdown-trigger');
    this.priorityList = page.getByTestId('priority-dropdown-list');
    this.priorityResult = page.getByTestId('result-s05');
    this.citySearch = page.getByRole('combobox', { name: 'City' }); // input has no test id
    this.cityResults = page.getByTestId('city-results');
    this.cityResult = page.getByTestId('result-s06');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/dropdowns');
    await this.page.waitForLoadState('networkidle');
  }

  async selectFruit(label: string): Promise<void> {
    await this.fruitSelect.selectOption({ label });
  }

  async selectCountry(value: string): Promise<void> {
    await this.countrySelect.selectOption(value);
  }

  // Passing both labels at once replaces the selection; add Aquaman after Batman via a second call.
  async selectHeroes(labels: string[]): Promise<void> {
    await this.heroSelect.selectOption(labels.map((label) => ({ label })));
  }

  async choosePriority(label: string): Promise<void> {
    await this.priorityTrigger.click();
    await this.priorityList.getByRole('option', { name: label }).click();
  }

  async searchCity(text: string): Promise<void> {
    await this.citySearch.fill(text);
  }

  async selectCity(name: string): Promise<void> {
    await this.cityResults.getByRole('option', { name }).click();
  }

  async assertSelectedHeroes(labels: string[]): Promise<void> {
    const selected = await this.heroSelect.evaluate((el: HTMLSelectElement) =>
      [...el.selectedOptions].map((o) => o.label),
    );
    expect(selected.sort()).toEqual([...labels].sort());
  }
}
