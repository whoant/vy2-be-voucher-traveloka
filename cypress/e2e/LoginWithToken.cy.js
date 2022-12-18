describe('Đăng nhập sử dụng token', function() {
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
    //
    // beforeEach(() => {
    //     cy.request('POST', 'api/v1/user/auth/login', { email: 'tuan@gmail.com' })
    //       .its('data')
    //       .as('currentUser')
    // })

    it('Đăng nhập với token không hợp lệ', () => {
        cy.request({
            method: 'GET',
            url: `api/v1/user/auth/login-token?=eyJhbGciOiJIUzI1N3333iIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjcwMjYwOTEzLCJleHAiOjE2NzgwMzY5MTN9.J-KzBJ0FFc7iaA8nIbInMJJFjKJ98Q4Bb-W232323`,
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
            url: `api/v1/user/auth/login-token?=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjcwMjg1ODM0LCJleHAiOjE2NzgwNjE4MzR9.4xjlPR9_8QztEJpc10kyjFrZ_p-cbi1vh3__y6TlK-w`,
            headers: {
                'app_id': 'vy03'
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Đăng nhập thành công !');
        })
    });
});
