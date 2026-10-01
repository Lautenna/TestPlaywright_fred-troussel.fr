import { test, expect, CSS } from '@playwright/test'
import { CookiesPopup } from '../pages/components/CookiePopup.js';
import { beforeEach } from 'node:test';

test.describe('CookiesPopup', () => {
    let cookiesVisible;

    test.beforeEach(async ({ page }) => {
        await page.goto('https://fred-troussel.fr/')
        cookiesVisible = new CookiesPopup(page)
    });

    test('TC_COOK_001_PopUp_Cookie_Lors_De_La_Connextion_Au_Site', async ({ page }) => {
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_002_PopUp_Cookie_Disparait_Quand_On_Refresh', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await page.reload();
        await expect(cookiesVisible.popup).not.toBeVisible()
    })

    test('TC_COOK_003_PopUp_Cookie_Apparait_Gestion_Cookies', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        await cookiesVisible.gererCookies()
        await expect(cookiesVisible.popup).toBeVisible()
    })

    test('TC_COOK_004_Refus_Cookies_Local_Storage', async ({ page }) => {
        cookiesVisible.refuserCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toEqual('denied')
    })
    test('TC_COOK_005_Accepter_Cookies_Local_Storage', async ({ page }) => {
        cookiesVisible.accepterCookies()
        await expect(cookiesVisible.popup).not.toBeVisible()
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toEqual('granted')
    })
    test('TC_COOK_006_Cookies_Null_Local_Storage', async ({ page }) => {
        const cookiesLocalStorage = await cookiesVisible.recupererCookiesLocalStorage()
        await expect(cookiesLocalStorage).toBeNull()
    })
})
