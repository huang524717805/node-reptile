var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var crawler = require('crawler')
var url = require('url')

var db = require('mongoose');
db.connect('mongodb://localhost/student_db');

var Pchong = db.model('pchong',{
    img:{type:String,default:""},
    title:{type:String,default:""},
    name:{type:String,default:""}
})

app.get('/api/book/:page',(req,res)=>{
  var page = req.params.page;
  page = Number(page) || 1;
  var pageSize = 16;     
  Pchong.find().count((err,totalCount)=>{
    if(err){

    }
    else{
      // 总页数
      var pageCount = Math.ceil(totalCount / pageSize);
      if(pageCount < page){
        res.json({status:"n",msg:"已到最后一页"})
      }
      else{
        Pchong.find().skip((page -1)*pageSize).limit(pageSize).exec((err,data)=>{
          if(err){
            res.json({status:"n",msg:"返回数据失败"})
          }
          else{
            res.json({status:"y",msg:"返回数据成功",data:data})
          }
        })
      }
    }
  })
})


app.listen(3000,()=>{
  console.log('服务器运行中...');
})
