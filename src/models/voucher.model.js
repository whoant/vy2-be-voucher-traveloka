const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Voucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        limitedUse: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        voucherCode: {
            type: DataTypes.STRING,
            allowNull: false
        },
        limitedAt: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        expirationAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};