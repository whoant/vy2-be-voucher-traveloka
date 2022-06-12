const axios = require('axios');

class Profile3 {
    constructor(accessToken) {
        this.accessToken = accessToken.split(' ')[1];
    }

    async getPoint() {
        try {
            const { data } = await axios.post('https://gxyvy04g01backend-production.up.railway.app/Customer/getAvailablePoint', {
                TOKEN: this.accessToken
            });

            return data.POINT_AVAILABLE
        } catch (e) {
            return Promise.reject(e)
        }
    }

    async updatePoint(point, appId) {
        try {
            const { data } = await axios.post("https://gxyvy04g01backend-production.up.railway.app/Customer/subtractPoint", {
                TOKEN: this.accessToken,
                APP_ID: appId,
                POINT: point
            });

            return data.MESSAGE
        } catch (e) {
            return Promise.reject(e);
        }
    }

}

module.exports = Profile3;