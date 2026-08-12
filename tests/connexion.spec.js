import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');

    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})

test("TC_CONN_001_toutes_les_pages_du_site_fonctionne", async ({ page }) => {
    await test.step('Étant donné un visiteur peut aller sur la page des tables', async () => {
        await page.goto('https://fred-troussel.fr/tables-rectangulaires');
        await expect(page.locator('h1')).toContainText('Tables Rectangulaires');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des bahus', async () => {
        await page.goto('https://fred-troussel.fr/bahuts-bas');
        await expect(page.locator('h1')).toContainText('Bahuts bas');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des vasseliers', async () => {
        await page.goto('https://fred-troussel.fr/vaisseliers');
        await expect(page.locator('h1')).toContainText('Vaisseliers');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des cuisines', async () => {
        await page.goto('https://fred-troussel.fr/cuisines');
        await expect(page.locator('h1')).toContainText('Cuisines');
    })

    await test.step('Étant donné un visiteur peut aller sur la page divers', async () => {
        await page.goto('https://fred-troussel.fr/divers');
        await expect(page.locator('h1')).toContainText('Divers');
    })
})