const Sequelize = require('sequelize');
const uuidv4 = require('uuid/v4');

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
  email: {
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
  account: {
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
    search : function(searchData){
        return Account.findOne({
        attributes: ['password'],
        where:{
          email:searchData,
          }
        })   
    },
    checkIfAccountExist : function(checkAcc){
        return Account.findOne({
          attributes:['email'],
          where:{
            email: checkAcc,
          },
          raw: true
        })
      },
    newAccount : function(newData1 , newData2){
        var ifreg = ''

        return Account.upsert({
            aid : uuidv4(),
            admin : 0,
            email : newData1,
            password : newData2,
        }).then(()=>{
            console.log("success")
            ifreg = 'success'
            return ifreg
        })
        .catch(error => {
            console.log("unsuccess")
            ifreg = 'unsuccess'
            return ifreg
        })
    },
    checkAdmin : function(account){
        return Account.findOne({
            attributes:['admin'],
            where:{
                email: account,
                admin: 1
            },
            raw: true
        })   
    },
    readMember : function(){
        return Account.findAll({
            attributes:['email','password','admin'],
            raw: true
        })   
    },

};