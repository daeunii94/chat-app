'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Comment = require('./comment');
const Board = require('./board');
const BoardLike = require('./boardLike');
const ChatRoom = require('./chatRoom');
const Chat = require('./chat');
const ChatRead = require('./chatRead');
const User = require('./user');
const ChatGroupMember = require('./chatGroupMember');


const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

//db.User = User;
db.Comment = Comment;
db.Board = Board;
db.BoardLike = BoardLike;
db.Chat = Chat;
db.ChatRoom = ChatRoom;
db.ChatRead = ChatRead;
db.User = User;
db.ChatGroupMember = ChatGroupMember;

//User.init(sequelize);
Comment.init(sequelize);
Board.init(sequelize);
BoardLike.init(sequelize);
Chat.init(sequelize);
ChatRoom.init(sequelize);
ChatRead.init(sequelize);
User.init(sequelize);
ChatGroupMember.init(sequelize);

//User.associate(db);
Comment.associate(db);
Board.associate(db);
BoardLike.associate(db);
Chat.associate(db);
ChatRoom.associate(db);
ChatRead.associate(db);
User.associate(db);
ChatGroupMember.associate(db);

module.exports = db;