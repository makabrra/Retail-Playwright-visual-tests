const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const browserInfo = getBrowserInfo();
const systemInfo = getSystemInfo();

// Function to get browser info from your config
function getBrowserInfo() {
    const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    return {
        name: config.browser.name,
        version: 'Latest'
    };
}

// Function to get system info
function getSystemInfo() {
    const os = require('os');
    return {
        name: os.platform(),
        version: os.release()
    };
}

report.generate({
    jsonDir: './reports/',
    reportPath: './reports/html/',
    openReportInBrowser: true,
    saveCollectedJSON: true,
    reportName: 'NS&I Visual Testing Report',
    pageTitle: 'NS&I Visual Regression Tests',
    displayDuration: true,
    displayReportTime: true,
    metadata: {
        browser: browserInfo,
        device: 'Test Environment',
        platform: systemInfo
    },
    customData: {
        title: 'Test Information',
        data: [
            { label: 'Project', value: 'NS&I Visual Testing Suite' },
            { label: 'Test Type', value: 'Visual Regression Testing' },
            { label: 'Sites Under Test', value: 'Marketing Website (MWS) & IFA Website' },
            { label: 'Execution Date', value: new Date().toLocaleDateString() },
            { label: 'Execution Time', value: new Date().toLocaleTimeString() },
            { label: 'Browser Mode', value: browserInfo.name === 'chromium' ? 'Headless Chromium' : browserInfo.name },
            { label: 'Test Framework', value: 'Playwright + Cucumber' }
        ]
    }
});