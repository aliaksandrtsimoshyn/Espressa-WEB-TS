import { settings } from "../utils/settings"
import { BasePage } from "./base-page"

export class LoginPage extends BasePage {
  emailField = this.page.locator("#login_login")
  continueButton = this.page.locator("#login_next")
  passwordField = this.page.locator("#login_password")
  submitButton = this.page.locator("#login_submit")
  loginError = this.page.locator("#login_error")

  async goToEspresa() {
    await this.page.goto(settings.baseURL)
  }

  async enterEmail(email: string) {
    await this.emailField.fill(email)
    await this.page.waitForTimeout(1000)
    await this.continueButton.click()
  }

  async loginToEspresa(email: string, password: string) {
    await this.goToEspresa()
    await this.enterEmail(email)
    await this.passwordField.fill(password)
    await this.submitButton.click()
  }
}
