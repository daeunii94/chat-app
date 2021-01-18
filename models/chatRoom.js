const Sequelize = require('sequelize');

class ChatRoom extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                chatRoomIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                chatRoomTitle: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                chatRoomOwner: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ChatRoom',
                tableName: 'ChatRooms',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = ChatRoom;