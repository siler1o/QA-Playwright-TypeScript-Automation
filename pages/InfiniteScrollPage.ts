import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class InfiniteScrollPage {
  readonly simpleList: Locator;
  readonly simpleItems: Locator;
  readonly simpleEnd: Locator;
  readonly simpleResult: Locator;
  readonly virtualList: Locator;
  readonly manualList: Locator;
  readonly manualItems: Locator;
  readonly loadMoreButton: Locator;

  constructor(private readonly page: Page) {
    this.simpleList = page.getByTestId('scroll-container-simple');
    this.simpleItems = this.simpleList.locator('[data-testid^="item-"]');
    this.simpleEnd = page.getByTestId('end-of-list-simple');
    this.simpleResult = page.getByTestId('result-s01');
    this.virtualList = page.getByTestId('scroll-container-virtual');
    this.manualList = page.getByTestId('scroll-container-challenge');
    this.manualItems = this.manualList.getByText(/^Secret Item \d+$/);
    this.loadMoreButton = this.manualList.getByRole('button', { name: 'Load More' });
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/infinite-scroll', { waitUntil: 'domcontentloaded' });
  }

  virtualItem(n: number): Locator {
    return this.virtualList.getByTestId(`virtual-item-${n}`);
  }

  manualItem(n: number): Locator {
    return this.manualList.getByText(`Secret Item ${n}`, { exact: true });
  }

  async scrollToBottom(list: Locator): Promise<void> {
    // nudge up first: if the list already sits at the bottom, a same-value scroll fires no scroll event
    await list.evaluate(el => el.scrollBy(0, -50));
    await list.evaluate(el => { el.scrollTop = el.scrollHeight; });
  }

  // Keep scrolling a list to its bottom until the target shows up. Retrying also covers
  // the scroll handler attaching late (hydration) and batches that load after a delay.
  async scrollUntilVisible(list: Locator, target: Locator): Promise<void> {
    await expect(async () => {
      await this.scrollToBottom(list);
      await expect(target).toBeVisible({ timeout: 1000 });
    }).toPass();
  }

  // Step through a virtualized list one viewport at a time until the target row is rendered.
  async scrollUntilRendered(list: Locator, target: Locator): Promise<void> {
    await expect(async () => {
      if (!(await target.count())) await list.evaluate(el => el.scrollBy(0, el.clientHeight));
      await expect(target).toBeAttached({ timeout: 500 });
    }).toPass();
    await target.scrollIntoViewIfNeeded();
  }
}
