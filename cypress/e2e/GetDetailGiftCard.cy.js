describe('Lấy thông tin chi tiết gift-card', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidm92YW5ob2FuZ3R1YW4iLCJ1c2VybmFtZSI6InZvdmFuaG9hbmd0dWFuIiwiZW1haWwiOiJ2b3ZhbmhvYW5ndHVhbjQuMkBnbWFpbC5jb20iLCJzdWIiOiI0MjczRDQ0RS0xMDI0LTQ0OUQtOUQxQS0wOUQyQjlBMThGRUYiLCJ0eXBlIjoiUEFSVE5FUiIsImFwcElkIjoidnkwMyIsInNlcnZpY2VzIjpbIlZJTExBLUFQQVJUTUVOVCIsIkZMSUdIVCIsIkNBUi1SRU5UQUwiLCJBSVJQT1JULVBJQ0tMRVMiLCJIT1RFTCIsIlRPVVIiLCJSRVNUQVVSQU5UIiwiVk9VQ0hFUiIsIlNBVklORy1DT01CTyJdLCJpYXQiOjE2NzEyOTg5NjksImV4cCI6MTY3OTA3NDk2OX0.nq-PPy3qakXT-nmbJKqciDZXKnPfv07oP7PMRlEgkmA';

    it('Thẻ quà tặng đã tồn tại', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/partner/gift-card/detail?type=hotel&code=END_YEAR_HOTEL',
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
