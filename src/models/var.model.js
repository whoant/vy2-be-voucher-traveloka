const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Var', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        varName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        varValue: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
};