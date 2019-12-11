const express = require('express');
const pa = require('path')
const session = require('express-session')
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const cors = require('cors')
const bodyParser  = require('body-parser');
const client = redis.createClient();
const sql = require('./sql');


const PORT = 4500;
const HOST = 'localhost';
const app = express();

app.use(session({
  store: new RedisStore({ host: 'localhost', port: 4000, client: client}),
    secret: 'dodo',
    saveUninitialized: false,
    resave: false,
    cookie: {
      /*todo
      secure: true,
      SameSite: 'none'
      */
    }, 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/loginSubmit', cors({credentials: true,origin: 'http://localhost:4500'}), (req, res) => {
    let bufferStr = "";
    req.on('data', data => {
      bufferStr += data.toString()
    })
    req.on('end', () => {
      let reqObj = JSON.parse(bufferStr);
      var data1=reqObj.email;
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
});

app.post('/registerSubmit',cors({credentials: true,origin: 'http://localhost:4500'}), (req, res) => {
    let bufferStr = "";
    console.log(req.body)
    req.on('data', data => {
      bufferStr += data.toString()
    })
    req.on('end', () => {
      let reqObj = JSON.parse(bufferStr);
      var data1=reqObj.email;
      var data2=reqObj.password;
      //console.log(data1)
      //console.log(data2)
      sql.checkIfAccountExist(data1)
      .then(checkdata =>{
        if(checkdata){
          console.log("You have registered before.")
          res.end("You have registered before.")
        }else{
          sql.newAccount(data1 , data2)
          .then(data => {
            if(data == 'success')
            {
                res.end('regSubOK') 
            }else{
                res.end('registerFail') 
            }
          })
        }
      })
    });
});

app.get('/logout', cors({credentials: true,origin: 'http://localhost:4500'}), (req, res) => {
  req.session.destroy();
  console.log("logout")
  res.end('logoutOK');
});

app.post('/create', cors({credentials: true,origin: 'http://localhost:4500'}), (req, res) => {
  if(!req.session.acc){
    console.log("You have registered before.")
    res.end("You have registered before.")
  }else{
    sql.checkAdmin(req.session.acc)
    .then(admindata => {
        console.log(admindata)
        if(admindata){
            let bufferStr = "";
            console.log(req.body)
            req.on('data', data => {
            bufferStr += data.toString()
            })
            req.on('end', () => {
                let reqObj = JSON.parse(bufferStr);
                var data1=reqObj.email;
                var data2=reqObj.password;
                //console.log(data1)
                //console.log(data2)
                sql.checkIfAccountExist(data1)
                .then(checkdata =>{
                    if(checkdata){
                    console.log("You have registered before.")
                    res.end("You have registered before.")
                    }else{
                        sql.newAccount(data1 , data2)
                        .then(data => {
                            if(data == 'success')
                            {
                                res.end('createOK') 
                            }else{
                                res.end('createFail') 
                            }
                        })
                    }
                })
            });
        }else{
            res.end("You don't have this permission")
        }
    })

  }
});

app.get('/read', cors({credentials: true,origin: 'http://localhost:4500'}), (req, res) => {
    sql.readMember()
    .then(members =>{
        console.log(members)
        if(members){
            res.end(members)
        }else{
            res.end("readFail")
        }
    })
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});