const { Sequelize, DataTypes } = require('sequelize');
const moment = require("moment");
const { STATE_PROMOTION } = require('../constants');

module.exports = (sequelize) => {
    const UserGiftCard = sequelize.define('UserGiftCard', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        state: {
            type: DataTypes.ENUM,
            values: Object.values(STATE_PROMOTION),
            defaultValue: STATE_PROMOTION.OWNED
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        hooks: {
            beforeCreate(attributes, options) {
            },
            beforeUpdate(attributes, options) {
                
            }
        },
    });

    UserGiftCard.prototype.isOwned = function () {
        return this.state === STATE_PROMOTION.OWNED;
    };

    UserGiftCard.prototype.isDone = function () {
        return this.state === STATE_PROMOTION.DONE;
    }

    return UserGiftCard;

};