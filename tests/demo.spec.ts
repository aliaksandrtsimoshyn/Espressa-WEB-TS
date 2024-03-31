import { expect } from "@playwright/test"
import { test } from "../utils/extensions"
import { settings } from "../utils/settings"

test.describe.skip(`Resource 1`, () => {
  test.describe.configure({ mode: `default` })

  test(`@demo Dynamic ID`, async ({ page }) => {
    await page.goto(`http://uitestingplayground.com/dynamicid`)
    await page.getByText(`Button with Dynamic ID`).click()
  })

  test(`@demo Client Side Delay`, async ({ page }) => {
    await page.goto(`http://uitestingplayground.com/clientdelay`)
    await page.getByText(`Button Triggering Client Side Logic`).click()
    let loadedData = page.locator(`.bg-success`)
    expect(loadedData, `Data isn't loaded`).toContainText(
      `Data calculated on the client side.`
    )
    await loadedData.click()
  })

  test(`@demo Progress Bar`, async ({ page }) => {
    await page.goto(`http://uitestingplayground.com/progressbar`)
    await page.locator(`#startButton`).click()
    await page.locator(`[aria-valuenow='75']`).isEnabled()
    await page.locator(`#stopButton`).click()
    let result = await page.locator(`#result`).textContent()
    console.log(`${result}`)
  })

  test(`@demo Shadow Dom`, async ({ context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    let page = await context.newPage()
    await page.goto(`http://uitestingplayground.com/shadowdom`)
    await page.locator(`#buttonGenerate`).click()
    let generatedValue = await page.locator(`#editField`).inputValue()
    expect(generatedValue).toHaveLength(36)
    await page.locator(`#buttonCopy`).click()
    let clipboardContent = await page.evaluate(() =>
      navigator.clipboard.readText()
    )
    expect(generatedValue, `Values aren't equal`).toEqual(clipboardContent)
  })
})

test.describe.skip(`Resource 2`, () => {
  test.describe.configure({ mode: `default` })

  test(`@demo Simple`, async ({ page }) => {
    await page.goto(`https://demoqa.com/droppable`)
    await page.dragAndDrop(
      `#simpleDropContainer #draggable`,
      `#simpleDropContainer #droppable`
    )
    await expect(
      page.locator(`#simpleDropContainer #droppable`),
      `Element isn't dropped`
    ).toContainText(`Dropped!`)
  })

  test(`@demo Accept`, async ({ page }) => {
    await page.goto(`https://demoqa.com/droppable`)
    await page.locator(`#droppableExample-tab-accept`).click()
    await page.dragAndDrop(
      `#acceptDropContainer #acceptable`,
      `#acceptDropContainer #droppable`
    )
    await expect(
      page.locator(`#acceptDropContainer #droppable`),
      `Element isn't dropped`
    ).toContainText(`Dropped!`)
  })
})

test.describe.skip(`Resource 3`, () => {
  test.describe.configure({ mode: `default` })

  test(`@demo iFrame`, async ({ page }) => {
    await page.goto(`https://the-internet.herokuapp.com/iframe`)
    await page.getByText(`File`).click()
    await page.getByText(`New document`).click()
    let frameInput = page.frameLocator(`#mce_0_ifr`).locator(`#tinymce`)
    await frameInput.fill(`Demo text`)
    expect(frameInput, `Text isn't written`).toContainText(`Demo text`)
  })
})
