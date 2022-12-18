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

    async find(id) {
        
        return TypeVoucher.findByPk(id);
    }

}

module.exports = TypeVoucherService;