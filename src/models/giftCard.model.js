const { Sequelize, DataTypes } = require('sequelize');
const { compareDate, formatMoney } = require("../helpers/utilities.helper");

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
        imageUrl: {
            type: DataTypes.STRING
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
        expirationAt: {
            type: DataTypes.DATE,
            allowNull: false
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
    }, {
        indexes: [
            {
                unique: true,
                fields: ["giftCardCode"]
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