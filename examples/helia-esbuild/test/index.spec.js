import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

test.describe('bundle ipfs with esbuild:', () => {
  // DOM
  const nameInput = '#file-name'
  const contentInput = '#file-content'
  const submitBtn = '#add-submit'
  const output = '#output'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should initialize a Helia node and add/get a file', async ({ page }) => {
    const outputLocator = page.locator(output)
    await expect(outputLocator).toHaveText(/Helia node ready/)

    const fileName = 'test.txt'
    const fileContent = 'Hello world!'

    await page.fill(nameInput, fileName)
    await page.fill(contentInput, fileContent)
    await page.click(submitBtn)

    await page.waitForSelector(`${output}:has-text("/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi")`)

    const outputContent = await page.textContent(output)
    expect(outputContent).toContain('https://ipfs.io/ipfs/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')
    expect(outputContent).toContain(fileName)
    expect(outputContent).toContain(fileContent)
  })
})
