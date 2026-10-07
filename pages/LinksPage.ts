import type { Locator, Page } from '@playwright/test';

export class LinksPage {
  readonly internalAboutLink: Locator;
  readonly externalCourseLink: Locator;
  readonly brokenSameTabLink: Locator;
  readonly anchorLink: Locator;
  readonly anchorTarget: Locator;

  constructor(private readonly page: Page) {
    this.internalAboutLink = page.getByTestId('link-internal-about');
    this.externalCourseLink = page.getByTestId('link-external-course');
    this.brokenSameTabLink = page.getByTestId('link-broken-same');
    this.anchorLink = page.getByTestId('link-text-anchor');
    this.anchorTarget = page.getByTestId('anchor-target');
  }

  async open(): Promise<void> {
        // 'load' can hang in CI: the page pulls a third-party image that may never finish
        await this.page.goto('/practice/links', { waitUntil: 'domcontentloaded' });
   }

  async href(link: Locator): Promise<string> {
    return (await link.getAttribute('href'))!;
  }
}