const paypal = require("@paypal/checkout-server-sdk");
const { VNDtoUSD } = require("../../helpers/currencyConverter.helper");
const paypalClient = require("../../config/paypal");

const createOrder = async (name, amount) => {
    try {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD',
                        value: amount,
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount
                            }
                        }
                    },
                    items: [
                        {
                            name,
                            unit_amount: {
                                currency_code: 'USD',
                                value: amount
                            },
                            quantity: 1
                        }
                    ]
                }
            ]
        });
        const order = await paypalClient.execute(request);

        return order.result.id;
    } catch (e) {
        return Promise.reject(e);
    }
};

const refundOrder = async (captureId) => {
    try {
        const request = await paypal.payments;
    } catch (e) {

    }
}

module.exports = {
    createOrder
};