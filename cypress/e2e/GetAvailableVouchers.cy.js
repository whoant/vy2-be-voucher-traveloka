describe('Lấy danh sách voucher khả dụng đ mua', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMyIsImVtYWlsIjoidHVhbjExMjEyQGdtYWlsLmNvbSIsInN1YiI6IjQ5MUQ0Rjk0LUM5MUItNEVFRC1BOUEwLTUxQjg3OEZGMTI4QSIsInR5cGUiOiJVU0VSIiwiYXBwSWQiOiJ2eTAzIiwiaWF0IjoxNjcxMzUwMjM3LCJleHAiOjE2NzkxMjYyMzd9.ccjxtxxBpM-c5fB4joLfey6XHVysA2nVXHJO9xlBOck';

    it('Danh sách voucher của dịch vụ chuyến bay', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/user/voucher/can-buy?typeVoucher=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');
            expect(body.data.vouchers.length).to.gte(0)

        })
    });

    it('Danh sách voucher của dịch vụ khách sạn nhưng không có voucher nào', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/voucher/can-buy?typeVoucher=HOTEL',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');
            expect(body.data.vouchers.length).to.eq(0)
        })
    });

    it('Danh sách voucher của dịch vụ không tồn tại', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/voucher/can-buy?typeVoucher=HOTEL1',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(500);
            expect(body.status).to.eq('error');
            expect(body.message).to.eq('Something went very wrong !');
        })
    });

});
