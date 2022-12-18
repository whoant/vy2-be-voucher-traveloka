describe('Xác nhận mua voucher', function() {
    const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVsO1IFbEg24gSG_DoG5nIFR1w6JuIiwidXNlcm5hbWUiOiJ2b3ZhbmhvYW5ndHVhbjEiLCJlbWFpbCI6InZvdmFuaG9hbmd0dWFuMUBnbWFpbC5jb20iLCJzdWIiOiIxQUMyQjgzNi03Q0UyLTQ4OEMtQjg2MC1GRUM2M0MwQzAwOUIiLCJ0eXBlIjoiVVNFUiIsImFwcElkIjoidnkwMyIsImlhdCI6MTY3MTMzNDgyMywiZXhwIjoxNjc5MTEwODIzfQ.BU4FacECf2oGpJPU54t-0yhZMrSckvNAP7TG38bKOKc';
    const userId = '1AC2B836-7CE2-488C-B860-FEC63C0C009B';
    const partnerId = '4273D44E-1024-449D-9D1A-09D2B9A18FEF';

    it('Xác nhận mua không hợp lệ', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/webhook/paypal-success',
            failOnStatusCode: false,
            body: {
                "transactionId": "26683f23-c431-41b3-bf79-f1c006279027|28888b28-5846-46e2-843b-abaabc3ca009",
                "paymentId": "12323-3232-333"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId,
                partner_id: partnerId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Giao dịch không tồn tại !');

        })
    });

    it('Xác nhận mua hợp lệ', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/webhook/paypal-success',
            failOnStatusCode: false,
            body: {
                "transactionId": "26683f23-c431-41b3-bf79-f1c006279027|28888b28-5846-46e2-843b-abaabc3ca009",
                "paymentId": "12323-3232-333"
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
                user_id: userId,
                partner_id: partnerId
            }
        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Mua voucher thành công !');

        })
    });
});
