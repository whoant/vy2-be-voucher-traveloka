describe('Lấy danh sách gift-card đang sở hữu', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';

    it('Danh sách gift-card đang sở hữu', () => {

        cy.request({
            method: 'GET',
            url: 'api/v1/user/gift-card/owner?type=available',
            failOnStatusCode: false,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Lấy danh sách thành công !');
        })
    });

});
