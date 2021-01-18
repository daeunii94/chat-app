const Sequelize = require('sequelize');

class Comment extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                commentIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                boardIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                userIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                commentContent: {
                    type: Sequelize.STRING(200),
                    allowNull: true,
                },
                commentCreatedDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: sequelize.literal('now()'),
                },
                commentUpdateDate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    efaultValue: sequelize.literal('now()'),
                },
                commentIsActive: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Comment',
                tableName: 'Comments',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = Comment;