import { type Locator, type Page } from '@playwright/test';

export class ButtonsPage {
  readonly page: Page;
  readonly coordinatesButton: Locator;
  readonly coordinatesResult: Locator;
  readonly doubleClickButton: Locator;
  readonly doubleClickResult: Locator;
  readonly rightClickButton: Locator;
  readonly rightClickResult: Locator;
  readonly disabledButton: Locator;
  readonly disabledResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.coordinatesButton = page.getByTestId('btn-get-coordinates');
    this.coordinatesResult = page.getByTestId('result-s02');
    this.doubleClickButton = page.getByTestId('btn-double-click');
    this.doubleClickResult = page.getByTestId('result-s07');
    this.rightClickButton = page.getByTestId('btn-right-click');
    this.rightClickResult = page.getByTestId('result-s08');
    this.disabledButton = page.getByTestId('btn-disabled');
    this.disabledResult = page.getByTestId('result-s05');
    }

    async open() {
        await this.page.goto('/practice/buttons');
    }

    async showCoordinates() {
        await this.coordinatesButton.click();
    }

    async singleClickDoubleClickButton() {
        await this.doubleClickButton.click();
    }

    async doubleClick() {
        await this.doubleClickButton.dblclick();
    }

    async leftClickContextButton() {
        await this.rightClickButton.click();
    }

    async rightClickContextButton() {
        await this.rightClickButton.click({ button: 'right' });
    }

}