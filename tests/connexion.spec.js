import { test, expect } from '@playwright/test'
import { beforeEach } from 'node:test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');
});

test('has title', async ({ page }) => {
    //     // await page.goto('https://fred-troussel.fr/');
    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})

test("TC_CONN_001_toutes_les_pages_du_site_fonctionne", async ({ page }) => {
    await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
        await (page.locator('nav div.container')).getByText('Tables').click();
        await expect(page).toHaveURL('/tables-rectangulaires')
        await expect(page.locator('h1')).toContainText('Tables Rectangulaires');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des bahus via la nav barre', async () => {
        await (page.locator('nav div.container')).getByText('Bahuts').click();
        await expect(page).toHaveURL('/bahuts-bas')
        await expect(page.locator('h1')).toContainText('Bahuts bas');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des vasseliers via la nav barre', async () => {
        await (page.locator('nav div.container')).getByText('Vaisseliers').click();;
        await expect(page).toHaveURL('/vaisseliers')
        await expect(page.locator('h1')).toContainText('Vaisseliers');
    })

    await test.step('Étant donné un visiteur peut aller sur la page des cuisines via la nav barre', async () => {
        await (page.locator('nav div.container')).getByText('Cuisines').click();
        await expect(page).toHaveURL('/cuisines')
        await expect(page.locator('h1')).toContainText('Cuisines');
    })

    await test.step('Étant donné un visiteur peut aller sur la page divers via la nav barre', async () => {
        await (page.locator('nav div.container')).getByText('Divers').click();
        await expect(page).toHaveURL('/divers')
        await expect(page.locator('h1')).toContainText('Divers');
    })
})


test("TC_CONN_002_telechargement_catalogue", async ({ page }) => {
    await test.step('Étant donné un visiteur peut télécharger le catalogue', async () => {
        const popupPromise = page.waitForEvent('popup');
        await (page.getByText('Voir notre catalogue complet')).click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL('/catalogue-2026.pdf')
    })
})


