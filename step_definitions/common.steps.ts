import { Given, When, Before, After, setDefaultTimeout, Then, Status } from '@cucumber/cucumber';
import { Browser, Page } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

import BasePage from '../pages/common-page';
import { Config, MaskConfig } from '../config.types';
import { FileUtils, ScreenshotComparator, Logger } from '../utils/utils';
import * as configData from '../config.json';
import maskConfig from '../mask-config.json';

// Type-safe config loading
const config: Config = configData as Config;
const masks: MaskConfig = maskConfig as MaskConfig;

// Browser and page management
class BrowserManager {
    private static browserInstance: Browser | null = null;
    private static pageInstance: Page | null = null;

    static async initializeBrowser(): Promise<{ browser: Browser; page: Page }> {
        const browserName = process.env.BROWSER || config.browser.name;
        const { browser: browserConfig } = config;

        Logger.info(`Launching ${browserName} browser`);

        let browser: Browser;

        try {
            switch (browserName) {
                case 'chrome':
                    const chrome = require('playwright');
                    browser = await chrome.chromium.launch({
                        headless: browserConfig.headless,
                        slowMo: browserConfig.slowMo || 0,
                        channel: 'chrome'
                    });
                    break;

                case 'edge':
                    const edge = require('playwright');
                    browser = await edge.chromium.launch({
                        headless: browserConfig.headless,
                        slowMo: browserConfig.slowMo || 0,
                        channel: 'msedge'
                    });
                    break;

                case 'chromium':
                case 'firefox':
                case 'webkit':
                    const browserType = require('playwright')[browserName];
                    browser = await browserType.launch({
                        headless: browserConfig.headless,
                        slowMo: browserConfig.slowMo || 0
                    });
                    break;

                default:
                    throw new Error(`Unsupported browser: ${browserName}. Supported browsers: chromium, firefox, webkit, chrome, edge`);
            }
        } catch (error) {
            Logger.error(`Failed to launch browser: ${browserName}`, error as Error);
            throw error;
        }

        const page = await browser.newPage();

        if (browserConfig.viewport) {
            await page.setViewportSize(browserConfig.viewport);
        }

        this.browserInstance = browser;
        this.pageInstance = page;

        return { browser, page };
    }

    static async closeBrowser(): Promise<void> {
        if (this.browserInstance) {
            await this.browserInstance.close();
            this.browserInstance = null;
            this.pageInstance = null;
            Logger.info('Browser closed');
        }
    }

    static getCurrentPage(): Page {
        if (!this.pageInstance) {
            throw new Error('Page not initialized. Call initializeBrowser first.');
        }
        return this.pageInstance;
    }
}

// Test context management
interface TestContext {
    basePage: BasePage;
    currentScenarioName: string;
    screenshotComparator: ScreenshotComparator;
}

let testContext: TestContext;

// Set default timeout
setDefaultTimeout(config.cucumberDefaultTimeoutMs);

// Step definitions
Given('a User is browsing NS&I marketing website', async () => {
    Logger.info('Navigating to NS&I marketing website');
    await testContext.basePage.navigateToMarketingWebsite();
});

Given('a User is browsing NS&I adviser website', async () => {
    Logger.info('Navigating to NS&I adviser website');
    await testContext.basePage.navigateToAdviserWebsite();
});

When('the User navigated to the {string} MWS page', async (subPage: string) => {
    Logger.info(`Navigating to MWS page: ${subPage}`);
    await testContext.basePage.navigateToMWSSubPage(subPage);
});

When('the User navigated to the {string} IFA page', async (subPage: string) => {
    Logger.info(`Navigating to IFA page: ${subPage}`);
    await testContext.basePage.navigateToIFASubPage(subPage);
});

When('the User close popup and continue to Adviser Centre', async () => {
    Logger.info(`Closing popup`);
    await testContext.basePage.clickPopupButton();
});

