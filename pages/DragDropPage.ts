import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class DragDropPage {
  readonly basicItem: Locator;
  readonly basicZone: Locator;
  readonly basicResult: Locator;
  readonly card2: Locator;
  readonly zoneA: Locator;
  readonly zoneB: Locator;
  readonly zoneC: Locator;
  readonly zonesResult: Locator;
  readonly sortItems: Locator;
  readonly sortResult: Locator;
  readonly todoColumn: Locator;
  readonly doneColumn: Locator;
  readonly kanbanResult: Locator;

  constructor(private readonly page: Page) {
    this.basicItem = page.getByTestId('dd-item');
    this.basicZone = page.getByTestId('dd-drop-zone');
    this.basicResult = page.getByTestId('result-s01');
    this.card2 = page.locator('[data-card-id="card-2"]');
    this.zoneA = page.locator('[data-zone-id="zone-a"]');
    this.zoneB = page.locator('[data-zone-id="zone-b"]');
    this.zoneC = page.locator('[data-zone-id="zone-c"]');
    this.zonesResult = page.getByTestId('result-s02');
    this.sortItems = page.getByTestId('dd-sort-item');
    this.sortResult = page.getByTestId('result-s03');
    // another board further down reuses data-column-id, so scope to the S04 card
    const kanban = page.getByTestId('scenario-dd-kanban');
    this.todoColumn = kanban.locator('[data-column-id="todo"]');
    this.doneColumn = kanban.locator('[data-column-id="done"]');
    this.kanbanResult = page.getByTestId('result-s04');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/drag-drop', { waitUntil: 'domcontentloaded' });
  }

  async dropBasicItem(): Promise<void> {
    // first drag can run before React hydrates and do nothing, so retry while the item is still outside the zone
    await expect(async () => {
      if (await this.basicItem.count()) await this.basicItem.dragTo(this.basicZone);
      await expect(this.basicResult).toHaveText('Item dropped into zone ✓', { timeout: 1000 });
    }).toPass();
  }

  sortItem(id: string): Locator {
    return this.page.locator(`[data-item-id="${id}"]`);
  }

  async sortOrder(): Promise<string[]> {
    return this.sortItems.evaluateAll(items => items.map(i => (i as HTMLElement).dataset.itemId!));
  }

  task(column: Locator, id: string): Locator {
    return column.locator(`[data-task-id="${id}"]`);
  }
}