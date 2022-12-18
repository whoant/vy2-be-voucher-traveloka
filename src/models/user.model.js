const { Sequelize, DataTypes } = require('sequelize');
const { APP_ID } = require("../constants");

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
                msg: 'UserId đã tồn tại !'
            },
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
            },
            unique: {
                args: true,
                msg: 'Email đã tồn tại !'
            },
        },
        appId: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: Object.values(APP_ID),
        }
    }, {
        indexes: [
            {
                unique: true,
                fields: ['email', 'userId']
            }
        ]
    });
};