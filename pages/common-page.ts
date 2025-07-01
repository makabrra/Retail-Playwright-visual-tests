import { Page, Locator } from 'playwright';
import * as path from 'path';
import { Config } from '../config.types';
import { FileUtils, Logger } from '../utils/utils';

export default class BasePage {
    protected readonly page: Page;
    private readonly config: Config;
    private maskSelectors: string[] = [];

    constructor(page: Page, config: Config) {
        this.page = page;
        this.config = config;
    }

    // Selector utilities
    private getLinkTextSelector(linkText: string): string {
        return `//a[text()="${linkText}"]`;
    }

    private getTextSelector(text: string): string {
        return `//*[contains(text(), '${text}')]`;
    }

    // Navigation methods
    async navigateToUrl(url: string): Promise<void> {
        try {
            Logger.info(`Navigating to: ${url}`);
            await this.page.goto(url, {
                waitUntil: 'networkidle',
                timeout: this.config.cucumberDefaultTimeoutMs
            });
            await this.waitForPageLoad();
        } catch (error) {
            Logger.error(`Failed to navigate to ${url}`, error as Error);
            throw error;
        }
    }

    async navigateToMainPage(): Promise<void> {
        await this.navigateToUrl(this.config.baseUrl);
    }

    async navigateToMarketingWebsite(): Promise<void> {
        await this.navigateToUrl(this.config.baseUrlMWS);
    }

    async navigateToAdviserWebsite(): Promise<void> {
        await this.navigateToUrl(this.config.baseUrlIFA);
    }

    async navigateToSubPage(baseUrl: string, subPage: string): Promise<void> {
        const path = subPage.startsWith('/') ? subPage : `/${subPage}`;
        const fullUrl = `${baseUrl}${path}`;
        await this.navigateToUrl(fullUrl);
    }

    async navigateToMWSSubPage(subPage: string): Promise<void> {
        await this.navigateToSubPage(this.config.baseUrlMWS, subPage);
    }

    async navigateToIFASubPage(subPage: string): Promise<void> {
        await this.navigateToSubPage(this.config.baseUrlIFA, subPage);
    }

    // Page interaction methods
    async clickLinkByText(linkText: string): Promise<void> {
        try {
            const selector = this.getLinkTextSelector(linkText);
            await this.page.waitForSelector(selector, { timeout: this.config.cucumberDefaultTimeoutMs });
            await this.page.click(selector);
            await this.waitForPageLoad();
        } catch (error) {
            Logger.error(`Failed to click link with text: ${linkText}`, error as Error);
            throw error;
        }
    }

    async getElementByText(text: string): Promise<Locator> {
        const selector = this.getTextSelector(text);
        await this.page.waitForSelector(selector, { timeout: this.config.cucumberDefaultTimeoutMs });
        return this.page.locator(selector);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    // Screenshot and visual testing methods
    setMaskSelectors(selectors: string[]): void {
        this.maskSelectors = selectors;
        Logger.debug(`Set mask selectors: ${selectors.join(', ')}`);
    }

    async takeScreenshot(fileName?: string, customPath?: string): Promise<Buffer> {
        try {
            const maskLocators: Locator[] = this.maskSelectors.map(selector =>
                this.page.locator(selector)
            );

            const screenshotOptions: any = {
                fullPage: this.config.screenshot.fullPage,
                mask: maskLocators
            };

            if (fileName && customPath) {
                const fullPath = path.join(this.config.paths.screenshotsDir, customPath);
                await FileUtils.ensureDirectoryExists(fullPath);
                screenshotOptions.path = path.join(fullPath, `${fileName}.png`);
            }

            Logger.debug(`Taking screenshot with options: ${JSON.stringify(screenshotOptions)}`);
            return await this.page.screenshot(screenshotOptions);
        } catch (error) {
            Logger.error('Failed to take screenshot', error as Error);
            throw error;
        }
    }

    // Utility methods
    private async waitForPageLoad(): Promise<void> {
        try {
            await Promise.all([
                this.page.waitForLoadState('networkidle'),
                this.page.waitForLoadState('domcontentloaded')
            ]);
        } catch (error) {
            Logger.warn('Page load wait timeout, continuing...');
        }
    }

    async waitForElement(selector: string, timeout?: number): Promise<void> {
        await this.page.waitForSelector(selector, {
            timeout: timeout || this.config.cucumberDefaultTimeoutMs
        });
    }

    async isElementVisible(selector: string): Promise<boolean> {
        try {
            return await this.page.isVisible(selector);
        } catch {
            return false;
        }
    }

    async scrollToElement(selector: string): Promise<void> {
        const element = this.page.locator(selector);
        await element.scrollIntoViewIfNeeded();
    }

    // Cleanup method
    async cleanup(): Promise<void> {
        // Any cleanup logic specific to the page
        Logger.debug('BasePage cleanup completed');
    }
}