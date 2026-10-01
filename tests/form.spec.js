import { test, expect, CSS } from '@playwright/test'
import { InlineObject3FromJSON, MailSlurp } from 'mailslurp-client';
import { containsSpaceInsensitive } from './utils/helper.js'
import { ContactForm } from '../pages/components/ContactForm.js'
import { optionAValider, optionAValiderStandard } from './data_test/configurateur.data.js';

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



