# NS&I Visual Testing Suite

A comprehensive visual regression testing framework using Cucumber, Playwright, and TypeScript for NS&I's Marketing Website (MWS) and Independent Financial Adviser (IFA) platforms.

## Features

- **Visual Regression Testing** - Pixel-perfect screenshot comparison with configurable thresholds
- **Multi-Browser Support** - Chrome, Firefox, Edge, WebKit, and Chromium
- **Dual Site Testing** - Automated testing for both MWS and IFA websites
- **Element Masking** - Hide dynamic content for consistent comparisons
- **Detailed Reporting** - HTML reports with screenshot attachments and diff visualizations
- **Baseline Management** - Automatic baseline creation and comparison
- **Flexible Configuration** - JSON-based configuration for all test parameters

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Retail-Playwright-visual-tests

# Install dependencies (recommended)
npm ci

# Or install latest versions
npm install
```

### Basic Usage

```bash
# Run all tests
npm test

# Run MWS tests only
npm run test:mws

# Run IFA tests only
npm run test:ifa

# Test with specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit
npm run test:edge
```

## Project Structure

```
├── features/           # Cucumber feature files
│   ├── MWS/           # Marketing Website scenarios
│   └── IFA/           # IFA Website scenarios
├── step_definitions/   # Test step implementations
├── pages/             # Page Object Model classes
├── utils/             # Utility classes (screenshot comparison, file handling)
├── test-artifacts/    # Generated test outputs
│   ├── baseline/      # Baseline screenshots
│   ├── screenshots/   # Current test screenshots
│   ├── diff/          # Difference visualizations
│   └── reports/       # HTML test reports
├── config.json        # Main configuration file
└── mask-config.json   # Element masking configuration
```

## Configuration

### Main Configuration (`config.json`)

```json
{
  "baseUrlMWS": "https://www.nsandi.com",
  "baseUrlIFA": "https://www.nsandi-adviser.com",
  "browser": {
    "name": "firefox",
    "headless": false,
    "viewport": { "width": 1920, "height": 1080 },
    "slowMo": 500
  },
  "screenshot": {
    "pngComparisonThreshold": 0.001,
    "takeScreenshotsOnFailure": true,
    "fullPage": true
  }
}
```

### Element Masking (`mask-config.json`)

```json
{
  "MWS": ["#header", ".dynamic-content"],
  "IFA": ["#navigation", ".timestamp"]
}
```

## Browser Testing

The framework supports multiple browsers with environment variable override:

```bash
# Using environment variables
BROWSER=chrome npm test
BROWSER=firefox npm run test:mws
BROWSER=webkit npm run test:ifa

# Using dedicated scripts
npm run test:all-browsers  # Runs tests across all browsers
```

## Visual Comparison Process

1. **First Run**: Creates baseline screenshots automatically
2. **Subsequent Runs**: Compares current screenshots against baselines
3. **Threshold Check**: Fails if differences exceed configured threshold (0.1% default)
4. **Diff Generation**: Creates highlighted difference images for failed comparisons

## Adding New Tests

### Create a Feature File

```gherkin
@MWS @All
Feature: New Page Testing

  Scenario Outline: Test "<URL>" page
    Given a User is browsing NS&I marketing website
    When the User navigated to the "<URL>" MWS page
    Then the "MWS" page is displayed properly

    Examples:
      | URL           |
      | /new-page     |
      | /another-page |
```

### Add Element Masking (Optional)

```json
{
  "MWS": ["#header", ".new-dynamic-element"]
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests with default browser |
| `npm run test:mws` | Run Marketing Website tests only |
| `npm run test:ifa` | Run IFA tests only |
| `npm run test:[browser]` | Run tests with specific browser |
| `npm run test:all-browsers` | Run tests across all supported browsers |
| `npm run clean:reports` | Remove all generated reports |
| `npm run report` | Generate HTML report manually |

## Reporting

After each test run, an HTML report is automatically generated in `test-artifacts/reports/html/`. The report includes:

- Test execution summary with pass/fail status
- Screenshot comparisons for visual tests
- Difference highlights for failed comparisons
- Browser and environment metadata
- Execution timestamps and duration

## Troubleshooting

### Common Issues

**Tests failing with dimension mismatch:**
- Ensure consistent viewport settings across test runs
- Check for responsive design changes affecting layout

**High false positive rate:**
- Adjust `pngComparisonThreshold` in config.json
- Add dynamic elements to mask-config.json

**Browser launch failures:**
- Install browsers: `npx playwright install`
- Check browser-specific requirements in documentation

### Debug Mode

Enable detailed logging:
```bash
DEBUG=true npm test
```

### Reset Baselines

To update baselines after intentional UI changes:
```bash
# Remove existing baselines
rm -rf test-artifacts/baseline/

# Run tests to generate new baselines
npm test
```

## Architecture

- **Base Page Class**: Common page interactions and screenshot functionality
- **Screenshot Comparator**: Pixel-level comparison using pixelmatch
- **Browser Manager**: Handles browser lifecycle and configuration
- **File Utils**: Directory management and file operations
- **Test Context**: Scenario-specific state management

## Dependencies

- **@playwright/test**: Browser automation
- **@cucumber/cucumber**: BDD test framework
- **pixelmatch**: Image comparison
- **pngjs**: PNG image processing
- **multiple-cucumber-html-reporter**: HTML report generation

---

For detailed configuration options and advanced usage, refer to the inline documentation in the configuration files.