describe('API create user', function () {
    it('Create user without app_id in header', () => {
        cy.request('POST', 'api/v1/user/auth/register')
            .then(resp => {
                expect(resp.status).to.eq(400)
            })
    });
});