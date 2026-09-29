import { DemandeDeContact } from '../../tests/data_test/contact.data';


export class ContactForm {
    constructor(page) {
        this.page = page;
        this.contactNom = page.locator('#contact_nom')
        this.contactEmail = page.locator('#contact_email')
        this.contactTelephone = page.locator('#contact_telephone')
        this.contactMessage = page.locator('#contact_message')
        this.sendMessage = page.locator('button', { hasText: 'Envoyer ma demande' })
    }
    async remplirChamps() {
        await this.contactNom.fill(DemandeDeContact.nom)
        await this.contactEmail.fill(DemandeDeContact.email)
        await this.contactTelephone.fill(DemandeDeContact.telephone)
        await this.contactMessage.fill(DemandeDeContact.message)
    }

    async sendForm() {
        await this.sendMessage.click()

    }

}