export interface Config {
  baseUrl: string;
  baseUrlIFA: string;
  baseUrlMWS: string;
  png_comparision_threshold: number;
  png_comparision_maxdiffpixels: number;
  cucumber_default_timeout_ms: number;
  take_screenshots_on_failure: boolean;
  browser: {
    name: string;
    headless: boolean;
  };
}