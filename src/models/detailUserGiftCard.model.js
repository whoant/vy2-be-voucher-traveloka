const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('DetailUserGiftCard', {
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
            validate: {
                isInt: true
            }
        },
        amountAfter: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
    });
};