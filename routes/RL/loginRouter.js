var express = require('express');
var router = express.Router();
let qhyMysql = require('../../qhyMysql')
let multiparty = require('multiparty')
let con = new qhyMysql({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'process'
})
/* GET users listing. */
router.get('/register', function(req, res, next) {
    res.render('RL/register.ejs')
});
router.get('/login', function(req, res, next) {
    res.render('RL/login.ejs')
});


router.post('/lg',(req,res)=>{
    let username,password
    let form = new multiparty.Form()
    form.parse(req,async (err,fields,files)=>{
        username = fields.username[0]
        password = fields.password[0]
        let sql = 'select * from usertable where username = ? and password = ?'
        let result = await con.qhyQuery(sql,[username,password])
        if(result.length != 0){
            req.session.username = username
            res.send('ok')
        }else{
            res.send('err')
        }
    })
})

router.get('/loginOut',(req,res)=>{
    req.session.destroy()
    res.render('err.ejs',{
        jqsrc:'../js/jquery.js',
        title:'loginOut',
        errorCode:'',
        errorText:'成功退出',
        href:'/',
        page:'返回首页'
    })
})

router.post('/rg',function(req,res){
    let username,password
    let form = new multiparty.Form()
    form.parse(req,async (err,fields,files)=>{
        username = fields.username[0]
        password = fields.password[0]
        let sql = 'select * from usertable where username = ?'

        let result = await con.qhyQuery(sql,[username])
        if(result.length != 0){
            res.send('has')
        }else{
            sql = "insert into usertable (username,password,roleid,headerImg) values (?,?,1,'/upload/default.jpg')"
            await con.qhyQuery(sql,[username,password])
            res.send('ok')
        }
    })

})


module.exports = router;
