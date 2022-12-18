describe('Đăng nhập không cần password', function() {
    it('Đăng nhập với email tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/login',
            body: {
                "email": "tuan@gmail.com"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Đăng nhập thành công !');
        })
    });

    it('Đăng nhập với email không tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/login',
            body: {
                "email": "tuan12@gmail.com"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(500);
            expect(body.status).to.eq('error');
            expect(body.message).to.eq('Tài khoản không tồn tại !');
        })
    });
});
