import { test, expect } from '@playwright/test'

import { MailSlurp } from 'mailslurp-client';
import { PageAValider } from './data_test/navigation.data.js';
import { optionAValider, optionAValiderStandard } from './data_test/configurateur.data.js';
import { DemandeDeContact } from './data_test/contact.data.js';

test.beforeEach(async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');
});

test('has title', async ({ page }) => {
    // await page.goto('https://fred-troussel.fr/');
    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})



for (const { cas, nav, url, titre, } of PageAValider) {
    test(`TC_CONN_001_toutes_les_pages_du_site_fonctionne ccc- ${cas} `, async ({ page }) => {
        await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
            await (page.getByTestId(nav)).click();
            await expect(page).toHaveURL(url)
            await expect(page.locator('h1')).toContainText(titre);
        })
    })
}


// test("TC_CONN_001_toutes_les_pages_du_site_fonctionne", async ({ page }) => {
//     await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
//         await (page.locator('nav div.container')).getByText('Tables').click();
//         await expect(page).toHaveURL('/tables-rectangulaires')
//         await expect(page.locator('h1')).toContainText('Tables');
//     })

//     await test.step('Étant donné un visiteur peut aller sur la page des bahus via la nav barre', async () => {
//         await (page.locator('nav div.container')).getByText('Bahuts').click();
//         await expect(page).toHaveURL('/bahuts-bas')
//         await expect(page.locator('h1')).toContainText('Bahuts');
//     })

//     await test.step('Étant donné un visiteur peut aller sur la page des vasseliers via la nav barre', async () => {
//         await (page.locator('nav div.container')).getByText('Vaisseliers').click();;
//         await expect(page).toHaveURL('/vaisseliers')
//         await expect(page.locator('h1')).toContainText('Vaisseliers');
//     })

//     await test.step('Étant donné un visiteur peut aller sur la page des cuisines via la nav barre', async () => {
//         await (page.locator('nav div.container')).getByText('Cuisines').click();
//         await expect(page).toHaveURL('/cuisines')
//         await expect(page.locator('h1')).toContainText('Cuisines');
//     })

//     await test.step('Étant donné un visiteur peut aller sur la page divers via la nav barre', async () => {
//         await (page.locator('nav div.container')).getByText('Divers').click();
//         await expect(page).toHaveURL('/divers')
//         await expect(page.locator('h1')).toContainText('Divers');
//     })
// })


test("TC_CONN_002_telechargement_catalogue", async ({ page }) => {
    await test.step('Étant donné un visiteur peut télécharger le catalogue', async () => {
        const downloadPromise = page.waitForEvent('download');
        await (page.getByText('Voir notre catalogue complet')).click();
        const download = await downloadPromise;
        expect(download.url()).toContain('https://fred-troussel.fr/catalogue-2026.pdf')
    })
})



test("TC_CONF_001_Table_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles - ${cas}", async ({ page }) => {
    await test.step('Étant donné un visiteur peut choisir ces options standard et sur mesure', async () => {
        for (const i of optionAValider) {
            await page.goto(i.url);

            for (const j of i.optionClick) {
                await (page.getByText(j)).click();
            }

            await (page.getByRole('button', { name: 'Suivant' })).click();

            for (const j of i.optionVerifier) {
                await expect(page.locator('#product-recap-container')).toContainText(j);
            }

        }
    })
})


