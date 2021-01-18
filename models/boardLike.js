const Sequelize = require('sequelize');

class BoardLike extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                boardLikeIdx: {
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
                boardIsLike: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                boardIsHate: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'BoardLike',
                tableName: 'BoardLikes',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = BoardLike;