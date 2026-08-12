import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');

    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})
