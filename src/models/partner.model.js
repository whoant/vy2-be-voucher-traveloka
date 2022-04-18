const { Sequelize, DataTypes } = require('sequelize');
const { sha256 } = require("../helpers/hash.helper");

module.exports = (sequelize) => {
	return sequelize.define('Partner', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		username: {
			type: DataTypes.STRING,
			unique: true,
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
	}, {
		hooks: {
			beforeCreate(record, options) {
				record.dataValues.password = sha256(record.dataValues.password);
			},
			beforeFind(options) {
				options.where.password = sha256(options.where.password);
			}
		}
	});
};