describe('Tạo voucher', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidm92YW5ob2FuZ3R1YW4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuIiwiZW1haWwiOiJ2b3ZhbmhvYW5ndHVhbjQuMkBnbWFpbC5jb20iLCJzdWIiOiI0MjczRDQ0RS0xMDI0LTQ0OUQtOUQxQS0wOUQyQjlBMThGRUYiLCJ0eXBlIjoiUEFSVE5FUiIsImFwcElkIjoidnkwMyIsInNlcnZpY2VzIjpbIlZJTExBLUFQQVJUTUVOVCIsIkZMSUdIVCIsIkNBUi1SRU5UQUwiLCJBSVJQT1JULVBJQ0tMRVMiLCJIT1RFTCIsIlRPVVIiLCJSRVNUQVVSQU5UIiwiVk9VQ0hFUiIsIlNBVklORy1DT01CTyJdLCJpYXQiOjE2NzEyOTg5NjksImV4cCI6MTY3OTA3NDk2OX0.nq-PPy3qakXT-nmbJKqciDZXKnPfv07oP7PMRlEgkmA';
    it('Tạo voucher hợp lệ', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/voucher',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "voucherCode": "END_YEAR_HOTEL",
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
                "voucherCode": "END_YEAR_HOTEL",
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
                "voucherCode": "END_YEAR_HOTEL",
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
                "voucherCode": "END_YEAR_HOTEL",
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
                "voucherCode": "END_YEAR_HOTEL",
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
                "voucherCode": "END_YEAR_HOTEL1",
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
                "voucherCode": "END_YEAR_HOTEL2",
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
