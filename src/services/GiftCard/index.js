class GiftCardService {
    constructor(partnerVoucher) {
        this.partnerTypeVoucher = partnerVoucher;
    }

    createGiftCard(gift) {
        this.partnerTypeVoucher.createGiftCard(gift);
    }
}

module.exports = GiftCardService;