module.exports = {
    // The rest of the Cypress config options go here...
    projectId: "uwa8em",

    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'https://api-voucher.votuan.xyz',
        failOnStatusCode: false
    },
};
