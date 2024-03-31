import { expect } from "@playwright/test"
import { settings } from "../utils/settings"
import { BasePage } from "./base-page"

export class MainPage extends BasePage {
  userGreeting = this.page.locator(
    "[class='name name-max-width ng-binding name-only']"
  )
  cardsInfo = this.page.locator(".service-card-info h4")
  userCoins = this.page.locator("[ng-if='!$ctrl.userInfo.link_for_points']")

  async goToDashboard() {
    await this.page.goto(`${settings.baseURL}portal/#/employee/dashboard`)
  }

  async isUserLoggedIn(firstName: string, lastName: string) {
    let userGreetingText = (
      (await this.userGreeting.textContent()) as string
    ).replace(/\s\s+/g, " ")

    expect(userGreetingText, `The user isn't logged in`).toContain(
      `Hello, ${firstName} ${lastName}`
    )

    return userGreetingText
  }
}
