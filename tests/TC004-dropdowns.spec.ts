import { test, expect } from '@playwright/test';
import { DropdownsPage } from '../pages/DropdownsPage';

test('TC004 - native, custom, and searchable selections', async ({ page }) => {
  const dd = new DropdownsPage(page);

  await test.step('Step 1: open Dropdowns, fruit placeholder selected', async () => {
    await dd.open();
    await expect(dd.fruitSelect).toBeVisible();
    await expect(dd.fruitSelect).toHaveValue('');
    await expect(dd.fruitSelect.locator('option:checked')).toHaveText('Select Fruit');
  });

  await test.step('Step 2: choose Apple by visible text', async () => {
    await dd.selectFruit('Apple');
    await expect(dd.fruitSelect).toHaveValue('apple');
    await expect(dd.fruitResult).toContainText('Apple');
  });

  await test.step('Step 3: choose India by value', async () => {
    await dd.selectCountry('india');
    await expect(dd.countrySelect).toHaveValue('india');
    await expect(dd.countrySelect.locator('option:checked')).toHaveText('India');
    await expect(dd.countryResult).toContainText('India');
  });

  await test.step('Step 4: multi-select Batman and Aquaman', async () => {
    await dd.selectHeroes(['Batman']);
    await dd.selectHeroes(['Batman', 'Aquaman']);
    await dd.assertSelectedHeroes(['Batman', 'Aquaman']);
    await expect(dd.heroResult).toContainText('Batman');
    await expect(dd.heroResult).toContainText('Aquaman');
  });

  await test.step('Step 5: custom listbox High Priority', async () => {
    await dd.choosePriority('High Priority');
    await expect(dd.priorityTrigger).toContainText('High Priority');
    await expect(dd.priorityResult).toContainText('High Priority');
  });

  await test.step('Step 6: search Pun filters cities', async () => {
    await dd.searchCity('Pun');
    await expect(dd.cityResults.getByRole('option', { name: 'Pune' })).toBeVisible();
    await expect(dd.cityResults.getByRole('option')).toHaveCount(1);
  });

  await test.step('Step 7: select Pune', async () => {
    await dd.selectCity('Pune');
    await expect(dd.cityResult).toContainText('Pune');
  });
});
