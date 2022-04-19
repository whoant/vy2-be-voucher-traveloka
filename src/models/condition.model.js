const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	return sequelize.define('Condition', {
		id: {
			type: DataTypes.UUID,
			allowNull: false,
			primaryKey: true,
			defaultValue: Sequelize.UUIDV4,
		},
		threshold: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Ngưỡng tiền không hợp lệ !'
				}
			}
		},
		discount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số tiền giảm giá không hợp lệ !'
				}
			}
		},
		maxAmount: {
			type: DataTypes.BIGINT,
			allowNull: false,
			validate: {
				isInt: {
					args: true,
					msg: 'Số tiền không hợp lệ !'
				}
			}
		}
	});
};