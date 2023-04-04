import { test } from '@playwright/test'
import { playwright } from 'test-util-ipfs-example'

// Setup
const play = test.extend({
  ...playwright.servers()
})

play.describe('using script tag:', () => {
  // DOM
  const status = '#statusValue'
  const node = '#nodeId'
  const stopHelia = '.e2e-stopHelia'

  play.beforeEach(async ({ servers, page }) => {
    await page.goto(`http://localhost:${servers[0].port}/`)
  })

  play('should properly initialized a IPFS node and print the status', async ({ page }) => {
    // wait for page to init
    await page.waitForSelector(`${status}:has-text("Not Started")`)

    // wait for helia to start
    await page.waitForSelector(`${status}:has-text("Online")`)
    await page.waitForSelector(`${node}:has-text("12D3")`)

    // wait for helia to stop
    await page.click(stopHelia)
    await page.waitForSelector(`${status}:has-text("Offline")`)
  })
})
