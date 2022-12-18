describe('Kiểm tra transaction này có đủ điều kiện để sử dụng hay không', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';
    const userId = '1AC2B836-7CE2-488C-B860-FEC63C0C009B';

    it('Gift-card đủ điều kiện để sử dụng', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/check-condition?amount=1000000&code=AAAAAA&typeVoucher=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Đủ điền kiện !');
        })
    });

    it('Gift-card không điều kiện để sử dụng', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/check-condition?amount=1000000&code=AAAAAA&typeVoucher=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Không đủ điều kiện');

        })
    });

});
