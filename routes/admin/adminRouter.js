
var express = require('express');
var router = express.Router();

var useRouter = require('./useRouter')
var patientsRouter = require('./patientRouter')
var newsRouter = require('./newsRouter')
var doctorRouter = require('./doctorRouter')

//判断是否符合条件进入后台的中间件
function permission(req,res,next){
    if(req.session.username == undefined){
        //    尚未登录
        res.render('err.ejs',{
            jqsrc:'js/jquery.js',
            title:'未登录',
            errorCode:'',
            errorText:'你尚未登录，请登录',
            href:'/rl/login',
            page:'前往登录页'
        })
    }else{
        //正常进入
        next()
    }
}


router.get('/',permission,(req,res,next)=>{
    res.render('admin/index.ejs',{
        username:req.session.username
    })
})

router.use('/users',permission,useRouter)
router.use('/doctor',permission,doctorRouter)
router.use('/news',permission,newsRouter)
router.use('/patients',permission,patientsRouter)


module.exports = router;
