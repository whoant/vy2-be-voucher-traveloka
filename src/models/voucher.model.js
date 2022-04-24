const { Sequelize, DataTypes } = require('sequelize');
const { compareDate } = require("../helpers/utilities.helper");

module.exports = (sequelize) => {
	return sequelize.define('Voucher', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		limitUse: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số người sử dụng không hợp lệ !'
				}
			}
		},
		effectiveAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW
		},
		voucherCode: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				args: true,
				msg: 'Mã voucher này đã tồn tại !'
			}
		},
		limitDay: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số ngày không hợp lệ !'
				}
			}
		},
		imageUrl: {
			type: DataTypes.STRING,
		},
		amount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			defaultValue: 0,
			validate: {
				isInt: {
					args: true,
					msg: 'Số tiền không hợp lệ !'
				}
			}
		},
		expirationAt: {
			type: DataTypes.DATE,
			allowNull: false
		}
	}, {
		indexes: [
			{
				unique: true,
				fields: ["voucherCode"]
			}
		],
		hooks: {
			beforeCreate(attributes, options) {
				const { effectiveAt, expirationAt } = attributes.dataValues;
				if (!compareDate(effectiveAt, expirationAt)) throw new Error('Ngày hết hiệu lực phải lớn hơn ngày bắt đầu !');
			}
		}
	});
};