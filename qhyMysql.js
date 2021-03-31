let mysql = require('mysql')
class qhyMysql{
    constructor(option) {
        this.connection = mysql.createConnection(option)
        this.connection.connect((err)=>{
            if(err){
                console.log(err)
            }else{}
        })
    }
    qhyQuery(sql,arr){
        let that = this
        return new Promise(function(resolve,reject){
            that.connection.query(sql,arr,(err,results)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    }
    close(){
        this.connection.end()
    }
}



module.exports = qhyMysql