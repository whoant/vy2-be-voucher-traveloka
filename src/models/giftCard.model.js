const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('GiftCard', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        limitUse: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        giftCardCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        limitDay: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expirationAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        typeGift: {
            type: DataTypes.STRING(10),
            allowNull: false,
            default: 'PERCENT'
        },
        discount: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        pointExchange: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    }, {
        indexes: [
            {
                unique: true,
                fields: ["giftCardCode"]
            }
        ]
    });
};