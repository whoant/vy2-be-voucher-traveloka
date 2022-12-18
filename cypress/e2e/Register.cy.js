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
            url: 'http://94.100.26.30:3010/api/auth/signup',
            headers: {
                app_id: 'vy03'
            },
            body: {
                "userId": "",
                "email": "tuan11212@gmail.com",
                "username": "vovanhoangtuan3",
                "name": "Tuân",
                "gender": false,
                "dob": "2001-12-17T17:00:00.000Z",
                "phone": "0703348851",
                "address": "1232323",
                "type": "USER",
                "reward": 0,
                "services": [],
                "companyName": "",
                "access_token": "",
                "password": "vovanhoangtuan3"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(409)
            expect(body.message).to.eq('USER_EXISTED')
        })
    });

    it('Tạo user với email không hợp lệ', function() {
        cy.request({
            method: 'POST',
            url: 'http://94.100.26.30:3010/api/auth/signup',
            headers: {
                app_id: 'vy03'
            },
            body: {
                "userId": "",
                "email": "tuan11212",
                "username": "vovanhoangtuan3",
                "name": "Tuân",
                "gender": false,
                "dob": "2001-12-17T17:00:00.000Z",
                "phone": "0703348851",
                "address": "1232323",
                "type": "USER",
                "reward": 0,
                "services": [],
                "companyName": "",
                "access_token": "",
                "password": "vovanhoangtuan3"
            },
            failOnStatusCode: false
        }).should(({ status, body }) => {
            expect(status).to.eq(409)
            expect(body.message).to.eq('USER_EXISTED')
        })
    });

});
