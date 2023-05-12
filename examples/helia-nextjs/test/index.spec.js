import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

test.describe('integrate ipfs with nextjs:', () => {
  // DOM
  const id = '[data-test=id]'
  const status = '[data-test=status]'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly initialized a IPFS node and print some properties', async ({ page }) => {
    await page.waitForSelector(id)

    expect(await page.isVisible(id)).toBeTruthy()
    expect(await page.textContent(status)).toContain('Online')
  })
})
