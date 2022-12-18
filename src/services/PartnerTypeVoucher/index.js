const { PartnerTypeVoucher, TypeVoucher } = require("../../models");
const AppError = require("../../helpers/appError.helper");

class PartnerTypeVoucherService {
    constructor(partnerVoucher) {
        this.partnerVoucher = partnerVoucher;
    }

    async find(partnerId, type) {
        const typeVoucher = await this.findTypeVoucher(type);

        const partnerVoucher = await PartnerTypeVoucher.findOne({
            where: {
                partnerId,
                typeVoucherId: typeVoucher.id
            }
        });

        if (!partnerVoucher) throw new AppError('Partner không tồn tại !', 400);
        this.partnerVoucher = partnerVoucher;

        return partnerVoucher;
    }

    async createVoucher(voucher) {
        return this.partnerVoucher.createVoucher(voucher);
    }

    async findTypeVoucher(type) {
        const typeVoucher = await TypeVoucher.findOne({
            where: {
                type
            }
        });
        if (!typeVoucher) throw new AppError('Loại voucher không tồn tại !', 400);

        return typeVoucher;
    }

    createGiftCard(gift) {
        return this.partnerVoucher.createGiftCard(gift);
    }

    getId() {
        return this.partnerVoucher.id;
    }

}

module.exports = PartnerTypeVoucherService;