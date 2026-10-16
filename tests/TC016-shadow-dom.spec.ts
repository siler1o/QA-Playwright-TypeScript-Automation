import { test, expect } from '@playwright/test';
import { ShadowDomPage } from '../pages/ShadowDomPage';

test('TC016 - locate controls in open shadow roots', async ({ page }) => {
  const shadow = new ShadowDomPage(page);
  let countBefore: number;
  let host1ClassBefore: string;
  let outerClassBefore: string;

  await test.step('Step 1: inner button reachable through the open host', async () => {
    await shadow.open();
    await expect(shadow.basicHost).toHaveAttribute('data-shadow-mode', 'open');
    await expect(shadow.basicButton).toBeVisible();
  });

  await test.step('Step 2: one click increments the count by exactly one', async () => {
    countBefore = Number(await shadow.clickCount.innerText());
    await shadow.clickUntilResultChanges(shadow.basicButton, shadow.basicResult, 'Shadow button not clicked');
    await expect(shadow.clickCount).toHaveText(String(countBefore + 1));
    await expect(shadow.basicResult).toHaveText('Shadow button clicked 1 time(s) ✓');
  });

  await test.step('Step 3: host-1 and host-2 are distinct, record state', async () => {
    await expect(shadow.host1.getByRole('button')).toHaveText('Activate Host 1');
    await expect(shadow.host2.getByRole('button')).toHaveText('Activate Host 2');
    host1ClassBefore = (await shadow.host1.getAttribute('class'))!;
    await expect(shadow.host2).not.toHaveClass(/Activated/);
  });

  await test.step('Step 4: click host-2 button, only host-2 changes', async () => {
    await shadow.host2.getByRole('button').click();
    await expect(shadow.host2).toHaveClass(/Activated/);
    await expect(shadow.host1).toHaveAttribute('class', host1ClassBefore);
    await expect(shadow.hostsResult).toHaveText('Host 2 activated ✓');
  });

  await test.step('Step 5: nested button visible through two shadow roots', async () => {
    await expect(shadow.innerHost).toBeAttached();
    await expect(shadow.innerButton).toBeVisible();
    outerClassBefore = (await shadow.outerHost.getAttribute('class'))!;
  });

  await test.step('Step 6: nested button responds, outer host unchanged', async () => {
    await shadow.clickUntilResultChanges(shadow.innerButton, shadow.nestedResult, 'Inner shadow not interacted');
    await expect(shadow.nestedResult).toHaveText('Inner shadow activated ✓');
    await expect(shadow.outerHost).toHaveAttribute('class', outerClassBefore);
  });

  await test.step('Step 7: fill name and choose role in the same shadow root', async () => {
    await shadow.nameInput.fill('Ada Lovelace');
    await shadow.roleSelect.selectOption('qa');
    await expect(shadow.nameInput).toHaveValue('Ada Lovelace');
    await expect(shadow.roleSelect).toHaveValue('qa');
  });

  await test.step('Step 8: submit shadow form, confirmation appears', async () => {
    await shadow.submitButton.click();
    // the site renders the confirmation in the scenario result next to the host, not inside the shadow root
    await expect(shadow.formResult).toHaveText('Submitted: Ada Lovelace (qa) ✓');
  });
});