Then('the {string} page is displayed properly', async function (pageType: string) {
    const { basePage, currentScenarioName, screenshotComparator } = testContext;
    const sanitizedScenarioName = FileUtils.sanitizeFileName(currentScenarioName);

    try {
        // Apply masks if configured
        const maskSelectors = masks[pageType] || [];
        if (maskSelectors.length > 0) {
            basePage.setMaskSelectors(maskSelectors);
            Logger.debug(`Applied ${maskSelectors.length} mask selectors for page type: ${pageType}`);
        }

        // Ensure directories exist
        const baselineDir = path.join(config.paths.baselineDir, pageType);
        const screenshotsDir = path.join(config.paths.screenshotsDir, pageType);
        await FileUtils.ensureDirectoryExists(baselineDir);
        const baselineScreenshotPath = path.join(baselineDir, `${sanitizedScenarioName}.png`);

        // Take current screenshot
        await FileUtils.ensureDirectoryExists(screenshotsDir);
        const currentScreenshot = await basePage.takeScreenshot();

        // Check if baseline exists
        const baselineExists = await FileUtils.fileExists(baselineScreenshotPath);

        if (!baselineExists) {
            Logger.info(`Creating baseline screenshot: ${baselineScreenshotPath}`);
            await fs.writeFile(baselineScreenshotPath, currentScreenshot);
            Logger.info('Baseline screenshot created successfully');
            return;
        }

        // Save current screenshot for debugging
        const currentScreenshotPath = path.join(screenshotsDir, `${sanitizedScenarioName}.png`);
        await fs.writeFile(currentScreenshotPath, currentScreenshot);

        // READ the saved baseline screenshot from file
        const savedBaselineScreenshot = await fs.readFile(baselineScreenshotPath);

        // Compare saved baseline with current screenshot
        Logger.info(`Comparing screenshots for scenario: ${sanitizedScenarioName}`);
        const comparisonResult = await screenshotComparator.compareScreenshots(
            savedBaselineScreenshot,  // Read from saved baseline file
            currentScreenshot,        // Current screenshot
            sanitizedScenarioName
        );

        if (!comparisonResult.isMatch) {
            const errorMessage =
                `Visual regression detected for scenario: ${sanitizedScenarioName}\n` +
                `Difference: ${comparisonResult.diffPercentage.toFixed(2)}% ` +
                `(${comparisonResult.diffPixels}/${comparisonResult.totalPixels} pixels)\n` +
                `Baseline: ${baselineScreenshotPath}\n` +
                `Current: ${currentScreenshotPath}\n` +
                `Diff image: ${comparisonResult.diffImagePath}`;

            Logger.error(errorMessage);

            // Attach all relevant screenshots to the test report
            try {
                // 1. Attach current screenshot
                // await this.attach(currentScreenshot, 'image/png');

                // 2. Attach baseline screenshot for comparison
                const baselineBuffer = await fs.readFile(baselineScreenshotPath);
                await this.attach(baselineBuffer, 'image/png');

                // 3. Attach diff screenshot if it exists
                if (comparisonResult.diffImagePath) {
                    const diffBuffer = await fs.readFile(comparisonResult.diffImagePath);
                    await this.attach(diffBuffer, 'image/png');
                    Logger.info(`Diff screenshot attached: ${comparisonResult.diffImagePath}`);
                }
            } catch (attachError) {
                Logger.error('Failed to attach screenshots to report', attachError as Error);
            }

            throw new Error(errorMessage);
        }

        Logger.info(`Screenshot comparison passed for scenario: ${sanitizedScenarioName}`);

    } catch (error) {
        Logger.error(`Visual comparison failed for scenario: ${sanitizedScenarioName}`, error as Error);
        throw error;
    }
});

// Hooks
Before(async function (scenario) {
    const scenarioName = scenario.pickle.name || 'unknown_scenario';
    Logger.info(`Starting scenario: ${scenarioName}`);

    try {
        // Initialize browser and page
        const { page } = await BrowserManager.initializeBrowser();

        // Initialize screenshot comparator
        const screenshotComparator = new ScreenshotComparator(
            config.screenshot.pngComparisonThreshold,
            config.paths.diffDir
        );

        // Create test context
        testContext = {
            basePage: new BasePage(page, config),
            currentScenarioName: scenarioName,
            screenshotComparator
        };
    } catch (error) {
        Logger.error(`Failed to initialize test for scenario: ${scenarioName}`, error as Error);
        throw error;
    }
});

After(async function (scenario) {
    const scenarioName = scenario.pickle.name || 'unknown_scenario';

    try {
        // Handle test failure
        if (scenario.result?.status === Status.FAILED) {
            Logger.error(`Scenario failed: ${scenarioName}`);

            if (config.screenshot.takeScreenshotsOnFailure) {
                try {
                    const failureScreenshotDir = path.join(config.paths.screenshotsDir, 'failures');
                    await FileUtils.ensureDirectoryExists(failureScreenshotDir);

                    const failureScreenshot = await testContext.basePage.takeScreenshot(
                        `FAILED_${FileUtils.sanitizeFileName(scenarioName)}`,
                        'failures'
                    );

                    await this.attach(failureScreenshot, 'image/png');
                    Logger.info(`Failure screenshot captured for: ${scenarioName}`);

                } catch (screenshotError) {
                    Logger.error('Failed to capture failure screenshot', screenshotError as Error);
                }
            }
        } else {
            Logger.info(`Scenario passed: ${scenarioName}`);
        }

    } catch (error) {
        Logger.error(`Error during scenario cleanup: ${scenarioName}`, error as Error);
    } finally {
        // Always close browser
        await BrowserManager.closeBrowser();
    }
});

export { BrowserManager, testContext };
