const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const TypeVoucher = sequelize.define('TypeVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Loại voucher này đã tồn tại !'
            }
        }
    }, {
        hooks: {}
    });


    return TypeVoucher;
};