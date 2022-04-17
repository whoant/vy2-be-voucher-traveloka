const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UserGiftCard', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        state: {
            type: DataTypes.STRING(10),
            allowNull: false,
            defaultValue: 'NOT_USE'
        },
        effectiveAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
    });
};