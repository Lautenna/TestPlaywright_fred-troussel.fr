import { test, expect, CSS } from '@playwright/test'
import { CookiesPopup } from '../pages/components/CookiesPopup.js';
import { beforeEach } from 'node:test';

test.describe('CookiesPopup', () => {
    let cookiesVisible;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://fred-troussel.fr/')
        cookiesVisible = new CookiesPopup(page)
    });

    test('TC_COOK_001_Popup_cookies_affichee_a_la_premiere_visite', async ({ page }) => {
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_002_Popup_cookies_masquee_apres_rechargement', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await page.reload();
        await expect(cookiesVisible.popup).not.toBeVisible()
    })

    test('TC_COOK_003_Popup_cookies_reaffichee_via_gestion_des_cookies', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await cookiesVisible.gererCookies()
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_004_Refus_des_cookies_enregistre_denied_dans_local_storage', async ({ page }) => {
        cookiesVisible.refuserCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toEqual('denied')
    })
    test('TC_COOK_005_Acceptation_des_cookies_enregistre_granted_dans_local_storage', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toEqual('granted')
    })
    test('TC_COOK_006_Local_storage_vide_avant_tout_choix', async ({ page }) => {
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toBeNull()
    })
})
