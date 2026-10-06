import { test, expect } from '@playwright/test';
import { DataTablePage } from '../pages/DataTablePage';

test('TC005 - data table search, sort, pagination, and add validation', async ({ page }) => {
  const table = new DataTablePage(page);
  let defaultOrder: string[];
  let initialCount: string;

  await test.step('Step 1: open Data Table with default settings', async () => {
    await table.open();
    await expect(page.getByTestId('data-table')).toBeVisible();
    await expect(table.headers).toHaveCount(7);
    await expect(table.rows).toHaveCount(5);
    await expect(table.rowCount).toBeVisible();
  });

  await test.step('Step 2: header labels match expected list', async () => {
    await table.assertHeaders([
      /Sr No\./i,
      /Book Name/i,
      /Book Genre/i,
      /Book Author/i,
      /Book ISBN/i,
      /Book Published/i,
      /Actions/i,
    ]);
  });

  await test.step('Step 3: page 1 has rows 1-5 of 25 books', async () => {
    await table.assertRowNumbers(['1', '2', '3', '4', '5']);
    await expect(table.rowCount).toHaveText('25 books — page 1 of 5');
    defaultOrder = await table.names();
    initialCount = await table.rowCount.innerText();
  });

  await test.step('Step 4: search Clean Code filters rows', async () => {
    await table.search('Clean Code');
    await expect(table.rowCount).toContainText('2 books');
    await expect(table.rowNames).toHaveText(['Clean Code', 'The Clean Coder']);
  });

  await test.step('Step 5: clear search, page 2 shows rows 6-10', async () => {
    await table.clearSearch();
    await expect(table.rowCount).toContainText('25 books');
    await table.goToPage(2);
    await table.assertRowNumbers(['6', '7', '8', '9', '10']);
  });

  await test.step('Step 6: Book Name sort ascending', async () => {
    await table.goToPage(1);
    await table.sortByBookName();
    await expect(table.bookNameHeader).toHaveAttribute('aria-sort', 'ascending');
    const names = await table.names();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  await test.step('Step 7: Book Name sort descending', async () => {
    await table.sortByBookName();
    await expect(table.bookNameHeader).toHaveAttribute('aria-sort', 'descending');
    const names = await table.names();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  await test.step('Step 8: third click restores original order', async () => {
    await table.sortByBookName();
    await expect(table.bookNameHeader).toHaveAttribute('aria-sort', 'none');
    await expect(table.rowNames).toHaveText(defaultOrder);
  });

  await test.step('Step 9: open Add Book with blank required fields', async () => {
    await table.openAddDialog();
    await expect(table.addDialog).toBeVisible();
    await expect(table.addNameInput).toHaveValue('');
    await expect(table.addAuthorInput).toHaveValue('');
  });

  await test.step('Step 10: Save shows required-field errors, nothing saved', async () => {
    await table.saveAddDialog();
    await expect(table.addNameError).toHaveText('Book name is required');
    await expect(table.addAuthorError).toHaveText('Author is required');
    await expect(table.rowCount).toHaveText(initialCount);
  });

  await test.step('Step 11: close dialog, count unchanged', async () => {
    await table.closeAddDialog();
    await expect(table.addDialog).toBeHidden();
    await expect(table.rowCount).toHaveText(initialCount);
  });
});