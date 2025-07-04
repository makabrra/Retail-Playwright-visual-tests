export interface BrowserConfig {
  name: 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'edge';
  headless: boolean;
  viewport?: {
    width: number;
    height: number;
  };
  slowMo?: number;
}

export interface ScreenshotConfig {
  pngComparisonThreshold: number;
  takeScreenshotsOnFailure: boolean;
  fullPage: boolean;
}

export interface PathConfig {
  baselineDir: string;
  screenshotsDir: string;
  reportsDir: string;
  diffDir: string;
}

export interface Config {
  baseUrlIFA: string;
  baseUrlMWS: string;
  cucumberDefaultTimeoutMs: number;
  browser: BrowserConfig;
  screenshot: ScreenshotConfig;
  paths: PathConfig;
}

export interface MaskConfig {
  [key: string]: string[];
}

export interface ScreenshotComparisonResult {
  isMatch: boolean;
  diffPixels: number;
  totalPixels: number;
  diffPercentage: number;
  diffImagePath?: string;
}