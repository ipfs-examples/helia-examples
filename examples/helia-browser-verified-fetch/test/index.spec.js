import { setup, expect } from 'test-ipfs-example/browser'
import fixtures from './fixtures.js'

// Setup
const test = setup()

test.describe('Use @helia/verified-fetch With react and vite', () => {
  // DOM
  const ipfsPathInput = '#ipfs-path'
  const fetchOutput = '#output'
  const fetchAutoBtn = '#button-fetch-auto'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly render ui with the ipfs path input and display JSON', async ({ page }) => {
    // wait for helia node to be online
    const ipfsPath = await page.locator(ipfsPathInput)
    await expect(ipfsPath).toHaveClass(/bg-gray-50/)

    await page.fill(ipfsPathInput, `ipfs://${fixtures.json.cid.toString()}`)
    await page.click(fetchAutoBtn)
    await page.locator(fetchOutput).waitFor('visible')

    const output = await page.locator(fetchOutput)
    await expect(output).toContainText(
      '{ "hello": "world" }',
      { timeout: 2000 }
    )
  })

  test('should properly render ui with the ipfs path input and display DAG-JSON', async ({ page }) => {
    // wait for helia node to be online
    const ipfsPath = await page.locator(ipfsPathInput)
    await expect(ipfsPath).toHaveClass(/bg-gray-50/)

    await page.fill(ipfsPathInput, `ipfs://${fixtures.dagJson.cid.toString()}`)
    await page.click(fetchAutoBtn)
    await page.locator(fetchOutput).waitFor('visible')

    const output = await page.locator(fetchOutput)
    await expect(output).toContainText(
      '{ "hello": "world" }',
      { timeout: 2000 }
    )
  })

  test('should properly render ui with the ipfs path input and display DAG-CBOR', async ({ page }) => {
    // wait for helia node to be online
    const ipfsPath = await page.locator(ipfsPathInput)
    await expect(ipfsPath).toHaveClass(/bg-gray-50/)

    await page.fill(ipfsPathInput, `ipfs://${fixtures.dagCbor.cid.toString()}`)
    await page.click(fetchAutoBtn)
    await page.locator(fetchOutput).waitFor('visible')

    const output = await page.locator(fetchOutput)
    await expect(output).toContainText(
      '{ "hello": "world" }',
      { timeout: 2000 }
    )
  })
})
