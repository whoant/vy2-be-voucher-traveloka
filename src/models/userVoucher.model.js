const { Sequelize, DataTypes } = require('sequelize');
const { randomString } = require("../helpers/utilities.helper");

const STATE = {
    TIMEOUT: 'TIMEOUT',
    SPENDING: 'SPENDING',
    OWNED: 'OWNED',
    DONE: 'DONE'
};

module.exports = (sequelize) => {
    const UserVoucher = sequelize.define('UserVoucher', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        state: {
            type: DataTypes.ENUM,
            values: Object.values(STATE),
            defaultValue: 'SPENDING'
        },
        refCode: {
            type: DataTypes.STRING(10),
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        hooks: {
            beforeCreate(attributes, options) {
                const { state } = attributes.dataValues;
                if (state === STATE.SPENDING) {
                    attributes.dataValues.refCode = randomString(10);
                }
            },
            beforeUpdate(instance, options) {
            }
        },
    });

    UserVoucher.prototype.isOwned = function () {
        return this.state === STATE.OWNED
    };

    UserVoucher.prototype.isSpending = function () {
        return this.state === STATE.SPENDING
    };

    UserVoucher.prototype.isDone = function () {
        return this.state === STATE.DONE
    };


    return UserVoucher;
};