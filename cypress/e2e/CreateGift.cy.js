describe('Tạo thẻ quà tặng', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidm92YW5ob2FuZ3R1YW4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuIiwiZW1haWwiOiJ2b3ZhbmhvYW5ndHVhbjQuMkBnbWFpbC5jb20iLCJzdWIiOiI0MjczRDQ0RS0xMDI0LTQ0OUQtOUQxQS0wOUQyQjlBMThGRUYiLCJ0eXBlIjoiUEFSVE5FUiIsImFwcElkIjoidnkwMyIsInNlcnZpY2VzIjpbIlZJTExBLUFQQVJUTUVOVCIsIkZMSUdIVCIsIkNBUi1SRU5UQUwiLCJBSVJQT1JULVBJQ0tMRVMiLCJIT1RFTCIsIlRPVVIiLCJSRVNUQVVSQU5UIiwiVk9VQ0hFUiIsIlNBVklORy1DT01CTyJdLCJpYXQiOjE2NzEyOTg5NjksImV4cCI6MTY3OTA3NDk2OX0.nq-PPy3qakXT-nmbJKqciDZXKnPfv07oP7PMRlEgkmA';
    it('Tạo thẻ quà tặng hợp lệ', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL23",
                "effectiveAt": "2022-05-01",
                "expirationAt": "2022-05-30",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Tạo phiếu điểm thưởng thành công !');
        })
    });

    it('Tạo thẻ quà tặng với title rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Tiêu đề phải tồn tại');
        })
    });

    it('Tạo thẻ quà tặng với content rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "12323",
                "content": "",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Nội dung phải tồn tại');
        })
    });

    it('Tạo thẻ quà tặng với limitUse < 0', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": -1,
                "giftCardCode": "END_YEAR_HOTEL",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Số người sử dụng phải là số nguyên dương');
        })
    });

    it('Tạo thẻ quà tặng với giftCardCode đã tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Mã quà tặng đã tồn tại !');
        })
    });

    it('Tạo thẻ quà tặng với pointExchange < 0', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL1",
                "pointExchange": -2,
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
            expect(body.message).to.eq('Số điểm quy đổi không được nhỏ hơn 0');
        })
    });

    it('Tạo thẻ quà tặng với effectiveAt khác format', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/partner/gift-card',
            body: {
                "title": "Sale cuối năm sập sàn",
                "content": "Nhân dịp cuối năm sale sập sàn",
                "limitUse": 10,
                "giftCardCode": "END_YEAR_HOTEL2",
                "pointExchange": 1,
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
            expect(body.message).to.eq('Ngày áp dụng không đúng định dạng');
        })
    });

});
