const axios = require('axios');

class VietQR {
    getListBanks() {
        
        return axios.get('https://api.vietqr.io/v2/banks');
    }

    generateQR(info) {
        const { bin, accountNo, amount, description, accountName } = info;

        return `https://img.vietqr.io/image/${bin}-${accountNo}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
    }
}

module.exports = VietQR;