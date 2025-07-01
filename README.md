# Cucumber Playwright Test TypeScript

This is an example project that uses Cucumber, Playwright, and TypeScript for end-to-end testing.

## Installation
Clone the repository

Install the dependencies:

```sh
cd Retail-Playwright-visual-tests
``` 
```sh
npm ci
```
this will install all the dependencies from the `packege-lock.json` file or:
```sh
npm install
```
to install the latest dependencies.

## Running the tests
To run the tests, use the npm test command:

```sh
npm test
```
This will run all the tests that are tagged with `@MWS`. (See `scripts` section in the `package.json` to see/update `test` phase script if needed.)

## Adding new features
To add a new feature, create a new `.feature` file in the `features` directory, and implement the corresponding step definitions in the `step_definitions` directory.

## Adding new step definitions
To add a new step definition, create a new `.ts` file in the `step_definitions` directory, and implement the step definition function using the `Given`, `When`, or `Then` functions from Cucumber.

## Page object hierarchy and adding new pages
This project uses a simple page object hierarchy for organizing the page objects. Each page object is defined in its own TypeScript class and placed in the `pages` folder. All pages inherit from a base page object class. The base class contains common methods for interacting with web pages, such as navigating to a URL, waiting for an element to appear, and taking screenshots.

To add a new page object, create a new TypeScript class that inherits from the base page object class, and implement the methods that are specific to that page.

## Screenshot Comparison
This project uses screenshot comparison to ensure that the UI of the tested pages has not changed unexpectedly. Baseline screenshots are taken from the `baseline_png` folder and are used to compare against the screenshots that are generated during the test execution. This generated screenshots are saved into the `screenshots` folder as a `*_screenshot_*.png` for debug convenience. A diff screenshot that highlights the differences between the two screenshots is generated and saved in the `screenshots` folder as well as a `*_diff.png`.

To perform the comparison, this project uses `pngjs` and `pixelmatch` packages. These packages analyze the difference between two screenshots pixel by pixel and calculate a percentage difference. If the difference is above the threshold - the test fails. The threshold is defined in `config.json` and is set to `0.1` by default.

## Config file
This project uses a `config.json` file for storing configuration options, such as the base URL of the web application, browser headless mode, timeouts, etc. You can modify the `config.json` file to suit your needs.

## Reporting
This project uses the `multiple-cucumber-html-reporter` package for generating HTML reports of the test results. The reports are saved in the `reports` directory after each test run. You can view the reports by opening the `index.html` file in a web browser after tests execution.





