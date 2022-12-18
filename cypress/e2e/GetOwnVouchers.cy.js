describe('Lấy danh sách voucher khả dụng', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMyIsImVtYWlsIjoidHVhbjExMjEyQGdtYWlsLmNvbSIsInN1YiI6IjQ5MUQ0Rjk0LUM5MUItNEVFRC1BOUEwLTUxQjg3OEZGMTI4QSIsInR5cGUiOiJVU0VSIiwiYXBwSWQiOiJ2eTAzIiwiaWF0IjoxNjcxMzUwMjM3LCJleHAiOjE2NzkxMjYyMzd9.ccjxtxxBpM-c5fB4joLfey6XHVysA2nVXHJO9xlBOck';
    const partnerId = '3398C595-0B40-494F-A130-1F78E5696AE1';
    it('Danh sách voucher đang sở hữu', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/user/voucher/owner?typeVoucher=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                partner_id: partnerId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');

        })
    });

});
