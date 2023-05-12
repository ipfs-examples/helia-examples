import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

test.describe('bundle Helia with Webpack:', () => {
  // DOM
  const nameInput = '#file-name'
  const contentInput = '#file-content'
  const submitBtn = '#add-submit'
  const output = '#output'

  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly initialized a Helia node and add/get a file', async ({ page }) => {
    const fileName = 'test.txt'
    const stringToUse = 'Hello world!'

    await page.fill(nameInput, fileName)
    await page.fill(contentInput, stringToUse)
    await page.click(submitBtn)

    await page.waitForSelector(`${output}:has-text("/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi")`)

    const outputContent = await page.textContent(output)

    expect(outputContent).toContain('bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')
    expect(outputContent).toContain('https://ipfs.io/ipfs/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')
    expect(outputContent).toContain(fileName)
    expect(outputContent).toContain(stringToUse)
  })
})
