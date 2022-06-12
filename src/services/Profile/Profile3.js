const axios = require('axios');

class Profile3 {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    async getPoint() {
        try {
            const { data } = await axios.get('https://profile.vinhphancommunity.xyz/api/users/me', {
                headers: {
                    authorization: this.accessToken
                }
            });

            return data.data.reward
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async updatePoint(point, appId = '') {
        return true
    }

}

module.exports = Profile3;