test("TC_CONT_002_Choix_des_options_et_demande_de_contact_avec_ces_options - ${cas}", async ({ page }) => {
    const ms = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });

    await test.step('Étant donné un visiteur peut choisir ces options', async () => {
        for (const i of optionAValiderStandard) {
            await page.goto(i.url);

            for (const j of i.optionClick) {
                await (page.getByText(j)).click();
            }

            await (page.getByRole('button', { name: 'Suivant' })).click();

            for (const j of i.optionVerifier) {
                await expect(page.locator('#product-recap-container')).toContainText(j);
            }

            await test.step('Étant donné un visiteur peut faire un demande de contact', async () => {
                const inbox = await ms.getInbox('2e3dfe89-6ed7-4f6f-8dc0-0b18872055f3');

                await (page.locator('#contact_nom')).fill(DemandeDeContact.nom)
                await (page.locator('#contact_email')).fill(DemandeDeContact.email)
                await (page.locator('#contact_telephone')).fill(DemandeDeContact.telephone)
                await (page.locator('#contact_message')).fill(DemandeDeContact.message)
                await (page.getByRole('button', { name: 'Envoyer ma demande' })).click();

                const emailRecu = await ms.waitForLatestEmail(inbox.id, 30_000, true);
                for (const nomOptionVerifier of i.optionVerifier) {
                    expect(emailRecu.body).toContain(nomOptionVerifier)
                }

            })
        }
    })
})


test('TC_CONT_001_reception_du_mail_de_contact', async ({ page }) => {
    const ms = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
    const inbox = await ms.getInbox('2e3dfe89-6ed7-4f6f-8dc0-0b18872055f3');

    await page.goto('https://fred-troussel.fr/');
    await (page.locator('#contact_nom')).fill(DemandeDeContact.nom)
    await (page.locator('#contact_email')).fill(DemandeDeContact.email)
    await (page.locator('#contact_telephone')).fill(DemandeDeContact.telephone)
    await (page.locator('#contact_message')).fill(DemandeDeContact.message)
    await (page.getByRole('button', { name: 'Envoyer ma demande' })).click();

    const emailRecu = await ms.waitForLatestEmail(inbox.id, 30_000, true);
    expect(emailRecu).toBeDefined()
});


// test("TC_CONF_001_Table_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {
//     await test.step('Étant donné un visiteur fait un choix d\'option sur la page des tables', async () => {
//         await page.goto('https://fred-troussel.fr/tables-rectangulaires');

//         await (page.getByText('200cm')).click();
//         await (page.getByText("Jusqu' à 110cm Inclus")).click();
//         await (page.getByText('Bords bruts Inclus')).click();
//         await (page.getByText('Y Inclus')).click();
//         await (page.getByText('2 rallonges 45cm')).click();
//         await (page.getByRole('button', { name: 'Suivant' })).click();

//         await expect(page.locator('#product-recap-container')).toContainText('Longueur de plateau 200cm (1 500 €)');
//         await expect(page.locator('#product-recap-container')).toContainText("Largeur de plateau Jusqu' à 110cm (inclus)");
//         await expect(page.locator('#product-recap-container')).toContainText('Finitions plateau Bords bruts (inclus)');
//         await expect(page.locator('#product-recap-container')).toContainText('Pieds de table Y (inclus)');
//         await expect(page.locator('#product-recap-container')).toContainText('Suppléments 2 rallonges 45cm (+500 €)');
//         await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 2 000 €']);
//     })

// await test.step('Étant donné un visiteur fait un choix d\'option sur la page des tables avec largeur sur mesure', async () => {
//     await page.goto('https://fred-troussel.fr/tables-rectangulaires');

//     await (page.getByText('200cm')).click();
//     await (page.getByText("+ de 110cm Sur mesure")).click();
//     await (page.getByText('Bords bruts Inclus')).click();
//     await (page.getByText('U motif laser +250 €')).click();
//     await (page.getByText('Teinte vintage')).click();
//     await (page.getByRole('button', { name: 'Suivant' })).click();

//     await expect(page.locator('#product-recap-container')).toContainText('Longueur de plateau 200cm (1 500 €)');
//     await expect(page.locator('#product-recap-container')).toContainText("Largeur de plateau + de 110cm (sur mesure)");
//     await expect(page.locator('#product-recap-container')).toContainText('Finitions plateau Bords bruts (inclus)');
//     await expect(page.locator('#product-recap-container')).toContainText('U motif laser (+250 €)');
//     await expect(page.locator('#product-recap-container')).toContainText('Suppléments Teinte vintage (inclus)');
//     await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
// })

