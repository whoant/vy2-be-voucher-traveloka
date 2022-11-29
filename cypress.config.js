module.exports = {
    // The rest of the Cypress config options go here...
    projectId: "uwa8em",

    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
        baseUrl: 'http://194.233.92.2:30002',
        failOnStatusCode: false
    },
};
