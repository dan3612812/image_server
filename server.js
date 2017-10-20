var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cookie = require('cookie-parser');
var mysql = require('mysql');
var auth = require('./auth.js');
//var router = express.Router();
//可以使用其他位置的物件
//var routers = require('./routers');
var fs = require('fs');
//var upload = require('./fileupload.js');
const base64 = require('node-base64-image');

app.set('view engine', 'ejs');
app.use('/static', express.static('static'));
app.set('port', process.env.PORT || 5025);// 設定環境port
//app.use(bodyParser.json());  //解析post內容
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookie());
//image_server.js
//handle request entity too large
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
//本機檔案 位子
var path = ["test", "member", "shop", "boss", "product", "gift", "ad"];
//取得mysql 資訊
var connection = mysql.createConnection({
    host: auth.MySQL.host,
    user: auth.MySQL.user,
    password: auth.MySQL.password,
    database: auth.MySQL.database,
    dataStrings: true
});

/* GET home page. */
app.get('/', function (req, res) {
    console.log("index");
    res.send("get / index");
    // res.render('index', { title: 'Express' });
});
//路徑只能用' 不能用" 雙引號
app.get('/upload', function (req, res) {
    res.send('get /upload server is exist');
    console.log("get /upload");
    //res.render("upload");
});
/*
app.post('/upload', upload.single('avatar'), function (req, res, next) {
    console.log(req.file);
    if (req.file) {
        res.send('文件上傳成功');
        console.log("上傳成功");
        res.send("失敗");
    } else {
        console.log('上傳失敗');
        res.send('失敗');
    }
});
*/
//var base64str = base64_encode('./images/test/test.jpg');
//var id = 0;
//var clas = 0;
//var cate = 1;

app.post('/createimage', function (req, res) {
    var id = req.body.id;
    var clas = req.body.clas;
    var cate = req.body.cate;
    var base64str = req.body.base64;
    var temp = function (temp) {
        if (temp == 1) {
            console.log("createimage sccess");
            res.setHeader('status', 'success');
            res.json({ "createimage": 1 });
        } else {
            console.log("createimage fail because not change");
            res.setHeader('status', 'fail');
            res.json({ "createimage": 0 });
        }

    }
    createfile(id, clas, cate, base64str, temp);
    //C:\\Users\\winproluhao\\Desktop\\testimage\\t1\\images\\member\\1\\1-1.txt
});

app.post('/getimage', function (req, res) {
    var id = req.body.id;
    var clas = req.body.clas;
    var cate = req.body.cate;
    var temp = function (temp) {
        res.setHeader('status', 'success');
        var send_package = {
            "getimage": temp
        }
        res.json(send_package);
    }
    getfile(id, clas, cate, temp);
});


///////////function////////////
function getfile(id, clas, cate, callback) {
    var tmpdir = './images/' + path[clas] + '/' + id + '/' + id + '-' + cate + '.txt';
    console.log('post getfile' + tmpdir);
    //檢查資料是否存在
    fs.stat(tmpdir, function (error, stat) {
        if (error == null) {
            //撈取資料
            console.log("the file is exist");
            fs.readFile(tmpdir, function (error, result) {
                if (error) throw error;
                //將檔案內容回傳
                callback(result.toString());
            });
        } else {
            console.log("the file not exist");
            callback(0);
        }
    });
}
//由post createfile呼叫  再呼叫writedatabase 寫進mysql
//創建檔案 並寫檔案(image.txt)(base64)
function createfile(id, clas, cate, base64str, callback) {
    //傳id 傳分類(mem,pro,shop,bos) 傳哪種圖片(大頭貼,封面照),傳base64
    //檢查是否有file 不一定要做
    //創資料夾 
    createdir(path[clas], id);
    //C:\\Users\\winproluhao\\Desktop\\testimage\\t1\\imagesmember\\1\\1-1.txt
    var tmpdir = './images/' + path[clas] + '/' + id + '/' + id + '-' + cate + '.txt';
    //創檔 +寫檔
    fs.writeFile(tmpdir, base64str, function (err) {
        console.log(tmpdir);
        if (err) throw err;
        console.log("write File");
        //寫進mysql
        /*
        var info = function (info){
            callback(info);
        };
        */
        writedatabase(id, clas, cate);
        callback(1);
    });
}
//由 createfile 呼叫用於寫入mysql
function writedatabase(id, clas, cate) {
     //shop_logo mem_image mem_cover pro_image bos_logo gift_image ad_image
    var pathtable = ["test", "mem", "shop", "bos", "pro", "gift", "ad"];
    //mem 1, shop 2,bos 3, pro 4, gift 5,ad 6
    var pathfield = ["test", "image", "logo", "cover"];
    //image 1, logo 2, cover 3
    //由於mysql 有些有欄位有些沒有 只有以下才有 X=id 當然 該資料表有該ID才會有東西
    //所有正確組合 X11 X13 X22 X32 X41 X51 X61
    var table = pathtable[clas];
    var field = pathfield[cate];
    var tmpway = id + "/" + clas + "/" + cate;
    //var sql"UPDATE `" + table + "_data` SET `" + table + "_" + field + "`='" + tmpdir + "' WHERE `" + table + "_id` =" + id;
    var sql = "UPDATE `" + table + "_data` SET `" + table + "_" + field + "`='" + tmpway + "' WHERE `" + table + "_id` =" + id;
    //console.log(tmpway);
    console.log(sql);
    connection.query(sql, function (error, result) {
        if (error) throw error;
        /*
        if (result.changedRows == 0) {
            //修改失敗
            console.log('///mysql Update not change row///');
            callback(0);
        } else {
            //修改成功
            callback(1);
        }
        */
    });
}
//由function createfile 呼叫用於創建dir
//創建資料夾
function createdir(clas, id) {
    var dir = './images/' + clas + '/' + id;
    console.log(dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log("add dir");
    }
}



//--------------------Base64 ----------//
//將圖片轉base64 沒用 拿來測試的
function base64_encode(file) {
    var bitmap = fs.readFileSync(file);
    return new Buffer(bitmap).toString('base64');
}

http.listen(app.get('port'), '0.0.0.0', function () {

    console.log("The server started in " + '127.0.0.1:' + app.get('port'));
    console.log('---------------------------------------');
});
