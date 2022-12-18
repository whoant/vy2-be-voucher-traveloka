describe('Lấy thông tin chi tiết gift-card', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVHXDom4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuMiIsImVtYWlsIjoidm92YW5ob2FuZ3R1YW4yQGdtYWlsLmNvbSIsInN1YiI6IjMzOThDNTk1LTBCNDAtNDk0Ri1BMTMwLTFGNzhFNTY5NkFFMSIsInR5cGUiOiJQQVJUTkVSIiwiYXBwSWQiOiJ2eTAzIiwic2VydmljZXMiOlsiQVBBUlQiLCJGTElHSFQiLCJDQVJSRU5UQUwiLCJBSVJQT1JUIiwiSE9URUwiLCJYUEVSSUVOQ0UiLCJFQVRTIiwiVk9VQ0hFUiIsIkNPTUJPIl0sImlhdCI6MTY3MTM0ODc1OSwiZXhwIjoxNjc5MTI0NzU5fQ.ktoeS9uU02f4CynvqkLwQuT7C66c5qMCcjmBrvEPJ_I';

    it('Thẻ quà tặng đã tồn tại', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/gift-card/detail?type=FLIGHT&code=GIFT_FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy thông tin thành công !');
        })
    });

    it('Thẻ quà tặng chưa tồn tại', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/gift-card/detail?type=hotel&code=END_YEAR_HOTEL12',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Thẻ quà tặng không tồn tại !');
        })
    });
});
