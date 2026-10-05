# Fred Troussel – Tests end-to-end

[![Playwright Tests](https://github.com/Lautenna/fred_troussel_tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/Lautenna/fred_troussel_tests/actions/workflows/playwright.yml)

Suite de tests automatisés **Playwright** pour le site e-commerce de l'artisan ébéniste [fred-troussel.fr](https://fred-troussel.fr).
Elle vérifie les parcours clés d'un visiteur : navigation, configurateur de produit, gestion des cookies, formulaire de contact (avec réception réelle de l'e-mail) et liens vers les réseaux sociaux.

> ⚠️ Les tests s'exécutent contre le site **réellement déployé** : il n'y a ni serveur local, ni build.

## De Jira à Squash

Les besoins de test sont transmis par le développeur du site via **Jira**. Les tâches sont claires et bien définies.

Pour planifier les tests précisément, chaque tâche est ensuite décomposée en sous-tâches dans **Squash** (outil de gestion de cas de test). Chaque cas de test de ce dépôt (`TC_CONN`, `TC_CONF`, etc.) correspond à un cas défini dans Squash.

La capture ci-dessous montre le travail réalisé dans Squash (instance locale).

<img width="2560" height="1600" alt="Capture d'écran de Squash : cas de test et sous-tâches planifiées pour le site fred-troussel.fr" src="https://github.com/user-attachments/assets/3ba9c045-56cb-4c3b-a947-61b8ca9afe03" />


## Ce qui est testé

| Zone | Préfixe | Ce qui est vérifié |
|------|---------|--------------------|
| Navigation | `TC_CONN` | Chaque page du site charge avec le bon titre (test paramétré), téléchargement du catalogue |
| Configurateur | `TC_CONF` | Les options choisies (dimensions, finitions, extras) mettent à jour le prix et le récapitulatif, y compris le cas « Sur mesure » sans prix fixe |
| Cookies | `TC_COOK` | Affichage de la pop-up, disparition après rechargement, accès via « Gestion des cookies », état du `localStorage` après acceptation / refus |
| Contact | `TC_CONT` | Remplissage du formulaire, envoi d'une demande avec les options choisies, **réception de l'e-mail** dans une boîte temporaire |
| Réseaux sociaux | `TC_RESEAU` | Les liens redirigent vers le bon réseau (nouvel onglet) |

## Stack

- [Playwright Test](https://playwright.dev) – exécution des tests sur **Chromium, Firefox et WebKit**
- JavaScript (ES modules)
- [MailSlurp](https://www.mailslurp.com) – boîte mail jetable pour vérifier qu'un e-mail de contact est bien reçu
- [dotenv](https://github.com/motdotla/dotenv) – chargement des secrets en local
- GitHub Actions – intégration continue

## Architecture

```
.
├── pages/components/      # Page Objects : locators + actions réutilisables
│   ├── ContactForm.js
│   ├── CookiePopup.js
│   └── ReseauSociaux.js
├── tests/
│   ├── navigationSite.spec.js   # TC_CONN, TC_CONF, TC_RESEAU
│   ├── cookiesPopup.spec.js     # TC_COOK
│   ├── contactForm.spec.js      # TC_CONT
│   ├── data_test/               # Jeux de données séparés des scénarios
│   └── utils/helper.js          # Fonctions utilitaires
├── playwright.config.js
└── .github/workflows/playwright.yml
```

### Choix de conception

- **Page Object Model** : les sélecteurs vivent dans `pages/`, les specs ne décrivent que le scénario. Si le site change, on corrige à un seul endroit.
- **Tests pilotés par les données** : les cas de navigation et de configurateur sont des tableaux dans `data_test/`, parcourus par une boucle qui génère un test par cas. Ajouter un cas = ajouter une ligne, pas dupliquer un test.
- **Lisibilité Gherkin** : chaque test est découpé en `test.step('Étant donné … / Quand … / Alors …')`, en français, pour que le rapport se lise comme une spécification.
- **Nommage** : `TC_<ZONE>_<NNN>_description` pour retrouver et filtrer un test facilement (`-g "TC_COOK"`).

## Installation

Prérequis : [Node.js](https://nodejs.org) (LTS) et un compte [MailSlurp](https://www.mailslurp.com) (offre gratuite suffisante).

```bash
git clone https://github.com/Lautenna/fred_troussel_tests.git
cd fred_troussel_tests
npm ci
npx playwright install --with-deps
```

### Configuration

Crée un fichier `.env` à la racine (jamais versionné) :

```env
MAILSLURP_API_KEY=ta_cle_api_mailslurp
```

En CI, la même clé est lue depuis le secret GitHub `MAILSLURP_API_KEY`.

## Lancer les tests

```bash
npx playwright test                                # tous les tests, tous les navigateurs
npx playwright test --project=chromium             # un seul navigateur
npx playwright test tests/cookiesPopup.spec.js     # un seul fichier
npx playwright test -g "TC_CONF_001"               # par titre / préfixe
npx playwright test --ui                           # mode interactif
npx playwright show-report                         # ouvrir le dernier rapport HTML
```

## Intégration continue

Le workflow [`playwright.yml`](.github/workflows/playwright.yml) se déclenche à chaque `push` et `pull request` sur `main` / `master` :

1. vérifie que le secret `MAILSLURP_API_KEY` est configuré ;
2. installe les dépendances et les navigateurs ;
3. exécute toute la suite ;
4. publie le rapport HTML en artefact (conservé 30 jours).

Les échecs sont rejoués 2 fois en CI, avec une trace Playwright à la première relance.

## Auteure

**Laura** – [@Lautenna](https://github.com/Lautenna)
