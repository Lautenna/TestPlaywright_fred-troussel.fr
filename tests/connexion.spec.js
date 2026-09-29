import { test, expect, CSS } from '@playwright/test'

import { InlineObject3FromJSON, MailSlurp } from 'mailslurp-client';
import { PageAValider } from './data_test/navigation.data.js';
import { optionAValider, optionAValiderStandard } from './data_test/configurateur.data.js';
import { containsSpaceInsensitive } from './utils/helper.js'
import { ContactForm } from '../pages/components/ContactForm.js'



test('has title', async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');
    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})


for (const { cas, nav, url, titre, } of PageAValider) {
    test(`TC_CONN_001_toutes_les_pages_du_site_fonctionne ccc- ${cas} `, async ({ page }) => {
        await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
            await page.goto('https://fred-troussel.fr/');
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
        await page.goto('https://fred-troussel.fr/');
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



test("TC_CONT_002_Choix_des_options_et_demande_de_contact_avec_ces_options - ${cas}", async ({ page }) => {
    const ms = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
    test.setTimeout(120_000);
    await test.step('Étant donné un visiteur peut choisir ces options', async () => {
        for (const i of optionAValiderStandard) {
            await page.goto(i.url);

            for (const j of i.optionClick) {
                await (page.locator(j)).dispatchEvent('click');
            }

            await (page.getByRole('button', { name: 'Suivant' })).click();

            for (const j of i.optionVerifier) {
                await expect(page.locator('#product-recap-container')).toContainText(j);
            }

            await test.step('Étant donné un visiteur peut faire un demande de contact', async () => {
                const inbox = await ms.createInbox();

                const myContactForm = new ContactForm(page)
                myContactForm.remplirChamps();
                myContactForm.sendForm()

                const emailRecu = await ms.waitForLatestEmail(inbox.id, 30_000, true);
                for (const nomOptionVerifier of i.optionVerifier) {
                    expect(
                        containsSpaceInsensitive(emailRecu.body.replaceAll(':', '').replaceAll("Prix", "Total").replaceAll("&#039;", "'"), nomOptionVerifier)
                    ).toBeTruthy()
                }
            })
        }
    })
})


test('TC_CONT_001_reception_du_mail_de_contact', async ({ page }) => {
    const ms = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
    const inbox = await ms.getInbox('2e3dfe89-6ed7-4f6f-8dc0-0b18872055f3');

    const myContactForm = new ContactForm(page)
    myContactForm.remplirChamps();
    myContactForm.sendForm()


    const emailRecu = await ms.waitForLatestEmail(inbox.id, 30_000, true);
    expect(emailRecu).toBeDefined()
});


// test('TC_CONT_001_reception_du_mail_de_contact', async ({ page }) => {
//     const ms = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY });
//     const inbox = await ms.getInbox('2e3dfe89-6ed7-4f6f-8dc0-0b18872055f3');

//     await page.goto('https://fred-troussel.fr/');
//     await (page.locator('#contact_nom')).fill(DemandeD
// eContact.nom)
//     await (page.locator('#contact_email')).fill(DemandeDeContact.email)
//     await (page.locator('#contact_telephone')).fill(DemandeDeContact.telephone)
//     await (page.locator('#contact_message')).fill(DemandeDeContact.message)
//     await (page.getByRole('button', { name: 'Envoyer ma demande' })).click();

//     const emailRecu = await ms.waitForLatestEmail(inbox.id, 30_000, true);
//     expect(emailRecu).toBeDefined()
// });

