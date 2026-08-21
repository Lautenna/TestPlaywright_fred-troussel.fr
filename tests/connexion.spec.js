import { test, expect } from '@playwright/test'
import { beforeEach } from 'node:test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://fred-troussel.fr/');
});

test('has title', async ({ page }) => {
    //     // await page.goto('https://fred-troussel.fr/');
    await expect(page.getByText('— Mobilier Fred Troussel —')).toBeVisible();
})


const PageAValider = [
    { cas: 'Table', url: '/tables-rectangulaires', titre: 'Tables', },
    { cas: 'Bahut', url: '/bahuts-bas', titre: 'Bahuts', },
    { cas: 'Vaisseliers', url: '/vaisseliers', titre: 'Vaisseliers', },
    { cas: 'Cuisines', url: '/cuisines', titre: 'Cuisines' },
    { cas: 'Divers', url: '/divers', titre: 'Divers', },

]

for (const { cas, url, titre, } of PageAValider) {
    test(`TC_CONN_001_toutes_les_pages_du_site_fonctionne - ${cas} `, async ({ page }) => {
        await test.step('Étant donné un visiteur peut aller sur la page des tables via la nav barre', async () => {
            await (page.locator('nav div.container')).getByText(titre).click();
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
        const popupPromise = page.waitForEvent('popup');
        await (page.getByText('Voir notre catalogue complet')).click();
        const popup = await popupPromise;
        await expect(popup).toHaveURL('/catalogue-2026.pdf')
    })
})

test("TC_CONF_001_Table_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {
    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des tables', async () => {
        await page.goto('https://fred-troussel.fr/tables-rectangulaires');

        await (page.getByText('200cm')).click();
        await (page.getByText("Jusqu' à 110cm Inclus")).click();
        await (page.getByText('Bords bruts Inclus')).click();
        await (page.getByText('Y Inclus')).click();
        await (page.getByText('2 rallonges 45cm')).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur de plateau 200cm (1 500 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Largeur de plateau Jusqu' à 110cm (inclus)");
        await expect(page.locator('#product-recap-container')).toContainText('Finitions plateau Bords bruts (inclus)');
        await expect(page.locator('#product-recap-container')).toContainText('Pieds de table Y (inclus)');
        await expect(page.locator('#product-recap-container')).toContainText('Suppléments 2 rallonges 45cm (+500 €)');
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 2 000 €']);
    })

    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des tables avec largeur sur mesure', async () => {
        await page.goto('https://fred-troussel.fr/tables-rectangulaires');

        await (page.getByText('200cm')).click();
        await (page.getByText("+ de 110cm Sur mesure")).click();
        await (page.getByText('Bords bruts Inclus')).click();
        await (page.getByText('U motif laser +250 €')).click();
        await (page.getByText('Teinte vintage')).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur de plateau 200cm (1 500 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Largeur de plateau + de 110cm (sur mesure)");
        await expect(page.locator('#product-recap-container')).toContainText('Finitions plateau Bords bruts (inclus)');
        await expect(page.locator('#product-recap-container')).toContainText('U motif laser (+250 €)');
        await expect(page.locator('#product-recap-container')).toContainText('Suppléments Teinte vintage (inclus)');
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
    })
})

test("TC_CONF_002_Bahus_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {

    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des bahus', async () => {
        await page.goto('https://fred-troussel.fr/bahuts-bas');

        await (page.getByText('150cm 2 000 €')).click();
        await (page.getByText("Panneau coulissant Gratuit")).click();
        await (page.getByText("Panneau à poussoir Gratuit")).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur 150cm (2 000 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Configuration Panneau coulissant (inclus)");
        await expect(page.locator('#product-recap-container')).toContainText("Configuration Panneau à poussoir (inclus)");
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 2 000 €']);
    })

    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des bahus avec config sur mesure', async () => {
        await page.goto('https://fred-troussel.fr/bahuts-bas');

        await (page.getByText('150cm 2 000 €')).click();
        await (page.getByText("Panneau coulissant Gratuit")).click();
        await (page.getByText("Avec motif Sur mesure")).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur 150cm (2 000 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Configuration Avec motif (sur mesure)");
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
    })
})


test("TC_CONF_003_Vaisselier_Les_options_ajuste_le_prix_pour_chaque_categories_d'articles", async ({ page }) => {
    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des vaisseliers', async () => {
        await page.goto('https://fred-troussel.fr/vaisseliers');

        await (page.getByText('1m50 3 000 €')).click();
        await (page.getByText("Peinture blanche Inclus")).click();
        await (page.getByText("Porte en grille Gratuit")).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur 1m50 (3 000 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Couleur de structure Peinture blanche (inclus)");
        await expect(page.locator('#product-recap-container')).toContainText('Partie inférieure Porte en grille (inclus)');
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé 3 000 €']);
    })

    await test.step('Étant donné un visiteur fait un choix d\'option sur la page des vaisseliers avec confi sur mesure', async () => {
        await page.goto('https://fred-troussel.fr/vaisseliers');

        await (page.getByText('1m50 3 000 €')).click();
        await (page.getByText("Peinture au choix Sur mesure")).click();
        await (page.getByText("Placards suspendus Sur mesure")).click();
        await (page.getByText("Sans tiroirs Sur mesure")).click();
        await (page.getByText("Autre Sur mesure")).click();
        await (page.getByRole('button', { name: 'Suivant' })).click();

        await expect(page.locator('#product-recap-container')).toContainText('Longueur 1m50 (3 000 €)');
        await expect(page.locator('#product-recap-container')).toContainText("Couleur de structure Peinture au choix (sur mesure)");
        await expect(page.locator('#product-recap-container')).toContainText("Partie supérieure Placards suspendus (sur mesure)");
        await expect(page.locator('#product-recap-container')).toContainText("Tiroirs Sans tiroirs (sur mesure)");
        await expect(page.locator('#product-recap-container')).toContainText('Partie inférieure Autre (sur mesure)');
        await expect(page.locator('#product-recap-container')).toContainText(['Total estimé Sur mesure']);
    })
})
