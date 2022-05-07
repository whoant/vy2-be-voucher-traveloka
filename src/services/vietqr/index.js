const axios = require('axios');

class VietQR {
    getListBanks() {

        return axios.get('https://api.vietqr.io/v2/banks');
    }

    async generateQR(info) {
        const { bin, accountNo, amount, description, accountName } = info;

        const link = `https://img.vietqr.io/image/${bin}-${accountNo}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;

        const data = await axios.get(link, {
            responseType: 'arraybuffer'
        });

        return Buffer.from(data.data, 'binary').toString('base64');
    }
}

module.exports = new VietQR();