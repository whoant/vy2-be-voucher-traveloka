describe('Đăng nhập sử dụng token', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMiIsImVtYWlsIjoidm92YW5ob2FuZ3R1YW4yQGdtYWlsLmNvbSIsInN1YiI6IjMzOThDNTk1LTBCNDAtNDk0Ri1BMTMwLTFGNzhFNTY5NkFFMSIsInR5cGUiOiJQQVJUTkVSIiwiYXBwSWQiOiJ2eTAzIiwic2VydmljZXMiOlsiQVBBUlQiLCJGTElHSFQiLCJDQVJSRU5UQUwiLCJBSVJQT1JUIiwiSE9URUwiLCJYUEVSSUVOQ0UiLCJFQVRTIiwiVk9VQ0hFUiIsIkNPTUJPIl0sImlhdCI6MTY3MTM0ODc1OSwiZXhwIjoxNjc5MTI0NzU5fQ.ktoeS9uU02f4CynvqkLwQuT7C66c5qMCcjmBrvEPJ_I';

    it('Đăng nhập với header không tồn tại app_id', () => {
        cy.request({
            method: 'GET',
            url: `api/v1/user/auth/login-token?token=12121212`,
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Thêm app_id vào header với value theo nhóm: vy01, vy02, vy03, vy04. Ví dụ: app_id: vy03');
        })
    });

    it('Đăng nhập với token không hợp lệ', () => {
        cy.request({
            method: 'GET',
            url: `/api/v1/user/auth/login-token?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbm2222d0dWFuMyIsImVtYWlsIjoidHVhbjExMjEyQGdtYWlsLmNvbSIsInN1YiI6IjQ5MUQ0Rjk0LUM5MUItNEVFRC1BOUEwLTUxQjg3OEZGMTI4QSIsInR5cGUiOiJVU0VSIiwiYXBwSWQiOiJ2eTAzIiwiaWF0IjoxNjcxMzUwMjM3LCJleHAiOjE2NzkxMjYyMzd9.ccjxtxxBpM-c5fB4joLfey6XHVysA2nVXHJO9xlBOck&appId=vy03`,
            headers: {
                'app_id': 'vy03'
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Token không hợp lệ !');
        })
    });

    it('Đăng nhập với token hợp lệ', () => {
        cy.request({
            method: 'GET',
            url: `/api/v1/user/auth/login-token?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMyIsImVtYWlsIjoidHVhbjExMjEyQGdtYWlsLmNvbSIsInN1YiI6IjQ5MUQ0Rjk0LUM5MUItNEVFRC1BOUEwLTUxQjg3OEZGMTI4QSIsInR5cGUiOiJVU0VSIiwiYXBwSWQiOiJ2eTAzIiwiaWF0IjoxNjcxMzUwMjM3LCJleHAiOjE2NzkxMjYyMzd9.ccjxtxxBpM-c5fB4joLfey6XHVysA2nVXHJO9xlBOck&appId=vy03`,
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Đăng nhập thành công !');
        })
    });
});
