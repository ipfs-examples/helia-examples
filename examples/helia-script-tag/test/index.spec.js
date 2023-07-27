import { setup } from 'test-ipfs-example/browser'

// Setup
const test = setup()

test.describe('using script tag:', () => {
  // DOM
  const status = '#statusValue'
  const node = '#nodeId'
  const stopHelia = '.e2e-stopHelia'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly initialized a IPFS node and print the status', async ({ page }) => {
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
