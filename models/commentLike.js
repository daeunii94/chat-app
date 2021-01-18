const Sequelize = require('sequelize');

class CommentLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                commentLikeIdx: {
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
                    allowNull: false,
                },
                commentLikeCount: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                commentHateCount: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'CommentLike',
                tableName: 'CommentLikes',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = CommentLike;