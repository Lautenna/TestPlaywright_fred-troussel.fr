import { test, expect, CSS } from '@playwright/test'
import { PageAValider } from './data_test/navigation.data.js';
import { optionAValider, optionAValiderStandard } from './data_test/configurateur.data.js';
import { ReseauSocial } from '../pages/components/ReseauSociaux.js'
import { beforeEach } from 'node:test';


test.describe('Fonctionnement des pages', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://fred-troussel.fr/')
    });

    test('has title', async ({ page }) => {
        await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
    })


    for (const { cas, nav, url, titre, } of PageAValider) {
        test(`TC_CONN_001_toutes_les_pages_du_site_fonctionne ${cas} `, async ({ page }) => {
            await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
                await (page.getByTestId(nav)).click();
                await expect(page).toHaveURL(url)
                await expect(page.locator('h1')).toContainText(titre);
            })
        })
    }


    test("TC_CONN_002_telechargement_catalogue", async ({ page }) => {
        await test.step('Étant donné un visiteur peut télécharger le catalogue', async () => {
            await page.goto('https://fred-troussel.fr/');
            const downloadPromise = page.waitForEvent('download');
            await (page.getByText('Voir notre catalogue complet')).click();
            const download = await downloadPromise;
            expect(download.url()).toContain('https://fred-troussel.fr/catalogue-2026.pdf')
        })
    })

})

test("TC_CONF_001_Table_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles - ${cas}", async ({ page }) => {
    await test.step('Étant donné un visiteur peut choisir ces options standard et sur mesure', async () => {
        for (const i of optionAValider) {
            await page.goto(i.url);

            for (const j of i.optionClick) {
                await (page.locator(j)).dispatchEvent("click");
            }

            await (page.getByRole('button', { name: 'Suivant' })).click();

            for (const j of i.optionVerifier) {
                await expect(page.locator('#product-recap-container')).toContainText(j);
            }

        }
    })
});


// test("TC_CONF_001_Table_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles - ${cas}", async ({ page }) => {
//     await test.step('Étant donné un visiteur peut choisir ces options standard et sur mesure', async () => {
//         for (const i of optionAValider) {
//             await page.goto(i.url);

//             for (const j of i.optionClick) {
//                 await (page.getByText(j)).click();
//             }

//             await (page.getByRole('button', { name: 'Suivant' })).click();

//             for (const j of i.optionVerifier) {
//                 await expect(page.locator('#product-recap-container')).toContainText(j);
//             }

//         }
//     })
// })



test('TC_RESEAU_001_renvoi_sur_le_resau_social_quand_on_click', async ({ page }) => {

    const myReseauSocial = new ReseauSocial(page);
    await test.step('Étant donné un visiteur peut cliquer sur le logo Facebook en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        const facebookPage = await myReseauSocial.redirectionFacebook()
        await expect(facebookPage).toHaveURL("https://www.facebook.com/mobilierfredtroussel")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo instagram en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        const instagramPage = await myReseauSocial.redirectionInstagram()
        await expect(instagramPage).toHaveURL("https://www.instagram.com/fredtroussel")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo site du developpeur en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        myReseauSocial.redirectionSiteDeveloppeur()
        await expect(page).toHaveURL("https://maximemougel.dev/")

    })

})

