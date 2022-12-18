describe('Áp dụng gift-card', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';
    const userId = '1AC2B836-7CE2-488C-B860-FEC63C0C009B';

    it('Áp dụng gift-card đã sở hữu', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/gift-card/pre-order',
            failOnStatusCode: false,
            body: {
                "code": "GIFT_FLIGHT",
                "typeVoucher": "FLIGHT",
                "transactionId": "334s41111",
                "amount": 1000000
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Áp mã thành công !');
        })
    });

    it('Áp dụng gift-card chưa sở hữu', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/user/gift-card/pre-order',
            failOnStatusCode: false,
            body: {
                "code": "GIFT_FLIGHT111",
                "typeVoucher": "FLIGHT",
                "transactionId": "334s41111",
                "amount": 1000000
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Thẻ quà tặng không tồn tại !');
        })
    });

});
