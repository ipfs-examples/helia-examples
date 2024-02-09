import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

const testCidPath = 'ipfs://bagaaieracglt4ey6qsxtvzqsgwnsw3b6p2tb7nmx5wdgxur2zia7q6nnzh7q'

test.describe('Use @helia/verified-fetch With react and vite', () => {
  // DOM
  const ipfsPathInput = '#ipfs-path'
  // const fetchOutput = '#output'
  // const fetchAutoBtn = '#button-fetch-auto'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly render ui with the ipfs path input', async ({ page }) => {
    // wait for helia node to be online
    const ipfsPath = await page.locator(ipfsPathInput)
    await expect(ipfsPath).toHaveClass(/bg-gray-50/)

    await page.fill(ipfsPathInput, testCidPath)
    // await page.click(fetchAutoBtn)
    // await page.locator(fetchOutput).waitFor('visible')
  })
})
