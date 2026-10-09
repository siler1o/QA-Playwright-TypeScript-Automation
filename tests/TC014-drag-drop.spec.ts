import { test, expect } from '@playwright/test';
import { DragDropPage } from '../pages/DragDropPage';

test('TC014 - move cards and verify destinations', async ({ page }) => {
  const dd = new DragDropPage(page);
  let zoneABefore: string;
  let zoneCBefore: string;
  let orderBefore: string[];

  await test.step('Step 1: item outside empty drop zone', async () => {
    await dd.open();
    await expect(dd.basicItem).toBeVisible();
    await expect(dd.basicZone).toHaveText('Drop here');
    await expect(dd.basicResult).toHaveText('Item not dropped yet');
  });

  await test.step('Step 2: drag item into zone', async () => {
    await dd.dropBasicItem();
    await expect(dd.basicZone).toContainText('Item dropped');
    await expect(dd.basicItem).toHaveCount(0);
  });

  await test.step('Step 3: locate card-2 and zone-b, record other zones', async () => {
    await expect(dd.card2).toBeVisible();
    await expect(dd.zoneB).toContainText('Drop here');
    zoneABefore = (await dd.zoneA.textContent())!;
    zoneCBefore = (await dd.zoneC.textContent())!;
  });

  await test.step('Step 4: drag card-2 into zone-b', async () => {
    await dd.card2.dragTo(dd.zoneB);
    await expect(dd.zoneB.getByText('Beta', { exact: true })).toHaveCount(1);
    await expect(dd.zoneA).toHaveText(zoneABefore);
    await expect(dd.zoneC).toHaveText(zoneCBefore);
    await expect(dd.zonesResult).toHaveText('1/3 matched');
  });

  await test.step('Step 5: drag item-3 above item-1', async () => {
    orderBefore = await dd.sortOrder();
    expect(orderBefore).toEqual(['item-1', 'item-2', 'item-3', 'item-4', 'item-5']);
    await dd.sortItem('item-3').dragTo(dd.sortItem('item-1'));
    await expect(dd.sortResult).toHaveText('Order: Selenium, Playwright, Cypress, WebdriverIO, Puppeteer');
    const orderAfter = await dd.sortOrder();
    expect(orderAfter[0]).toBe('item-3');
    expect([...orderAfter].sort()).toEqual([...orderBefore].sort()); // same items, same count
  });

  await test.step('Step 6: task-2 in Todo, Done column present', async () => {
    await expect(dd.task(dd.todoColumn, 'task-2')).toBeVisible();
    await expect(dd.doneColumn).toBeVisible();
  });

  await test.step('Step 7: drag task-2 from Todo to Done', async () => {
    await dd.task(dd.todoColumn, 'task-2').dragTo(dd.doneColumn);
    await expect(dd.task(dd.todoColumn, 'task-2')).toHaveCount(0);
    await expect(dd.task(dd.doneColumn, 'task-2')).toHaveCount(1);
    await expect(dd.kanbanResult).toHaveText('"Automate checkout flow" moved to Done ✓');
  });
});