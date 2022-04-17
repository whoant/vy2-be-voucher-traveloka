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
            type: DataTypes.TEXT,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        limitUse: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        voucherCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        limitDay: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        amount: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        expirationAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ["voucherCode"]
            }
        ]
    });
};