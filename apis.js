const sql = require('./sql');

function login(req, res){
    let bufferStr = "";
    req.on('data', data => {
      bufferStr += data.toString()
    })
    req.on('end', () => {
      let reqObj = JSON.parse(bufferStr);
      var data1=reqObj.accountdata;
      var data2=reqObj.password;
      //console.log(data1)
      //console.log(data2)
      sql.search(data1)
      .then(data => {
        //console.log(data)
        if(data)
        {
          var checkpassword = data.password
          console.log(checkpassword)
          if(checkpassword == data2){
            req.session.acc = data1
            res.end('logSubOK')
          }else{
            res.end('Invalid password')
            console.log('Invalid password')
          }  
        }else{
            res.end(`Unauthorized!`) 
            console.log('Unauthorized!')
        }
      })
    });
}

module.exports = {
    login
}