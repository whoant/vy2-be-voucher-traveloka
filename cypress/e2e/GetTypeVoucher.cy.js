describe('Lấy dịch vụ voucher', function() {

    it('Tạo danh sách dịch vụ voucher', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/type-voucher',
            failOnStatusCode: false,

        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy dánh sách thành công !');
        })
    });

});
