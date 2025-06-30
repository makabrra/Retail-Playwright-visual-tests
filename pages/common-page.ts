import { Page, Locator } from 'playwright';
import * as configData from '../config.json';
import { Config } from '../config.types';

const config: Config = configData as Config;

export default class BasePage {

    private readonly LINK_TEXT_SELECTOR_PLACEHOLDER = (linkText: string) => `//a[text()="${linkText}"]`;
    private readonly TEXT_SELECTOR_PLACEHOLDER = (linkText: string) => `//*[contains(text(), '${linkText}')]`;
    private maskSelectors: string[] = [];
    
    protected readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    setMaskSelectors(selectors: string[]) {
        this.maskSelectors = selectors;
    }

    async openMainPage() {
    await this.page.goto(config.baseUrl);
    }
    
    async openMarketingWebsiteMainPage() {
        await this.page.goto(config.baseUrlMWS);
    }

    async openAdviserWebsiteMainPage() {
        await this.page.goto(config.baseUrlIFA);
    }

    async navigateToSubPageMWS(subPage: string): Promise<void> {
        const path = subPage.startsWith('/') ? subPage : `/${subPage}`;
        await this.page.goto(`${config.baseUrlMWS}${path}`);
    }

    async navigateToSubPageIFA(subPage: string): Promise<void> {
        const path = subPage.startsWith('/') ? subPage : `/${subPage}`;
        await this.page.goto(`${config.baseUrlIFA}${path}`);
    }    

    async clickLinkByLinkText(linkText: string) {
        await this.page.waitForSelector(this.LINK_TEXT_SELECTOR_PLACEHOLDER(linkText));
        await this.page.click(this.LINK_TEXT_SELECTOR_PLACEHOLDER(linkText));
    }

    async takeScreenshot(scenarioName?: string, path?: string): Promise<Buffer> {
        const maskLocators: Locator[] = this.maskSelectors.map(selector => 
        this.page.locator(selector)
        );
        
        return await this.page.screenshot({ 
            path: `screenshots/${path}/${scenarioName}.png`, 
            fullPage: true,
            mask: maskLocators
        });
    }

    async getPageTitle(): Promise<String> {
        return await this.page.title();
    }

    async getLocatorByText(text: string): Promise<Locator> {
        await this.page.waitForSelector(this.TEXT_SELECTOR_PLACEHOLDER(text));
        return this.page.getByText(text);
    }
}