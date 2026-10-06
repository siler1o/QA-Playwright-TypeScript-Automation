import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class DataTablePage {
  readonly headers: Locator;
  readonly rows: Locator;
  readonly rowNames: Locator;
  readonly rowNumbers: Locator;
  readonly rowCount: Locator;
  readonly searchInput: Locator;
  readonly bookNameHeader: Locator;
  readonly addBookButton: Locator;
  readonly addDialog: Locator;
  readonly addNameInput: Locator;
  readonly addAuthorInput: Locator;
  readonly addNameError: Locator;
  readonly addAuthorError: Locator;
  readonly addSaveButton: Locator;
  readonly addCancelButton: Locator;

  constructor(private readonly page: Page) {
    this.headers = page.getByTestId('table-head').getByRole('columnheader');
    this.rows = page.getByTestId('book-row');
    this.rowNames = page.locator('[data-testid="book-row"] td[data-col="book-name"]');
    this.rowNumbers = page.getByTestId('cell-sr-no');
    this.rowCount = page.getByTestId('row-count');
    this.searchInput = page.getByTestId('table-search');
    this.bookNameHeader = page.getByTestId('col-book-name');
    this.addBookButton = page.getByTestId('btn-add-book');
    this.addDialog = page.getByTestId('add-book-dialog');
    this.addNameInput = page.getByTestId('add-input-book-name');
    this.addAuthorInput = page.getByTestId('add-input-book-author');
    this.addNameError = page.getByTestId('add-name-error');
    this.addAuthorError = page.getByTestId('add-author-error');
    this.addSaveButton = page.getByTestId('add-dialog-save');
    this.addCancelButton = page.getByTestId('add-dialog-cancel');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/data-table');
    await this.page.waitForLoadState('networkidle');
  }

  async search(text: string): Promise<void> {
    await this.searchInput.fill(text);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
  }

  async goToPage(n: number): Promise<void> {
    await this.page.getByTestId(`pagination-page-${n}`).click();
  }

  async sortByBookName(): Promise<void> {
    await this.bookNameHeader.click();
  }

  async openAddDialog(): Promise<void> {
    await this.addBookButton.click();
  }

  async saveAddDialog(): Promise<void> {
    await this.addSaveButton.click();
  }

  async closeAddDialog(): Promise<void> {
    await this.addCancelButton.click();
  }

  async names(): Promise<string[]> {
    return this.rowNames.allInnerTexts();
  }

  async assertHeaders(expected: Array<string | RegExp>): Promise<void> {
    await expect(this.headers).toHaveText(expected); // array form checks count and order
  }

  async assertRowNumbers(expected: string[]): Promise<void> {
    await expect(this.rowNumbers).toHaveText(expected);
  }
}