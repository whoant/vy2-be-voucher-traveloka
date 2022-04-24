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
			unique: true,
			primaryKey: true,
			allowNull: false,
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