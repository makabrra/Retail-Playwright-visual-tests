import { Given, When, Before, After, setDefaultTimeout, Then, Status } from '@cucumber/cucumber';
import { Page } from 'playwright';
import BasePage from '../pages/common-page';
import { expect } from 'chai';
import * as fs from 'fs';
import * as config from '../config.json';
import { compareScreenshots } from '../utils/utils';
import maskConfig from '../mask-config.json';

const { browser } = config;
const browserType = require('playwright')[browser.name];

let browserInstance: any;
let page: Page;
let basePage: BasePage
let currentScenarioName: string = '';

setDefaultTimeout(config.cucumber_default_timeout_ms)

Given('a customer is browsing NS&I marketing website', async () => {
    await basePage.openMarketingWebsiteMainPage();
});

Given('a customer is browsing NS&I adviser website', async () => {
    await basePage.openAdviserWebsiteMainPage();
});

When('the User navigated to the {string} MWS page', async (subPage: string) => {
        await basePage.navigateToSubPageMWS(subPage);
});

When('the User navigated to the {string} IFA page', async (subPage: string) => {
        await basePage.navigateToSubPageIFA(subPage);
});

Then('the {string} page is displayed properly', async function (path: string) {
    const maskSelectors = maskConfig[path as keyof typeof maskConfig] || [];
    basePage = new BasePage(page);
    basePage.setMaskSelectors(maskSelectors);
    const scenarioName = currentScenarioName.replace(/[\s\/\\:*?"<>|]+/g, '_');

    // Ensure baseline_png directory exists first
    const baselineDir = 'baseline_png/' + path;
    if (!fs.existsSync(baselineDir)) {
        fs.mkdirSync(baselineDir, { recursive: true });
    }

    // Construct the baseline screenshot path properly
    const baselineScreenshotPath = `${baselineDir}/${scenarioName}.png`;

    try {
        // Check if baseline screenshot exists
        if (!fs.existsSync(baselineScreenshotPath)) {
            // If baseline doesn't exist, create it
            console.log(`Creating baseline screenshot: ${baselineScreenshotPath}`);
            const newScreenshot = await basePage.takeScreenshot();
            await fs.promises.writeFile(baselineScreenshotPath, newScreenshot);
            console.log(`Baseline screenshot created successfully: ${baselineScreenshotPath}`);
            return;
        }

        // Compare screenshots
        const baselineScreenshot = await fs.promises.readFile(baselineScreenshotPath);
        const newScreenshot = await basePage.takeScreenshot(scenarioName, path);
        const result = await compareScreenshots(baselineScreenshot, newScreenshot, config.png_comparision_threshold, scenarioName);

        expect(result, `Screenshots are not identical for scenario: ${scenarioName}`).to.be.true;

    } catch (error) {
        // Attach current screenshot for debugging if comparison fails
        if (config.take_screenshots_on_failure) {
            const currentScreenshot = await page.screenshot({ fullPage: true });
            await this.attach(currentScreenshot, 'image/png');
        }
        throw error;
    }
});

Before(async function (scenario) {
    // Capture the scenario name from the scenario object
    currentScenarioName = scenario.pickle.name || 'unknown_scenario';

    browserInstance = await browserType.launch(browser);
    page = await browserInstance.newPage();
    basePage = new BasePage(page)
    await basePage.openMainPage();
});

After(async function (scenario) {
    if (config.take_screenshots_on_failure) {
        if (scenario && scenario.result && scenario.result.status === Status.FAILED) {
            this.attach(await page.screenshot({
                path: `./screenshots/FAILED - ${scenario.pickle.name}.png`, fullPage: true,
            }), 'image/png');
        }
    }
    // Close the browser
    await browserInstance.close();
});

export { page };