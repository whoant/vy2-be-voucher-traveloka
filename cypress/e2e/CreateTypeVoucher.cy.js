const { randomString } = require('../../src/helpers/utilities.helper');
describe('Tạo loại dịch vụ voucher', function() {

    it('Tạo loại voucher chưa tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/type-voucher',
            body: {
                "name": `Combo tiết kiệm ${randomString(5)}`,
                "type": `${randomString(10)}`
            },
            failOnStatusCode: false,

        }).should(({ status, body }) => {
            expect(status).to.eq(200);
            expect(body.status).to.eq('success');
            expect(body.message).to.eq('Tạo loại voucher thành công !');
        })
    });

    it('Tạo loại voucher với name rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/type-voucher',
            body: {
                "name": "",
                "type": "COMBO12323"
            },
            failOnStatusCode: false,

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo loại voucher với type rỗng', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/type-voucher',
            body: {
                "name": "ABC",
                "type": ""
            },
            failOnStatusCode: false,

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Dữ liệu không hợp lệ !');
        })
    });

    it('Tạo loại voucher đã tồn tại', () => {
        cy.request({
            method: 'POST',
            url: 'api/v1/type-voucher',
            body: {
                "name": "Combo tiết kiệm",
                "type": "COMBO"
            },
            failOnStatusCode: false,

        }).should(({ status, body }) => {
            expect(status).to.eq(400);
            expect(body.status).to.eq('fail');
            expect(body.message).to.eq('Loại voucher này đã tồn tại !');
        })
    });

});
