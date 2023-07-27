import { setup, expect } from 'test-ipfs-example/browser'

// Setup
const test = setup()

test.describe('Use Helia with Vue', () => {
  test.beforeEach(async ({ servers, page }) => {
    await page.goto(servers[0].url)
  })

  test('should properly initialize Helia, and add/get a file', async ({ page }) => {
    const exampleText = 'Hello Helia'
    const exampleDirName = 'newdir'
    const exampleFileName = 'test.txt'

    const status = page.locator('#heliaStatus')
    await expect(status).toHaveCSS(
      'background-color',
      'rgb(0, 128, 0)',
      { timeout: 5000 }
    )

    await page.fill('#commitText', exampleText)
    await page.click('#commitTextButton')
    const cidOutput = page.locator('#commitTextCidOutput')
    await expect(cidOutput).toHaveText(
      'cid: bafkreig7i5kbqdnoooievvfextf27eoherluxe2pi3j26hu6zpiauydydy',
      { timeout: 2000 }
    )

    await page.click('#fetchCommitedTextButton')
    const textOutput = page.locator('#fetchedCommitedTextOutput')
    await expect(textOutput).toHaveText(
      `added text: ${exampleText}`,
      { timeout: 2000 }
    )

    await page.fill('#newDirInput', exampleDirName)
    await page.click('#newDirButton')
    const dirOutput = page.locator('#newDirOutput')
    await expect(dirOutput).toHaveText(
      'directory Cid: bafybeif5hfzip34o7ocwfg4ge537g7o3nbh3auc3s54l3gsaantucqyyra',
      { timeout: 2000 }
    )

    await page.click('#statDirButton')
    const statDir = page.locator('#statDirOutput')
    await expect(statDir).toContainText(
      'bafybeiczsscdsbs7ffqz55asqdf3smv6klcw3gofszvwlyarci47bgf354',
      { timeout: 2000 }
    )

    await page.click('#getDirButton')
    const lsDir = await page.locator('#dirListOutput')
    await expect(lsDir).toContainText(
      'bafybeif5hfzip34o7ocwfg4ge537g7o3nbh3auc3s54l3gsaantucqyyra/newdir',
      { timeout: 2000 }
    )

    await page.fill('#fileNameInput', exampleFileName)
    await page.fill('#fileContentInput', exampleText)
    await page.click('#newFileButton')
    const fileCidOutput = page.locator('#fileCidOutput')
    await expect(fileCidOutput).toContainText(
      'bafkreig7i5kbqdnoooievvfextf27eoherluxe2pi3j26hu6zpiauydydy',
      { timeout: 2000 }
    )
    const updatedDirOutput = page.locator('#updatedDirOutput')
    await expect(updatedDirOutput).toContainText(
      'bafybeie6lhtnjvea4j7imyx5lp2c7kfgxjkndc4jjpmcetnkq75lapmgwm',
      { timeout: 2000 }
    )

    await page.click('#dirContentsButton')
    const dirContentsOutput = page.locator('#dirContentsOutput')
    await expect(dirContentsOutput).toContainText(
      'bafkreig7i5kbqdnoooievvfextf27eoherluxe2pi3j26hu6zpiauydydy',
      { timeout: 2000 }
    )
    await page.click('#fileContentsButton')
    const fileContentsOutput = page.locator('#fileContentsOutput')
    await expect(fileContentsOutput).toContainText(
      exampleText,
      { timeout: 2000 }
    )
  })
})
