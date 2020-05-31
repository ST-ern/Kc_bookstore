let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongo_uri = "mongodb+srv://ckkkx:123456ckkkx@cluster0-oeal2.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("bookstore").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

let app = express();

app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));



app.get('/', (req, res) => {
  res.sendFile(__dirname +'/k_index.html');
});
app.get('/login',function(req,res){
	res.sendFile(__dirname + '/k_login.html');
});
app.get('/register',function(req,res){
	res.sendFile(__dirname+'/k_register.html');
});

app.get('/good/:id',function(req,res){
    let id=req.params.id;
	res.sendFile(__dirname+'/k_goods_'+id+'.html');
});
app.get('/cart',function(req,res){
    res.sendFile(__dirname+'/k_cart.html');
});
app.get('/order',function(req,res){
    res.sendFile(__dirname+'/k_order.html');
});


app.post('/register/click', function(req, res) {
    let username = req.body.username;
    let pwd = req.body.pwd;
    // console.log(username + pwd);  
    //数据库交互
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection_user = client.db("bookstore").collection("user");
        // perform actions on the collection object
        let condition = {'username': username};
        collection_user.find(condition).toArray(function(err, result) {
            // let duplicate = result.length;
            // console.log(err);
            // console.log(result);
            
            if(result.length===0){
                console.log("注册成功");
                let user = ({
                    username: username,
                    pwd: pwd,
                });
                console.log(user);
                collection_user.insertOne(user);
                res.send("ok");
                client.close();
                
            } else {
                res.send("already have");
                client.close();
            }
        }); 
        
    });
});


app.post('/login/click', function(req, res) {
    let username = req.body.username;
    let pwd = req.body.pwd;
    // console.log(username + pwd);  
    
    //数据库交互
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection_user = client.db("bookstore").collection("user");
    // perform actions on the collection object
    let condition = {'username': username};
    collection_user.find(condition).toArray(function(err, result) {
        // console.log(result);
        // console.log(err);
        if(result.length===0) {
            res.send("no register");
        } else if(result[0].pwd == pwd) {
            // console.log("yes");
            res.send("true");
        } else {
            // console.log("no");
            res.send("false");
        }
    });
    

    client.close();
    });
});

app.post('/good/add', function(req, res) {
    let username = req.body.username;
    let good_id = req.body.goodId;
    let good_num = req.body.goodNum;
    // console.log('good_id:'+good_id+',good_num:'+good_num);
    // 数据库添加货物到购物车
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection_cart = client.db("bookstore").collection("cart");
        let data = {
            goods_id: good_id,
            goods_number: parseInt(good_num)
        };
        let condition = {'username': username};
        collection_cart.find(condition).toArray(function(err, result) {
            if(result.length === 0) {
                let updateData = ({
                    username: username,
                    goods: [data]
                });
                collection_cart.insertOne(updateData);
                res.send("new");
                client.close();
            } else {
                let goods = result[0].goods;
                let mutiple = false;
                for(let i=0; i<goods.length; i++){
                    if(goods[i].goods_id == good_id) {
                        goods[i].goods_number += parseInt(good_num);
                        mutiple = true;
                        break;
                    }
                }
                if(!mutiple) {
                    goods.push(data);
                }
                // console.log(goods);
                collection_cart.updateOne(condition, {$set: {goods: goods} });
                res.send("success");
                client.close();
            }
        });
    });


});
app.post('/cart/goods',function(req, res) {
    let username = req.body.username;
    // console.log('/cart/goods===username:' + username);
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection_cart = client.db("bookstore").collection("cart");
        // const collection_good = client.db("bookstore").collection("good");
        let condition = {'username': username};
        collection_cart.find(condition).toArray(function(err, result) {
            if(result.length === 0) {
                let good = [];
                res.send(good);
                client.close();
            } else {
                let cart_goodInfo = result[0].goods;
                let good = [];
                let info = {};
                // console.log(cart_goodInfo);
                for(let i=0; i<cart_goodInfo.length; i++){
                    let goodId = {
                        goods_id : cart_goodInfo[i].goods_id,
                        goods_number : cart_goodInfo[i].goods_number,
                    };
                    good.push(goodId);
                    // console.log('goodId='+cart_goodInfo[i].goods_id);
                    // collection_good.find(goodId).toArray(function(i_err, i_result) {
                    //     let aim = i_result[0];
                    //     console.log('aim'+aim);
                    //     info = {
                    //         goods_id: aim.id,
                    //         goods_img: aim.img,
                    //         goods_name: aim.name,
                    //         goods_price: aim.price,
                    //         goods_number: cart_goodInfo[i].goods_number,
                    //         goods_amount: aim.price * cart_goodInfo[i].goods_number,
                    //     };
                    //     console.log(info);
                    //     good.push(info);
                    // });
                }
                // console.log('good='+good);
                res.send(good);
                client.close();
            }
        });
    });    
});
app.post('/cart/info', function(req, res) {
    let goods_id = req.body.goods_id;
    let goods_number = req.body.goods_number;
    // console.log('/cart/info===goods_id:' + goods_id + ' goods_number:' + goods_number);
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection_good = client.db("bookstore").collection("good");
        let condition = {'id': goods_id};
        collection_good.find(condition).toArray(function(err, result) {
            let aim = result[0];
            // console.log('aim.img='+aim.img);
            let info = {
                goods_id: goods_id,
                goods_img: aim.img,
                goods_name: aim.name,
                goods_price: aim.price,
                goods_number: goods_number,
                goods_amount: aim.price * goods_number,
            };
            // console.log('info='+info);
            res.send(info);
            client.close();
        });
    });
});


