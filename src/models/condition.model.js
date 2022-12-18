const { Sequelize, DataTypes } = require('sequelize');
const { formatMoney } = require("../helpers/utilities.helper");

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
        },
        description: {
            type: DataTypes.VIRTUAL,
            get() {
                const formatThreshold = formatMoney(this.threshold);
                const formatMaxAmount = formatMoney(this.maxAmount);
                if (Number(this.discount) === 0) {
                    
                    return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${formatMaxAmount}đ`;
                }

                return `Đơn hàng trị giá trên ${formatThreshold}đ sẽ nhận được giảm giá ${this.discount}%, không vượt quá ${formatMaxAmount}đ`;
            }
        }
    });
};