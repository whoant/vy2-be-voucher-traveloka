const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('GiftCard', {
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
		giftCardCode: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: {
				args: true,
				msg: 'Mã quà tặng đã tồn tại !'
			}
		},
		limitDay: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số ngày giới hạn không hợp lệ !'
				}
			}
		},
		expirationAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		typeGift: {
			type: DataTypes.STRING(10),
			allowNull: false,
			default: 'PERCENT'
		},
		discount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số giảm giá không hợp lệ !'
				}
			}
		},
		pointExchange: {
			type: DataTypes.INTEGER,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Điểm đổi không hợp lệ !'
				}
			}
		},

	}, {
		indexes: [
			{
				unique: true,
				fields: ["giftCardCode"]
			}
		]
	});
};