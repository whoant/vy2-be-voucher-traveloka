class UserVoucherService {

    constructor(userVoucher) {
        this.userVoucher = userVoucher;
    }

    async updateStateUserVoucher(state) {
        this.userVoucher.state = state;
        return this.userVoucher.save();
    }

}

module.exports = UserVoucherService;
