import { test, expect, CSS } from '@playwright/test'
import { PageAValider } from './data_test/navigation.data.js';
import { optionAValider} from './data_test/configurateur.data.js';
import { ReseauSocial } from '../pages/components/ReseauSociaux.js'


test.describe('Fonctionnement des pages', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://fred-troussel.fr/')
    });

    test('has title', async ({ page }) => {
        await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
    })


    for (const { cas, nav, url, titre, } of PageAValider) {
        test(`TC_CONN_001_Toutes_les_pages_du_site_fonctionnent ${cas}`, async ({ page }) => {
            await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
                await (page.getByTestId(nav)).click();
                await expect(page).toHaveURL(url)
                await expect(page.locator('h1')).toContainText(titre);
            })
        })
    }


    test("TC_CONN_002_Telechargement_du_catalogue", async ({ page }) => {
        await test.step('Étant donné un visiteur peut télécharger le catalogue', async () => {
            await page.goto('https://fred-troussel.fr/');
            const downloadPromise = page.waitForEvent('download');
            await (page.getByText('Voir notre catalogue complet')).click();
            const download = await downloadPromise;
            expect(download.url()).toContain('https://fred-troussel.fr/catalogue-2026.pdf')
        })
    })

})

test("TC_CONF_001_Les_options_ajustent_le_prix_pour_chaque_categorie_d_article", async ({ page }) => {
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



test('TC_RESEAU_001_Redirection_vers_les_reseaux_sociaux_au_clic', async ({ page }) => {

    const myReseauSocial = new ReseauSocial(page);
    await test.step('Étant donné un visiteur peut cliquer sur le logo Facebook en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        const facebookPage = await myReseauSocial.redirectionFacebook()
        await expect(facebookPage).toHaveURL("https://www.facebook.com/mobilierfredtroussel")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo instagram en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        // const instagramPage = await myReseauSocial.redirectionInstagram()
        await expect(myReseauSocial.bouttonInstagram).toBeVisible()
        // Pas possible, car lien connexion qui s'affiche.
        //await expect(instagramPage).toHaveURL("https://www.instagram.com/fredtroussel")

    })

    await test.step('Étant donné un visiteur peut cliquer sur le logo site du developpeur en bas de page', async () => {
        await page.goto('https://fred-troussel.fr/');
        await myReseauSocial.redirectionSiteDeveloppeur()
        await expect(page).toHaveURL("https://maximemougel.dev/")

    })

})

