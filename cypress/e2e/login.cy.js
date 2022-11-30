describe('API create user', function () {
    it('If create user without app_id in header, then throw error', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(400)
            expect(body.status).to.eq('fail')
        })
    });

    it('Create user with email exists', () => {

        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            headers: {
                app_id: 'vy02'
            },
            body: {
                "userId": "1",
                "email": "tuan@gmail.com"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(400)
            expect(body.status).to.eq('fail')
            expect(body.message).to.eq('Email đã tồn tại !')
        })
    });
});