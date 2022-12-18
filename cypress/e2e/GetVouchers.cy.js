describe('Lấy danh sách voucher', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMiIsImVtYWlsIjoidm92YW5ob2FuZ3R1YW4yQGdtYWlsLmNvbSIsInN1YiI6IjMzOThDNTk1LTBCNDAtNDk0Ri1BMTMwLTFGNzhFNTY5NkFFMSIsInR5cGUiOiJQQVJUTkVSIiwiYXBwSWQiOiJ2eTAzIiwic2VydmljZXMiOlsiQVBBUlQiLCJGTElHSFQiLCJDQVJSRU5UQUwiLCJBSVJQT1JUIiwiSE9URUwiLCJYUEVSSUVOQ0UiLCJFQVRTIiwiVk9VQ0hFUiIsIkNPTUJPIl0sImlhdCI6MTY3MTM0ODc1OSwiZXhwIjoxNjc5MTI0NzU5fQ.ktoeS9uU02f4CynvqkLwQuT7C66c5qMCcjmBrvEPJ_I';

    it('Danh sách voucher của dịch vụ khách sạn', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/voucher?type=HOTEL',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách voucher thành công !');
        })
    });

    it('Danh sách voucher của dịch vụ Chuyến bay', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/voucher?type=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách voucher thành công !');
        })
    });

    it('Danh sách voucher của dịch vụ Tour du lịch và dịch vụ tour không tồn tại', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/voucher?type=TOUR',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Loại voucher không tồn tại !');
        })
    });
});
