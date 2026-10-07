import { test, expect } from '@playwright/test';
import { DatePickerPage } from '../pages/DatePickerPage';

function dayBefore(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

test('TC008 - date entry, calendar selection, and constraints', async ({ page }) => {
  const dp = new DatePickerPage(page);
  let minDate: string;

  await test.step('Step 1: native date input is enabled', async () => {
    await dp.open();
    await expect(dp.basicInput).toBeEnabled();
    await expect(dp.basicInput).toHaveAttribute('type', 'date');
  });

  await test.step('Step 2: fill ISO date, value matches exactly', async () => {
    await dp.basicInput.fill('2026-10-15');
    await expect(dp.basicInput).toHaveValue('2026-10-15');
    await expect(dp.basicResult).toHaveText('2026-10-15');
  });

  await test.step('Step 3: calendar grid becomes visible', async () => {
    await expect(dp.calendarResult).toHaveText('Calendar not opened');
    await dp.openCalendar();
    await expect(dp.calendarPanel).toBeVisible();
    await expect(dp.calendarGrid).toBeVisible();
    await expect(dp.calendarTrigger).toHaveAttribute('aria-expanded', 'true');
  });

  await test.step('Step 4: pick a day, display matches it', async () => {
    const day = dp.dayButtons.nth(14); // 15th of whichever month is shown
    await expect(day).toBeEnabled();
    const chosen = await day.getAttribute('data-date');
    await day.click();
    await expect(dp.calendarResult).toHaveText(`Selected: ${chosen}`);
    await expect(dp.calendarTrigger).toContainText(chosen!);
    await expect(dp.calendarPanel).toBeHidden();
  });

  await test.step('Step 5: constrained input has a valid minimum', async () => {
    minDate = (await dp.constrainedInput.getAttribute('min'))!;
    expect(minDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(minDate).toBe('2025-06-01');
  });

  await test.step('Step 6: date before minimum is rejected', async () => {
    if (!(await dp.supportsNativeDate())) {
    test.info().annotations.push({
        type: 'browser limitation',
        description: 'No native date input in this browser build; min-date validation not enforced',
    });
    return;
    }
    const tooEarly = dayBefore(minDate);
    await dp.constrainedInput.fill(tooEarly);
    expect(await dp.isRangeUnderflow()).toBe(true);
    await expect(dp.constrainedResult).toHaveText(`Invalid: ${tooEarly} is out of range`);
  });
});