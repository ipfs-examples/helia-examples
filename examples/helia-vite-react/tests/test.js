import { test, expect } from '@playwright/test'
import { playwright } from 'test-util-ipfs-example'

const play = test.extend({
  ...playwright.servers()
})

play.describe('Use Helia With react and vite', () => {
  // DOM
  const heliaStatus = '#heliaStatus'
  const textInput = '#textInput'
  const commitTextButton = '#commitTextButton'
  const cidOutput = '#cidOutput'
  const fetchCommittedTextButton = '#fetchCommittedTextButton'
  const committedTextOutput = '#committedTextOutput'

  play.beforeEach(async ({ servers, page }) => {
    await page.goto(`http://localhost:${servers[0].port}/`)
  })

  play('should properly initialize a Helia node and add/get a file', async ({ page }) => {
    // wait for helia node to be online
    const text = 'Hello Helia'
    const status = await page.locator(heliaStatus)
    await expect(status).toHaveCSS(
      'border-color',
      'rgb(0, 128, 0)', // green
      { timeout: 7000 }
    )

    // commit text to the blockstore
    await page.fill(textInput, text)
    await page.click(commitTextButton)

    await page.waitForSelector(`${cidOutput}:has-text("bafkreig7i5kbqdnoooievvfextf27eoherluxe2pi3j26hu6zpiauydydy")`)
    const cidOutputContent = await page.textContent(cidOutput)

    expect(cidOutputContent).toContain('bafkreig7i5kbqdnoooievvfextf27eoherluxe2pi3j26hu6zpiauydydy')

    // retrieve text from blockstore
    await page.click(fetchCommittedTextButton)
    await page.waitForSelector(`${committedTextOutput}:has-text("${text}")`)
    const committedTextOutputLocator = await page.locator(committedTextOutput)
    await expect(committedTextOutputLocator).toHaveText(`Committed Text: ${text}`, { timeout: 2000 })
  })
})
