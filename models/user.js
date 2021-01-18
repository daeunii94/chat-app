const Sequelize = require('sequelize');

class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
                userIdx: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                userID: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                userIdEmail: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userPassword: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userPostalCode: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userAddress: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userAddress2: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userPhone: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userJoinDate: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                userIsActive: {
                    type: Sequelize.BOOLEAN,
                    allowNull: true,
                },
                userAgency: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                userFullName: {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
            }, {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: 'User',
                tableName: 'Users',
                paranoid: false,
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci'

            });
    }
    static associate(db){}
};

module.exports = User;