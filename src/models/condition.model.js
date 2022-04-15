const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Condition', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        threshold: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        discount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        maxAmount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        typeDiscount: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'PERCENT'
        },
    });
};