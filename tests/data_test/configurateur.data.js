export const optionAValider = [
    {
        cas: 'Table',
        url: 'https://fred-troussel.fr/tables-rectangulaires',
        optionClick: ['200cm', "Jusqu' à 110cm Inclus", 'Bords bruts Inclus', '2 rallonges 45cm'],
        optionVerifier: ['Longueur de plateau 200cm (1 500 €)', "Largeur de plateau Jusqu' à 110cm (inclus)", 'Finitions plateau Bords bruts (inclus)', 'Pieds de table Y (inclus)', 'Suppléments 2 rallonges 45cm (+500 €)', 'Total estimé 2 000 €'],
    },

    {
        cas: 'TableSurMesure',
        url: 'https://fred-troussel.fr/tables-rectangulaires',
        optionClick: ['200cm', "+ de 110cm Sur mesure", 'Bords bruts Inclus', 'U motif laser +250 €', 'Teinte vintage'],
        optionVerifier: ['Longueur de plateau 200cm (1 500 €)', "Largeur de plateau + de 110cm (sur mesure)", 'Finitions plateau Bords bruts (inclus)', 'U motif laser (+250 €)', 'Suppléments Teinte vintage (inclus)', 'Total estimé Sur mesure'],
    },

    {
        cas: 'bahuts',
        url: 'https://fred-troussel.fr/bahuts-bas',
        optionClick: ['150cm 2 000 €', "Panneau coulissant Gratuit", "Panneau à poussoir Gratuit"],
        optionVerifier: ['Longueur 150cm (2 000 €)', "Configuration Panneau coulissant (inclus)", "Configuration Panneau à poussoir (inclus)", 'Total estimé 2 000 €'],
    },

    {
        cas: 'bahutsSurMesure',
        url: 'https://fred-troussel.fr/bahuts-bas',
        optionClick: ['150cm 2 000 €', "Panneau coulissant Gratuit", "Avec motif Sur mesure"],
        optionVerifier: ['Longueur 150cm (2 000 €)', "Configuration Avec motif (sur mesure)", 'Total estimé Sur mesure'],
    },


    {
        cas: 'vaisseliers',
        url: 'https://fred-troussel.fr/vaisseliers',
        optionClick: ['1m50 3 000 €', "Peinture blanche Inclus", "Porte en grille Gratuit"],
        optionVerifier: ['Longueur 1m50 (3 000 €)', "Couleur de structure Peinture blanche (inclus)", 'Partie inférieure Porte en grille (inclus)', 'Total estimé 3 000 €'],
    },

    {
        cas: 'vaisseliersSurMesure',
        url: 'https://fred-troussel.fr/vaisseliers',
        optionClick: ['1m50 3 000 €', "Peinture au choix Sur mesure", "Placards suspendus Sur mesure", "Sans tiroirs Sur mesure", "Autre Sur mesure"],
        optionVerifier: ['Longueur 1m50 (3 000 €)', "Couleur de structure Peinture au choix (sur mesure)", "Partie supérieure Placards suspendus (sur mesure)", "Tiroirs Sans tiroirs (sur mesure)", 'Partie inférieure Autre (sur mesure)', 'Total estimé Sur mesure',],
    },

]


export const optionAValiderStandard = [
    {
        cas: 'Table',
        url: 'https://fred-troussel.fr/tables-rectangulaires',
        optionClick: ['200cm', "Jusqu' à 110cm Inclus", 'Bords bruts Inclus', '2 rallonges 45cm'],
        optionVerifier: ['Longueur de plateau 200cm (1 500 €)', "Largeur de plateau Jusqu' à 110cm (inclus)", 'Finitions plateau Bords bruts (inclus)', 'Pieds de table Y (inclus)', 'Suppléments 2 rallonges 45cm (+500 €)', 'Total estimé 2 000 €'],
    },

    {
        cas: 'bahuts',
        url: 'https://fred-troussel.fr/bahuts-bas',
        optionClick: ['150cm 2 000 €', "Panneau coulissant Gratuit", "Panneau à poussoir Gratuit"],
        optionVerifier: ['Longueur 150cm (2 000 €)', "Configuration Panneau coulissant (inclus)", "Configuration Panneau à poussoir (inclus)", 'Total estimé 2 000 €'],
    },

    {
        cas: 'vaisseliers',
        url: 'https://fred-troussel.fr/vaisseliers',
        optionClick: ['1m50 3 000 €', "Peinture blanche Inclus", "Porte en grille Gratuit"],
        optionVerifier: ['Longueur 1m50 (3 000 €)', "Couleur de structure Peinture blanche (inclus)", 'Partie inférieure Porte en grille (inclus)', 'Total estimé 3 000 €'],
    },
]