app.post('/cart/submit',function(req, res) {
    //数据库
    let username = req.body.username;
    let order = req.body.order;
    // console.log('/cart/submit===username:' + username);
    // console.log(req.body);


    const client1 = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client1.connect(err => {
        const collection_order = client1.db("bookstore").collection("order");
        // perform actions on the collection object
        let tempOrder = {
            username: username,
            user: order.user,
            phone: order.phone,
            address: order.address,
            amount: parseInt(order.amount),
            goods: order.goods,
        };
        collection_order.insertOne(tempOrder);
        client1.close();
    });
    const client2 = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client2.connect(err => {
        const collection_cart = client2.db("bookstore").collection("cart");
        // perform actions on the collection object
        let condition = {username: username};
        // console.log(condition);
        collection_cart.deleteMany(condition);
        client2.close();
    });
    res.send('ok');
});

app.post('/order/get_item', function(req, res) {
    let username = req.body.username;
    // console.log('/order/get_item===username:' + username);
    let condition = {username: username};
    // goods为根据用户名获取orders
    // let orders = [
    //     {
    //         user: 'ckkkx',
    //         phone: '12345678989',
    //         address: '都不是比不复i别人发iu恶补日俄不过i个发染发i家',
    //         amount: 123,
    //         goods: [
    //             {
    //                 goods_id: 34242,
    //                 goods_img: 'dubsfisbfsdibfisbfi',
    //                 goods_name: '杜斯比素拌豆腐',
    //                 goods_price: 23,
    //                 goods_number: 1,
    //                 goods_amount: 2344,
    //             },
    //             {
    //                 goods_id: 34242,
    //                 goods_img: 'dubsfisbfsdibfisbfi',
    //                 goods_name: '杜斯比素拌豆腐',
    //                 goods_price: 23,
    //                 goods_number: 1,
    //                 goods_amount: 2344,
    //             },
    //             {
    //                 goods_id: 34242,
    //                 goods_img: 'dubsfisbfsdibfisbfi',
    //                 goods_name: '杜斯比素拌豆腐',
    //                 goods_price: 23,
    //                 goods_number: 1,
    //                 goods_amount: 2344,
    //             },
    //         ],
    //     },
    //     {
    //         user: 'ckkkx',
    //         phone: '12345678989',
    //         address: '都不是比不复i别人发iu恶补日俄不过i个发染发i家',
    //         amount: 123,
    //         goods: [
    //             {
    //                 goods_id: 34242,
    //                 goods_img: 'dubsfisbfsdibfisbfi',
    //                 goods_name: '杜斯比素拌豆腐',
    //                 goods_price: 23,
    //                 goods_number: 1,
    //                 goods_amount: 2344,
    //             },
    //         ],
    //     },
    // ];
    const client = new MongoClient(mongo_uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection_order = client.db("bookstore").collection("order");
        collection_order.find(condition).toArray(function(err, result) {
            let orders = result;
            res.send(orders);
            client.close();
        });
    });
    
});




app.listen(3000, () => {
  console.log('示例应用正在监听 3000 端口!');
});