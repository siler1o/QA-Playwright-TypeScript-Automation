import { test, expect } from '@playwright/test';
import { InfiniteScrollPage } from '../pages/InfiniteScrollPage';

test('TC018 - pagination on scroll and virtualized lists', async ({ page }) => {
  const scroll = new InfiniteScrollPage(page);
  let initialCount: number;

  await test.step('Step 1: record initial item count in simple list', async () => {
    await scroll.open();
    await expect(scroll.simpleItems.first()).toBeVisible();
    initialCount = await scroll.simpleItems.count();
    expect(initialCount).toBe(5);
  });

  await test.step('Step 2: scroll to bottom, next batch appends', async () => {
    await scroll.scrollUntilVisible(scroll.simpleList, scroll.simpleItems.nth(initialCount));
    expect(await scroll.simpleItems.count()).toBeGreaterThan(initialCount);
  });

  await test.step('Step 3: keep loading until End of List', async () => {
    await scroll.scrollUntilVisible(scroll.simpleList, scroll.simpleEnd);
    await expect(scroll.simpleEnd).toHaveText('End of List');
    await expect(scroll.simpleResult).toHaveText('Reached End of List');
    await expect(scroll.simpleItems).toHaveCount(15);
  });

  await test.step('Step 4: virtualized list renders item 1', async () => {
    await expect(scroll.virtualItem(1)).toBeVisible();
  });

  await test.step('Step 5: item 50 visible, item 1 recycled out of DOM', async () => {
    await scroll.scrollUntilRendered(scroll.virtualList, scroll.virtualItem(50));
    await expect(scroll.virtualItem(50)).toBeInViewport();
    await expect(scroll.virtualItem(1)).toHaveCount(0);
  });

  await test.step('Step 6: scroll manual list until Load More shows', async () => {
    await scroll.scrollUntilVisible(scroll.manualList, scroll.loadMoreButton);
  });

  await test.step('Step 7: Load More adds final batch with item 20', async () => {
    const before = await scroll.manualItems.count();
    await scroll.loadMoreButton.click();
    await expect(scroll.manualItem(20)).toBeVisible();
    expect(await scroll.manualItems.count()).toBeGreaterThan(before);
    await expect(scroll.manualItems).toHaveCount(20);
  });
});
