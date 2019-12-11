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
    search : function(searchData){
        return Account.findOne({
        attributes: ['password'],
        where:{
          accountdata:searchData,
          }
        })   
    },
    checkIfAccountExist : function(checkAcc){
        return Account.findOne({
          attributes:['accountdata'],
          where:{
            accountdata: checkAcc,
          },
          raw: true
        })
      },
    newAccount : function(newData1 , newData2){
        var ifreg = ''

        return Account.upsert({
            aid : uuidv4(),
            admin : 0,
            accountdata : newData1,
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
    checkAdmin : function(accountdata){
        return Account.findOne({
            attributes:['admin'],
            where:{
                accountdata: accountdata,
                admin: 1
            },
            raw: true
        })   
    },
    readMember : function(){
        return Account.findAll({
            attributes:['accountdata','password','admin'],
            raw: true
        })   
    },
    updateMember : function(change1,change2,change3){
        return Account.update(
            {
                password: change2,
                admin: change3
            },
            { 
                where:{
                accountdata: change1
            },
            raw: true
        })
    },
    deleteMember : function(deleteacc){
        return Account.destroy({
            where:{
                accountdata: deleteacc
            }
        })

    }

};