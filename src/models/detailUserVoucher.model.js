const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('DetailUserVoucher', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		transactionId: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số tiền không hợp lệ !'
				}
			}
		},
		amountAfter: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số tiền sau khi giảm không hợp lệ !'
				}
			}
		},
	});
};