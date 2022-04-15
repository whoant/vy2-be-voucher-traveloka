const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Payment', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isCreditCard: true
            }
        }
    });
};