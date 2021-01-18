const Sequelize = require('sequelize');

class Board extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                boardIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                userIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                boardTitle: {
                    type: Sequelize.STRING(100),
                    allowNull: false,
                },
                boardContent: {
                    type: Sequelize.BLOB,
                    allowNull: false,
                },
                boardCreatedDate: {
                    type: Sequelize.DATE,
                    allowNull: false,
                },
                boardUpdateDate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                boardImageURL: {
                    type: Sequelize.BLOB,
                    allowNull: true,
                },
                boardIsActive: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                },  
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Board',
                tableName: 'Board',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = Board;