// test("TC_CONF_002_Bahus_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {

//     await test.step('Étant donné un visiteur fait un choix d\'option sur la page des bahus', async () => {
//         await page.goto('https://fred-troussel.fr/bahuts-bas');

//         await (page.getByText('150cm 2 000 €')).click();
//         await (page.getByText("Panneau coulissant Gratuit")).click();
//         await (page.getByText("Panneau à poussoir Gratuit")).click();
//         await (page.getByRole('button', { name: 'Suivant' })).click();


//         await expect(page.locator('#product-recap-container')).toContainText('Longueur 150cm (2 000 €)');
//         await expect(page.locator('#product-recap-container')).toContainText("Configuration Panneau coulissant (inclus)");
//         await expect(page.locator('#product-recap-container')).toContainText("Configuration Panneau à poussoir (inclus)");
//         await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 2 000 €']);
//     })

// await test.step('Étant donné un visiteur fait un choix d\'option sur la page des bahus avec config sur mesure', async () => {
//     await page.goto('https://fred-troussel.fr/bahuts-bas');

//     await (page.getByText('150cm 2 000 €')).click();
//     await (page.getByText("Panneau coulissant Gratuit")).click();
//     await (page.getByText("Avec motif Sur mesure")).click();
//     await (page.getByRole('button', { name: 'Suivant' })).click();

//     await expect(page.locator('#product-recap-container')).toContainText('Longueur 150cm (2 000 €)');
//     await expect(page.locator('#product-recap-container')).toContainText("Configuration Avec motif (sur mesure)");
//     await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
// })
// // })


// test("TC_CONF_003_Vaisselier_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {
//     await test.step('Étant donné un visiteur fait un choix d\'option sur la page des vaisseliers', async () => {
//         await page.goto('https://fred-troussel.fr/vaisseliers');

//         await (page.getByText('1m50 3 000 €')).click();
//         await (page.getByText("Peinture blanche Inclus")).click();
//         await (page.getByText("Porte en grille Gratuit")).click();
//         await (page.getByRole('button', { name: 'Suivant' })).click();

//         await expect(page.locator('#product-recap-container')).toContainText('Longueur 1m50 (3 000 €)');
//         await expect(page.locator('#product-recap-container')).toContainText("Couleur de structure Peinture blanche (inclus)");
//         await expect(page.locator('#product-recap-container')).toContainText('Partie inférieure Porte en grille (inclus)');
//         await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 3 000 €']);
//     })

//     await test.step('Étant donné un visiteur fait un choix d\'option sur la page des vaisseliers avec confi sur mesure', async () => {
//         await page.goto('https://fred-troussel.fr/vaisseliers');

//         await (page.getByText('1m50 3 000 €')).click();
//         await (page.getByText("Peinture au choix Sur mesure")).click();
//         await (page.getByText("Placards suspendus Sur mesure")).click();
//         await (page.getByText("Sans tiroirs Sur mesure")).click();
//         await (page.getByText("Autre Sur mesure")).click();
//         await (page.getByRole('button', { name: 'Suivant' })).click();

//         await expect(page.locator('#product-recap-container')).toContainText('Longueur 1m50 (3 000 €)');
//         await expect(page.locator('#product-recap-container')).toContainText("Couleur de structure Peinture au choix (sur mesure)");
//         await expect(page.locator('#product-recap-container')).toContainText("Partie supérieure Placards suspendus (sur mesure)");
//         await expect(page.locator('#product-recap-container')).toContainText("Tiroirs Sans tiroirs (sur mesure)");
//         await expect(page.locator('#product-recap-container')).toContainText('Partie inférieure Autre (sur mesure)');
//         await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
//     })
// })
