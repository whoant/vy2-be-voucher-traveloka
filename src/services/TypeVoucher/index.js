const { TypeVoucher } = require("../../models");

class TypeVoucherService {
    constructor(typeVoucher) {
        this.typeVoucher = typeVoucher;
    }

    createTypeVoucher(typeVoucherParam) {
        const { name, type } = typeVoucherParam;
        return TypeVoucher.create({
            name, type
        });
    }

}

module.exports = TypeVoucherService;