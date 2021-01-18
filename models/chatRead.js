const Sequelize = require('sequelize');

class ChatRead extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                chatReadIdx: {
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
                
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'ChatRead',
                tableName: 'ChatRead',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = ChatRead;