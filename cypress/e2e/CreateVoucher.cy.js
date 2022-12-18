const { randomString } = require('../../src/helpers/utilities.helper');
describe('Tạo voucher', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMiIsImVtYWlsIjoidm92YW5ob2FuZ3R1YW4yQGdtYWlsLmNvbSIsInN1YiI6IjMzOThDNTk1LTBCNDAtNDk0Ri1BMTMwLTFGNzhFNTY5NkFFMSIsInR5cGUiOiJQQVJUTkVSIiwiYXBwSWQiOiJ2eTAzIiwic2VydmljZXMiOlsiQVBBUlQiLCJGTElHSFQiLCJDQVJSRU5UQUwiLCJBSVJQT1JUIiwiSE9URUwiLCJYUEVSSUVOQ0UiLCJFQVRTIiwiVk9VQ0hFUiIsIkNPTUJPIl0sImlhdCI6MTY3MTM0ODc1OSwiZXhwIjoxNjc5MTI0NzU5fQ.ktoeS9uU02f4CynvqkLwQuT7C66c5qMCcjmBrvEPJ_I';

    it('Tạo voucher hợp lệ', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": `${randomString(20)}`,
                "amount": 50000,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Tạo voucher thành công !');
        })
    });

    it('Tạo voucher với title rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": `${randomString(20)}`,
                "amount": 50000,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo voucher với content rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "12323",
                "content": "",
                "limitUse": 10,
                "voucherCode": `${randomString(20)}`,
                "amount": 50000,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo voucher với limitUse < 0', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": -1,
                "voucherCode": `${randomString(20)}`,
                "amount": 50000,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo voucher với voucherCode đã tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": `i14DNZbqsbl1kveGWaeE`,
                "amount": 50000,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Mã voucher này đã tồn tại !');
        })
    });

    it('Tạo voucher với amount < 0', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": `${randomString(20)}`,
                "amount": -2,
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo voucher với effectiveAt khác format', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": `${randomString(20)}`,
                "amount": 100,
                "effectiveAt": "05-2022-01",
                "expirationAt": "2022-05-30",
                "threshold": 500000,
                "discount": 20,
                "maxAmount": 20000,
                "type": "hotel"
            },
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

});
