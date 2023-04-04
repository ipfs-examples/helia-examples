import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('using script tag:', () => {
  // DOM
  const status = "#statusValue"
  const node = "#nodeId"
  const startHelia = ".e2e-startHelia"
  const stopHelia = ".e2e-stopHelia"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print the status', async ({ page }) => {
    expect(await page.textContent(status)).toContain("Not Started");
    await page.waitForSelector(status)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    expect(await page.textContent(status)).toContain("Online");
    expect(await page.textContent(node)).not.toContain("unknown");
    expect(await page.textContent(node)).toContain("12D3");

    await page.click(stopHelia)
    await new Promise((resolve) => setTimeout(resolve, 600))
    expect(await page.textContent(status)).toContain("Offline");

  });
});
