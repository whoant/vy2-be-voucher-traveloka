const axios = require('axios');

class Profile3 {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    async getPoint() {
        try {
            const { data } = await axios.get('http://94.100.26.30:3010/api/users/me', {
                headers: {
                    authorization: this.accessToken
                }
            });

            return data.data.reward
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async updatePoint(point, appId = '', userId = '') {
        return axios.post('http://94.100.26.30:3010/api/vouchers/reward', {
            userId,
            reward: point
        }, {
            headers: {
                service: 'VOUCHER'
            }
        });
    }

    order(productName, price, point, partnerId, userId) {
        return axios.post('http://94.100.26.30:3010/api/orders', {
            "reward": point,
            "details": [
                {
                    productName,
                    price,
                    quality: 1,
                    link: "https://voucher.votuan.xyz/"
                }
            ],
            partnerId,
            userId
        }, {
            headers: {
                service: 'VOUCHER'
            }
        });
    }

}

module.exports = Profile3;
