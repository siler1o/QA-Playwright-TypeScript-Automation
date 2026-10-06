import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

export class FormsPage {
  // ---------- F01 Login ----------
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly loginEmailError: Locator;
  readonly loginResult: Locator;

  // ---------- F02 Personal Details ----------
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly phone: Locator;
  readonly dob: Locator;
  readonly genderMale: Locator;
  readonly genderFemale: Locator;
  readonly genderOther: Locator;
  readonly saveDetailsButton: Locator;
  readonly personalResetButton: Locator;
  readonly personalResult: Locator;
  // Step 7 error locators: names follow the page's pattern (error-login-email,
  // error-confirm-password) but were NOT in the HTML you sent. Verify these.
  readonly firstNameError: Locator;
  readonly lastNameError: Locator;
  readonly phoneError: Locator;
  readonly dobError: Locator;
  readonly genderError: Locator;

  // ---------- F05 Account Setup ----------
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly termsCheckbox: Locator;
  readonly accountSubmitButton: Locator;
  readonly confirmPasswordError: Locator;
  readonly accountSuccess: Locator;
  readonly fillAgainButton: Locator;

  constructor(private readonly page: Page) {
    // F01
    this.loginEmail = page.getByTestId('input-login-email');
    this.loginPassword = page.locator('#login-password'); // no test id on this input
    this.loginButton = page.getByTestId('btn-login-submit');
    this.loginEmailError = page.getByTestId('error-login-email');
    this.loginResult = page.getByTestId('result-login');

    // F02
    this.firstName = page.getByTestId('input-first-name');
    this.lastName = page.getByTestId('input-last-name');
    this.phone = page.getByTestId('input-phone');
    this.dob = page.getByTestId('input-dob');
    this.genderMale = page.getByTestId('radio-gender-male');
    this.genderFemale = page.getByTestId('radio-gender-female');
    this.genderOther = page.getByTestId('radio-gender-other');
    this.saveDetailsButton = page.getByTestId('btn-personal-submit');
    this.personalResetButton = page.getByTestId('btn-personal-reset');
    this.personalResult = page.getByTestId('result-personal');
    this.firstNameError = page.getByTestId('error-first-name');
    this.lastNameError = page.getByTestId('error-last-name');
    this.phoneError = page.getByTestId('error-phone');
    this.dobError = page.getByTestId('error-dob');
    this.genderError = page.getByTestId('error-gender');

    // F05
    this.password = page.getByTestId('input-password');
    this.confirmPassword = page.getByTestId('input-confirm-password');
    this.termsCheckbox = page.getByTestId('checkbox-terms');
    this.accountSubmitButton = page.getByTestId('submit-form-btn');
    this.confirmPasswordError = page.getByTestId('error-confirm-password');
    this.accountSuccess = page.getByTestId('form-success-msg');
    this.fillAgainButton = page.getByTestId('btn-fill-again');
  }

  async open(): Promise<void> {
    await this.page.goto('/practice/forms');
    await this.page.waitForLoadState('networkidle');
  }

  // ---------- F02 actions ----------
  async fillPersonalDetails(first: string, last: string, phone: string, dob: string): Promise<void> {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.phone.fill(phone);
    await this.dob.fill(dob); // date input needs YYYY-MM-DD
  }

  async chooseMale(): Promise<void> {
    await this.genderMale.check();
  }

  async savePersonalDetails(): Promise<void> {
    await this.saveDetailsButton.click();
  }

  async resetPersonalDetails(): Promise<void> {
    await this.personalResetButton.click();
  }

  // ---------- F02 assertions ----------
  async assertPersonalFormVisible(): Promise<void> {
    await expect(this.firstName).toBeVisible();
    await expect(this.lastName).toBeVisible();
    await expect(this.phone).toBeVisible();
    await expect(this.dob).toBeVisible();
    await expect(this.genderMale).toBeVisible();
    await expect(this.saveDetailsButton).toBeVisible();
    await expect(this.personalResetButton).toBeVisible();
  }

  async assertPersonalValues(first: string, last: string, phone: string, dob: string): Promise<void> {
    await expect(this.firstName).toHaveValue(first);
    await expect(this.lastName).toHaveValue(last);
    await expect(this.phone).toHaveValue(phone);
    await expect(this.dob).toHaveValue(dob);
  }

  async assertOnlyMaleChecked(): Promise<void> {
    await expect(this.genderMale).toBeChecked();
    await expect(this.genderFemale).not.toBeChecked();
    await expect(this.genderOther).not.toBeChecked();
  }

  async assertSavedName(first: string): Promise<void> {
    await expect(this.personalResult).toContainText(first);
  }

  async assertPersonalEmpty(): Promise<void> {
    await expect(this.firstName).toHaveValue('');
    await expect(this.lastName).toHaveValue('');
    await expect(this.phone).toHaveValue('');
    await expect(this.dob).toHaveValue('');
    await expect(this.genderMale).not.toBeChecked();
    await expect(this.genderFemale).not.toBeChecked();
    await expect(this.genderOther).not.toBeChecked();
  }

  async assertPersonalNotAccepted(): Promise<void> {
    // result element is removed from the DOM after Reset, so assert on count instead
    await expect(this.personalResult.filter({ hasText: 'Saved' })).toHaveCount(0);
  }

  async assertPersonalRequiredErrors(): Promise<void> {
    await expect(this.firstNameError).toBeVisible();
    await expect(this.lastNameError).toBeVisible();
    await expect(this.phoneError).toBeVisible();
    await expect(this.dobError).toBeVisible();
    await expect(this.genderError).toBeVisible();
  }

  // ---------- F01 ----------
  async login(email: string, password: string): Promise<void> {
    await this.loginEmail.fill(email);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
  }

  async assertInvalidEmailRejected(): Promise<void> {
    await expect(this.loginEmailError).toHaveText('Enter a valid email address.');
    await expect(this.loginResult.filter({ hasText: 'Login successful' })).toHaveCount(0);
  }

  // ---------- F05 ----------
  async fillAccountSetup(password: string, confirm: string): Promise<void> {
    await this.password.fill(password);
    await this.confirmPassword.fill(confirm);
    await this.termsCheckbox.check();
  }

  async submitAccountSetup(): Promise<void> {
    await this.accountSubmitButton.click();
  }

  async assertPasswordMismatch(): Promise<void> {
    await expect(this.confirmPasswordError).toHaveText('Passwords do not match.');
    await expect(this.accountSuccess).toBeHidden();
  }
}