import type { Locator, Page } from '@playwright/test';

export class ModalsPage {
  readonly openSimpleButton: Locator;
  readonly simpleModal: Locator;
  readonly closeSimpleButton: Locator;
  readonly simpleResult: Locator;
  readonly courseCards: Locator;
  readonly courseModal: Locator;
  readonly closeCourseButton: Locator;
  readonly courseResult: Locator;

  constructor(private readonly page: Page) {
    this.openSimpleButton = page.getByTestId('btn-open-simple-modal');
    this.simpleModal = page.getByTestId('modal-simple');
    this.closeSimpleButton = page.getByTestId('btn-close-simple-modal');
    this.simpleResult = page.getByTestId('result-s01');
    this.courseCards = page.getByTestId('card-course');
    this.courseModal = page.getByTestId('modal-card');
    this.closeCourseButton = page.getByTestId('btn-close-course');
    this.courseResult = page.getByTestId('result-s02');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/modals', { waitUntil: 'domcontentloaded' });
  }

  detailsButton(courseTitle: string): Locator {
    // both cards share the same test IDs, so pick the card by its heading first
    return this.courseCards.filter({ has: this.page.getByRole('heading', { name: courseTitle }) }).getByTestId('btn-open-course');
  }

  async clickBackdrop(modal: Locator): Promise<void> {
    // the overlay is the panel's full-screen parent; click its left edge at mid-height,
    // away from the panel and below the sticky site nav that covers the top
    const overlay = modal.locator('xpath=..');
    const box = (await overlay.boundingBox())!;
    await overlay.click({ position: { x: 10, y: box.height / 2 } });
  }
}
