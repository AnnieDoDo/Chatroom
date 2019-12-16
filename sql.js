const {Account, Chatroom} = require('./models')
const uuidv4 = require('uuid/v4');

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
            attributes:['accountdata','admin'],
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

    },
    storeMessage: function(acc,words){
      var ifreg = ''

      return Chatroom.upsert({
          cid : uuidv4(),
          accountdata : acc,
          text : words,
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
    }

};