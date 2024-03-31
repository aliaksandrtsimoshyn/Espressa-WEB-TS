import { defineConfig, devices } from "@playwright/test"
import dotenv from 'dotenv'
import { settings } from './utils/settings'

dotenv.config({
  path: `.env`
})

console.log(settings.baseURL)

export default defineConfig({
  testDir: "./tests",

  retries: 1,

  workers: 5,

  timeout: 40 * 1000,

  expect: {
    timeout: 20 * 1000,
  },

  reporter: "html",

  projects: [
    {
      name: "Safari",
      use: {
        browserName: "webkit",
        headless: true,
        screenshot: "on",
        trace: "on",
        video: "on",
      },
    },
    {
      name: "Mobile",
      use: {
        browserName: "chromium",
        headless: true,
        screenshot: "on",
        trace: "on",
        video: "on",
        ...devices[`Galaxy S9+`],
      },
    },
  ],
})
