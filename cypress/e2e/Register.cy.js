describe('API tạo user', function() {
    it('Tạo user với không có app_id ở headers', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(400)
            expect(body.status).to.eq('fail')
        })
    });

    it('Tạo user với email đã tồn tại', () => {
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

    it('Tạo user với email không hợp lệ', function() {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            headers: {
                app_id: 'vy02'
            },
            body: {
                "userId": "1",
                "email": "tuan"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(500)
            expect(body.status).to.eq('error')
            expect(body.message).to.eq('Something went very wrong !')
        })
    });

    it('Tạo user với userId là chữ', function() {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            headers: {
                app_id: 'vy02'
            },
            body: {
                "userId": "abc",
                "email": "tuan123@gmail.com"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(200)
            expect(body.status).to.eq('success')
            expect(body.message).to.eq('Tạo user thành công !')
        })
    });

    it('Tạo user với userId là có ký tự đăc biệt', function() {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/auth/register',
            headers: {
                app_id: 'vy02'
            },
            body: {
                "userId": "abc!!!",
                "email": "tuan1233323@gmail.com"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(500)
            expect(body.status).to.eq('error')
            expect(body.message).to.eq('Something went very wrong !')
        })
    });
});
