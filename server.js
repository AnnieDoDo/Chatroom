const express = require('express');
const pa = require('path')
const session = require('express-session')
const redis = require("redis");
const RedisStore = require('connect-redis')(session);
const cors = require('cors')
const bodyParser  = require('body-parser');
const client = redis.createClient();
const sql = require('./sql');
const fs = require("fs");
const https = require("https");

const PORT = 4500;
const HOST = 'localhost';
const originaddr = 'http://localhost:8080'
const app = express();
const server = require('https').createServer(app);
const io = require('socket.io')(server);
const httpsOptions = {
    cert : fs.readFileSync(""),
    ca : fs.readFileSync(""),
    key : fs.readFileSync("")
   }
   

const Apis = require('./apis')

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

io.on('connection', socket => {
    socket.on('getMessage', message => {
        //回傳 message 給發送訊息的 Client
        io.sockets.emit('getMessage', message)
    })
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/login', cors({credentials: true,origin: originaddr}), Apis.login);

app.post('/register',cors({credentials: true,origin: originaddr}), (req, res) => {
    let bufferStr = "";
    console.log(req.body)
    req.on('data', data => {
      bufferStr += data.toString()
    })
    req.on('end', () => {
      let reqObj = JSON.parse(bufferStr);
      var data1=reqObj.accountdata;
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

app.get('/logout', cors({credentials: true,origin: originaddr}), (req, res) => {
  req.session.destroy();
  console.log("logout")
  res.end('logoutOK');
});

app.post('/create', cors({credentials: true,origin: originaddr}), (req, res) => {
  /*if(!req.session.acc){
    console.log("You have registered before.")
    res.end("You have registered before.")
  }else{
    sql.checkAdmin(req.session.acc)
    .then(admindata => {
        console.log(admindata)
        if(admindata){*/
            let bufferStr = "";
            console.log(req.body)
            req.on('data', data => {
            bufferStr += data.toString()
            })
            req.on('end', () => {
                let reqObj = JSON.parse(bufferStr);
                var data1=reqObj.accountdata;
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
        /* }else{
            res.end("You dont have this permission")
        }
    })

  }*/
});

app.get('/read', cors({credentials: true,origin: originaddr}), (req, res) => {
    /*if(!req.session.acc){
        console.log("You have to login first.")
        res.end("You have to login first.")
    }else{
        sql.checkAdmin(req.session.acc)
        .then(admindata => {
            if(admindata)
            {*/
                sql.readMember()
                .then(member =>{
                    let members = JSON.stringify(member);
                    console.log(members)
                    if(members){
                        res.end(members)
                    }else{
                        res.end("readFail")
                    }
                })
           /* }else{
                res.end("You dont have this permission")
            }
        })
    }*/
});

app.post('/update', cors({credentials: true,origin: originaddr}), (req, res) => {
    /*if(!req.session.acc){
        console.log("You have to login first.")
        res.end("You have to login first.")
    }else{
        sql.checkAdmin(req.session.acc)
        .then(admindata => {
            if(admindata)
            {*/
                let bufferStr = "";
                console.log(req.body)
                req.on('data', data => {
                bufferStr += data.toString()
                })
                req.on('end', () => {
                    let reqObj = JSON.parse(bufferStr);
                    var data1=reqObj.accountdata;
                    var data2=reqObj.password;
                    var data3=reqObj.admin;
                    sql.updateMember(data1,data2,data3)
                    .then(member =>{
                        let members = JSON.stringify(member);
                        console.log(members)
                        if(members){
                            res.end("updateOK")
                        }else{
                            res.end("updateFail")
                        }
                    })
                })
            /*}else{
                res.end("You dont have this permission")
            }
        })
    }*/
});

app.post('/delete', cors({credentials: true,origin: originaddr}), (req, res) => {
    /*if(!req.session.acc){
        console.log("You have to login first.")
        res.end("You have to login first.")
    }else{
        sql.checkAdmin(req.session.acc)
        .then(admindata => {
            if(admindata)
            {*/
                let bufferStr = "";
                console.log(req.body)
                req.on('data', data => {
                bufferStr += data.toString()
                })
                req.on('end', () => {
                    let reqObj = JSON.parse(bufferStr);
                    var data1=reqObj.accountdata;
                    sql.deleteMember(data1)
                    .then(member =>{
                        let members = JSON.stringify(member);
                        console.log(members)
                        if(members==1){
                            res.end("deleteOK")
                        }else{
                            res.end("deleteFail")
                        }
                    })
                })
            /*}else{
                res.end("You dont have this permission")
            }
        })
    }*/
});

app.post('/message',cors({credentials: true,origin: originaddr}), (req, res) => {
    let bufferStr = "";
    console.log(req.body)
    req.on('data', data => {
      bufferStr += data.toString()
    })
    req.on('end', () => {
      let reqObj = JSON.parse(bufferStr);
      var data1=reqObj.accountdata;
      var data2=reqObj.text;
      //console.log(data1)
      //console.log(data2)
        sql.storeMessage(data1 , data2)
        .then(data => {
        if(data == 'success')
        {
            res.end('messageOK') 
        }else{
            res.end('messageFail') 
        }
        })
    });
  });

server.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});