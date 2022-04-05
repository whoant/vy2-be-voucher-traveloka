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
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        conditionalMoney: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        startDay: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDay: {
            type: DataTypes.DATE,
            allowNull: false
        },
        typeVoucher: {
            type: DataTypes.SMALLINT,
            allowNull: false
        }

    });
};