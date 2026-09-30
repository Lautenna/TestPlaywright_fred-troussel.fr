export class ReseauSocial {
    constructor(page) {
        this.page = page;
        this.footer = page.locator("footer")
        this.bouttonFacebook = this.footer.locator('a[href="https://facebook.com/mobilierfredtroussel"]')
        this.bouttonInstagram = this.footer.locator('a[href="https://instagram.com/fredtroussel"]')
        this.bouttonSiteDeveloppeur = this.footer.locator('a[href="https://maximemougel.dev"]')
    
    }
    async redirectionFacebook() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonFacebook.click()
         const newPage = await pagePromise;
          await newPage.waitForLoadState();
          return newPage;
    }

    async redirectionInstagram() {
        const pagePromise = this.page.context().waitForEvent('page');
        await this.bouttonInstagram.click()
        const newPage = await pagePromise;
          await newPage.waitForLoadState();
        return newPage;
        }

    async redirectionSiteDeveloppeur() {
        await this.bouttonSiteDeveloppeur.click()
    }
}