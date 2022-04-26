const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Condition', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        eligible: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Số tiền để nhận voucher không hợp lệ !'
                }
            }
        },
        threshold: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isInt: {
                    args: true,
                    msg: 'Ngưỡng tiền để nhận số tiền tối đa không hợp lệ !'
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
                    msg: 'Số tiền tối đã có thể nhận không hợp lệ !'
                }
            }
        }
    });
};