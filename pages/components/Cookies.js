export class Cookies {
    constructor(page) {
        this.page = page;
        this.popup = page.locator('div[data-controller="cookie-banner"]')
        this.bouttonRefuser = this.popup.locator('button',{ hasText:'Refuser'})
        this.bouttonAccepter = this.popup.locator('button',{ hasText:'Accepter'})    
        this.bouttonCookies = page.locator('button',{ hasText:'Gérer les cookies'})    
    }
    async accepterCookies() {
    await this.bouttonAccepter.click()
    }

    async refuserCookies() {
    await this.bouttonRefuser.click()        
    }

    async gererCookies() {
    await this.bouttonCookies.click()        
    }

    }   