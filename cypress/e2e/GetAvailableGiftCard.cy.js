describe('Lấy danh sách gift-card có thế đổi', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';

    it('Danh sách gift-card của dịch vụ chuyến bay', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/can-exchange?typeVoucher=FLIGHT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');
            expect(body.data.giftCards.length).to.greaterThan(0)

        })
    });

    it('Danh sách gift-card của dịch vụ đưa đón sân bay nhưng không có gift-card nào', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/can-exchange?typeVoucher=AIRPORT',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');
            expect(body.data.giftCards.length).to.eq(0)
        })
    });

    it('Danh sách gift-card của dịch vụ không tồn tại', () => {
        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/can-exchange?typeVoucher=FLIGHT232323',
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
