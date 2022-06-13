const { GiftCard } = require("../../models");
const AppError = require("../../helpers/appError.helper");

class GiftCardService {
    constructor(partnerVoucher) {
        this.partnerTypeVoucher = partnerVoucher;
    }

    createGiftCard(gift) {
        this.partnerTypeVoucher.createGiftCard(gift);
    }

    async getGiftFromCode(code) {
        const giftCard = await GiftCard.findOne({
            where: {
                giftCardCode: code,
                partnerTypeId: this.partnerTypeVoucher.getId(),
            },
        });

        if (!giftCard) throw new AppError("Thẻ quà tặng không tồn tại !", 400);

        return giftCard;
    }
}

module.exports = GiftCardService;