const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Load configuration
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

// Generate HTML report
report.generate({
    jsonDir: config.paths.reportsDir,
    reportPath: path.join(config.paths.reportsDir, 'html'),
    openReportInBrowser: true,
    saveCollectedJSON: true,
    reportName: 'NS&I Visual Testing Report',
    pageTitle: 'NS&I Visual Regression Tests',
    displayDuration: true,
    displayReportTime: true,
    metadata: {
        browser: {
            name: config.browser.name,
            version: 'Latest'
        },
        device: 'Test Environment',
        platform: {
            name: os.platform(),
            version: os.release()
        }
    },
    customData: {
        title: 'Test Information',
        data: [
            { label: 'Project', value: 'NS&I Visual Testing Suite' },
            { label: 'Test Type', value: 'Visual Regression Testing' },
            { label: 'Sites Under Test', value: 'Marketing Website (MWS) & IFA Website' },
            { label: 'Execution Date', value: new Date().toLocaleDateString() },
            { label: 'Execution Time', value: new Date().toLocaleTimeString() },
            { label: 'Browser Mode', value: config.browser.headless ? `Headless ${config.browser.name}` : config.browser.name },
            { label: 'Test Framework', value: 'Playwright + Cucumber' }
        ]
    }
});