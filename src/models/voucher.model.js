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
        limitUse: {
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
        limitDay: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount: {
          type: DataTypes.BIGINT,
          allowNull: false
        },
        expirationAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });
};