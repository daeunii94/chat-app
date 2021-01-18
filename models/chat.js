const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                chatIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                chatRoomIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                chatUserIdx: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                chatDetail: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                chatPhoto: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                chatFile: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                chatUserColor: {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'Chat',
                tableName: 'Chats',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = Chat;