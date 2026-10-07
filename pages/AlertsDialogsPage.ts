import type { Locator, Page } from '@playwright/test';

export class AlertsDialogsPage {
  readonly openInfoButton: Locator;
  readonly infoDialog: Locator;
  readonly infoCloseButton: Locator;
  readonly infoResult: Locator;
  readonly openConfirmButton: Locator;
  readonly confirmDialog: Locator;
  readonly confirmOkButton: Locator;
  readonly confirmResult: Locator;
  readonly openEscapeButton: Locator;
  readonly escapeDialog: Locator;
  readonly escapeResult: Locator;
  readonly openBackdropButton: Locator;
  readonly backdropDialog: Locator;
  readonly backdropPanel: Locator;
  readonly backdropResult: Locator;
  readonly openModals: Locator;

  constructor(private readonly page: Page) {
    this.openInfoButton = page.getByTestId('open-info-dialog');
    this.infoDialog = page.getByTestId('info-alert-dialog');
    this.infoCloseButton = page.getByTestId('info-dialog-close-btn');
    this.infoResult = page.getByTestId('result-s01');
    this.openConfirmButton = page.getByTestId('open-confirm-dialog');
    this.confirmDialog = page.getByTestId('confirm-action-dialog');
    this.confirmOkButton = page.getByTestId('confirm-ok-btn');
    this.confirmResult = page.getByTestId('result-s02');
    this.openEscapeButton = page.getByTestId('open-escape-dialog');
    this.escapeDialog = page.getByTestId('escape-dismiss-dialog');
    this.escapeResult = page.getByTestId('result-s06');
    this.openBackdropButton = page.getByTestId('open-backdrop-dialog');
    this.backdropDialog = page.getByTestId('backdrop-dismiss-dialog');
    this.backdropPanel = page.getByTestId('backdrop-dialog-box');
    this.backdropResult = page.getByTestId('result-s05');
    this.openModals = page.locator('[role="dialog"][aria-modal="true"]');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/alerts-dialogs');
    await this.page.waitForLoadState('networkidle');
  }

  async pressEscape(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async clickBackdrop(): Promise<void> {
    // click beside the panel at mid-height; the sticky top nav covers the overlay's corners
    const overlay = await this.backdropDialog.boundingBox();
    const panel = await this.backdropPanel.boundingBox();
    if (!overlay || !panel) throw new Error('Backdrop dialog not rendered');
    await this.backdropDialog.click({
      position: {
        x: (panel.x - overlay.x) / 2,
        y: panel.y - overlay.y + panel.height / 2,
      },
    });
  }
}