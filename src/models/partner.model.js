const { Sequelize, DataTypes } = require('sequelize');
const { sha256 } = require("../helpers/hash.helper");
const { randomString } = require("../helpers/utilities.helper");
const { APP_ID } = require("../constants");

module.exports = (sequelize) => {
    return sequelize.define('Partner', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: 'Email đã tồn tại !'
            },
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING,
            unique: {
                args: true,
                msg: 'Tài khoản đã tồn tại !'
            },
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secretKey: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args: true,
                msg: 'Mã bí mật đã tồn tại !'
            }
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
                fields: ['email', 'username']
            }
        ],
        hooks: {
            beforeCreate(record, options) {
                record.dataValues.secretKey = randomString(10);
                record.dataValues.password = sha256(record.dataValues.password);
            },
            beforeFind(options) {
                if (options.where?.password)
                    options.where.password = sha256(options.where.password);
            }
        }
    });
};