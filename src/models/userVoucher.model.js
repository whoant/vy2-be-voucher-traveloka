const { Sequelize, DataTypes } = require('sequelize');
const moment = require("moment");

const STATE = {
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
            defaultValue: STATE.OWNED
        },
        refCode: {
            type: DataTypes.STRING(10),
        },
        effectiveAt: {
            type: DataTypes.DATE,
        },
        usedAt: {
            type: DataTypes.DATE,
        }
    }, {
        hooks: {
            beforeCreate(attributes, options) {
            },
            beforeUpdate(attributes, options) {
                let { state } = attributes;
                if (state === STATE.DONE) {
                    attributes.usedAt = moment().toDate();
                    if (attributes._previousDataValues.state === STATE.OWNED) {
                        attributes.effectiveAt = moment().toDate();
                    }

                }

            }
        },
    });

    UserVoucher.prototype.isOwned = function () {
        return this.state === STATE.OWNED;
    };

    UserVoucher.prototype.isDone = function () {
        return this.state === STATE.DONE;
    }

    return UserVoucher;
};