import { expect } from "@playwright/test"
import { MainPage } from "../page-objects/main-page"
import { settings } from "../utils/settings"
import { test } from "../utils/extensions"
import { createAuthorizedWebContext } from "../utils/functions"

test.beforeAll(async ({ browser }) => {
  settings.authorizedContext = await createAuthorizedWebContext(
    settings.activeUser.email,
    settings.activeUser.password,
    browser
  )
})

test.describe(`WEB Tests`, () => {
  test.describe.configure({ mode: `default` })

  test(`@web Login To Espresa`, async ({ loginPage, mainPage }) => {
    await loginPage.loginToEspresa(
      settings.activeUser.email,
      settings.activeUser.password
    )

    let userGreetingText = await mainPage.isUserLoggedIn(
      settings.activeUser.firstName,
      settings.activeUser.lastName
    )

    console.log(userGreetingText)
  })

  test(`@web Negative Login To Espresa`, async ({
    page,
    loginPage,
    invalidUser,
  }) => {
    await loginPage.goToEspresa()

    await loginPage.enterEmail(invalidUser.email)
    await page.waitForTimeout(1 * 1000)

    let loginErrorText = await loginPage.loginError.textContent()
    expect(loginErrorText, `Error text is incorrect`).toContain(
      `Please enter a valid email address.`
    )

    console.log(loginErrorText)
  })

  test(`@web Get First Event`, async ({ loginPage, mainPage }) => {
    await loginPage.loginToEspresa(
      settings.activeUser.email,
      settings.activeUser.password
    )

    await mainPage.isUserLoggedIn(
      settings.activeUser.firstName,
      settings.activeUser.lastName
    )

    let firstIventInfo = await mainPage.cardsInfo.first().textContent()

    console.log(`First event: ${firstIventInfo}`)
  })
})

test.describe(`Mix Of WEB And API Tests`, () => {
  test.describe.configure({ mode: `parallel` })

  test(`@web Get First Event Mix`, async ({ authorizedMainPage }) => {
    await authorizedMainPage.goToDashboard()

    await authorizedMainPage.isUserLoggedIn(
      settings.activeUser.firstName,
      settings.activeUser.lastName
    )

    let firstIventInfo = await authorizedMainPage.cardsInfo
      .first()
      .textContent()

    console.log(`First event: ${firstIventInfo}`)
  })

  test(`@web Fake Coins Mix`, async ({ authorizedContext }) => {
    const page = await authorizedContext.newPage()
    const mainPage = new MainPage(page)

    await page.route(
      `${settings.baseURL}api/company/employee/points/`,
      async (route) => {
        const response = await page.request.fetch(route.request())

        const newBody = {
          available_points: 777,
        }

        route.fulfill({
          response: response,
          body: JSON.stringify(newBody),
        })
      }
    )

    await mainPage.goToDashboard()
    await expect(
      await mainPage.cardsInfo.first(),
      `First card isn't visible`
    ).toBeVisible()

    await page.screenshot({ path: `screenshots/fakeCoins.png` })

    let coinsCount = await mainPage.userCoins.textContent()
    expect(coinsCount, `Coins count is incorrect`).toEqual(`777.00 LX Coins`)

    console.log(`Fake ${coinsCount} are available to the user`)
  })
})
