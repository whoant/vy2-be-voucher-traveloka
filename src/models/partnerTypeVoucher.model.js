const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PartnerTypeVoucher = sequelize.define('PartnerTypeVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    });

    return PartnerTypeVoucher;
};