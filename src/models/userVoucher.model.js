const { Sequelize, DataTypes } = require('sequelize');
const { randomString } = require("../helpers/utilities.helper");

const STATE = {
	TIMEOUT: 'TIMEOUT',
	SPENDING: 'SPENDING',
	OWNED: 'OWNED',
	DONE: 'DONE'
};

module.exports = (sequelize) => {
	return sequelize.define('UserVoucher', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		state: {
			type: DataTypes.ENUM,
			values: [...STATE],
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
		}
	});
};