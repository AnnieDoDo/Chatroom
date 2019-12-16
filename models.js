const Sequelize = require('sequelize');

const sequelize = new Sequelize( {
    dialect: 'sqlite',
    storage: './sqldev.db'
  });

  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});

const Model = Sequelize.Model;

class Account extends Model {}
Account.init({
  // attributes
  aid: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  admin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  accountdata: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
 
}, {
 
  sequelize,
  modelName: 'account'
})

class Chatroom extends Model {}
Chatroom.init({
  // attributes
  cid: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  accountdata: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  }
 
}, {
 
  sequelize,
  modelName: 'chatroom'
})

module.exports = {
  Account,
  Chatroom
}