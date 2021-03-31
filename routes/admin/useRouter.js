var express = require('express');
var router = express.Router();
let qhyMysql = require('../../qhyMysql')
var fs = require('fs')
//引入上传对象
var multer = require('multer')
//上传对象配置
let upload = multer({dest:'./public/upload'})

let con = new qhyMysql({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'process'
})
async function getRole(){
    let sql = 'select id,rolename from role'
    let result =await con.qhyQuery(sql)
    return Array.from(result)
}
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.post('/imgUpload',upload.single('imgfile'),async (req,res)=>{
    let oldpath = req.file.destination + '/' + req.file.filename
    let newPath = req.file.destination + '/' + req.file.filename + req.file.originalname
    fs.rename(oldpath,newPath,()=>{
        console.log('改名成功')
    })
    let obj = {
        state:'ok',
        imgUrl:'/upload/' + req.file.filename + req.file.originalname
    }
    let sql = 'update usertable set headerImg=? where username=?'
    await con.qhyQuery(sql,[obj.imgUrl,req.session.username])
    res.json(obj)
})
router.get('/selfinfo',async function(req, res, next) {
    //获取用户名并通过用户名查找所有的信息
    let username = req.session.username
    let sql = 'select * from usertable where username = ?'
    let result =await con.qhyQuery(sql,[username])
    let user = result[0]
    let roles = await getRole()
    let options = {user,roles}
    res.render('admin/users/info',options)

});

router.post('/selfChange',async (req,res)=>{
    let username = req.body.username,
        password = req.body.pass,
        tel = req.body.phone,
        roleid = req.body.roleid,
        mail = req.body.email
    let sql = 'update usertable set password=?,tel=?,roleid=?,mail=? where username=?'
    await con.qhyQuery(sql,[password,tel,roleid,mail,username])
    res.json({
        state:'ok',
        msg:'修改成功'
    })
})

router.get('/userlist',async (req,res)=>{
    let sql = 'select id,username,tel,mail,roleid,headerImg from usertable limit 5'
    let result = await con.qhyQuery(sql)
    let tran = {
        id:"ID",
        username:'用户名',
        tel:'电话',
        mail:'邮箱',
        roleid:'角色',
        headerImg:'头像'
    }
    let role = ['管理员','医生','医药师']
    let option = {result,tran,role}
    res.render('admin/users/userlist',option)
})

router.get('/frontData',async (req,res)=>{
    let page = parseInt(req.query.page)
    let limitNum = parseInt(req.query.limit)
    let arr = [(page-1)*limitNum,limitNum]
    let sql = 'select usertable.id,username,tel,mail,headerImg,rolename from usertable,role where role.id = usertable.roleid limit ?,?'
    let result =await con.qhyQuery(sql,arr)
    sql = 'select count(id) as usernum from usertable'
    let numresult = await con.qhyQuery(sql)
    let count = numresult[0].usernum
    let option = {
        "code": 0,
        "msg": "",
        "count": count,
        "data": Array.from(result)
    }
    res.json(option)
})


router.post('/deluser',async (req,res)=>{
    console.log(req.body)
    let list = req.body['list[]']
    let sql = 'delete from usertable where id=?'
    console.log(typeof(list))
    if(typeof(list) == 'string'){
        await con.qhyQuery(sql,[parseInt(list)])
    }else{
        list.forEach(async (item,i)=>{
            await con.qhyQuery(sql,[parseInt(item)])
         })
    }
    res.json({
        state:'ok'
    })
})


module.exports = router;
