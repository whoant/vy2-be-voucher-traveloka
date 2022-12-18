describe('Cập nhập trạng thái gift-card', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';
    const userId = '1AC2B836-7CE2-488C-B860-FEC63C0C009B';

    it('Áp dụng gift-card đã sở hữu', () => {
        cy.request({
            method: 'PUT',
            url: 'api/v1/user/gift-card/state',
            failOnStatusCode: false,
            body: {
                "typeVoucher": "AIRPORT",
                "orderId": "order:OKEE22323:b6d9d719-b740-49c8-a82c-985b6b42a977:6b37405f-4f26-4e48-9de1-2d3ad3aa656d"
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

    it('Áp dụng gift-card thất bại', () => {
        cy.request({
            method: 'PUT',
            url: 'api/v1/user/gift-card/state',
            failOnStatusCode: false,
            body: {
                "typeVoucher": "AIRPORT",
                "orderId": "order:OKEE22323:b6d9d719-b740-49c8-a82c-985b6b42a977:6b37405f-4f26-4e48-9de1-2d3ad3aa656d"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(500);
            expect(body.status).to.eq('error');
            expect(body.message).to.eq('Something went very wrong !');
        })
    });

});
