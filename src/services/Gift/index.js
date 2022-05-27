class GiftService {
    constructor(partnerType) {
        this.partnerType = partnerType
    }

    createGift(gift) {
        this.partnerType.createGiftCard(gift);
    }
}

module.exports = GiftService;