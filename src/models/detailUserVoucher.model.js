const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('DetailUserVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        transactionId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        amount: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        amountAfter: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    });
};