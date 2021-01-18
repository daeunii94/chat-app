const Sequelize = require('sequelize');

class ReplyBoard extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                replyBoardIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                commentIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                userIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                replyBoardContent: {
                    type: Sequelize.BLOB,
                    allowNull: false,
                },
                replyBoardCreatedDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('now()'),
                },
                replyBoardUpdateDate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                replyBoardImageURL: {
                    type: Sequelize.BLOB,
                    allowNull: true,
                },
                replyBoardIsActive: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ReplyBoard',
                tableName: 'ReplyBoard',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = ReplyBoard;