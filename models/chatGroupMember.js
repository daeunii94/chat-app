const Sequelize = require('sequelize');

class ChatGroupMember extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                chatGroupMemberIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                chatRoomIdx: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                chatUserIdx: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                groupIn: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false,
                    defaultValue: true
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ChatGroupMember',
                tableName: 'ChatGroupMembers',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = ChatGroupMember;