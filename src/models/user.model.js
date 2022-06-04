const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'User này đã tồn tại !'
            }
        },
        encryptToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: {
                    args: true,
                    msg: 'Email không hợp lệ !'
                }
            }
        },
    });
};