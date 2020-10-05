const approuter = require('@sap/approuter');
const fs = require('fs');

process.env.destinations = `
    [
        {
            "name": "backend",
            "url": "http://localhost:4004/"
        },
        {
            "name": "siltron_dev",
            "url": "https://my302950.s4hana.ondemand.com/"
        }
    ]
`;

const xsAppConfig = JSON.parse(fs.readFileSync('xs-app.json', 'utf8'));
const ar = approuter();
ar.start({
    xsappConfig: xsAppConfig
});