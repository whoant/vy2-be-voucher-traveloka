const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDay: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDay: {
            type: DataTypes.DATE,
            allowNull: false
        }

    });
};