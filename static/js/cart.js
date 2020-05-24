let goods = [];
let amountNumber = 0;

window.onload = function() {
    headOperate();
    //通过ajax接收后端数据
    let username = localStorage.getItem('username');
    if(username != '') {
        let jsonString = 'username=' + username;
        ajaxPost('/cart/goods', handleGoods, jsonString);
    }
    
    let submitBtn = this.document.getElementById('cart-submit');
    submitBtn.onclick = submitCart;

    // console.log(JSON.stringify(goods));
    document.getElementById("head-l-logout").onclick = buttonLogout;
}

function handleGoods(resText) {
    let IDgoods = JSON.parse(resText);
    console.log(IDgoods);
    if(IDgoods.length === 0) {
        let cartMenu = document.getElementById('cart-menu');
        goods = [];
        cartMenu.innerHTML = "    这里什么都没有o";
    } else {
        for(let i=0; i< IDgoods.length; i++){
            let id = IDgoods[i].goods_id;
            let num = IDgoods[i].goods_number;
            let string = 'goods_id=' + id + '&goods_number=' + num;
            ajaxPost('/cart/info', handleInfo, string);
        }
    }  
}

function handleInfo(resText) {
    let info = JSON.parse(resText);
    console.log("info="+ info);
    goods.push(info);

    drawCart();
    drawAmount();
}


function submitCart() {
    let userName = document.getElementById('user_name').value;
    let userPhone = document.getElementById('user_phone').value;
    let userAddress = document.getElementById('user_address').value;
    if(userName=='' || userPhone=='' || userAddress=='') {
        alert("请确保信息完整正确");
        return false;
    }
    if(goods.length === 0) {
        alert('订单不能为空');
        return false;
    }

    let order = 
        {
            user: userName,
            phone: userPhone,
            address: userAddress,
            amount: amountNumber,
            goods: goods,
        };
    let data = {
        username: localStorage.getItem('username'),
        order: order,
    }
    let dataString = JSON.stringify(data);
    // console.log(data);
    // 通过ajax传递order给后端
    // 跳转到order页面
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xmlhttp.open("POST", '/cart/submit', true);
    xmlhttp.onreadystatechange = function()
    {
        if(4 == xmlhttp.readyState && 200 == xmlhttp.status)
        {
            console.log(xmlhttp.resText);
            window.location.href = '/';
        }
    }
    xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");//可以发送json格式字符串
    xmlhttp.send(dataString);
}

function drawCart() {
    console.log("goods="+ goods);
    let originModel = `
    <tr>
        <td class="goods_img"> 商品</td>
        <td class="goods_name" >名称</td>
        <td class="goods_price">单价</td>
        <td class="goods_num">数量</td>
        <td class="goods_op">操作</td>
    </tr>
    `;
    
    let cartMenu = document.getElementById('cart-menu');
    cartMenu.innerHTML = originModel;
    goods.forEach(e => {
        let goodsModel = `
        <tr>
            <td class="goods_img">${e.goods_id}
            </td>
            <td class="goods_name" >${e.goods_name}
            </td>
            <td class="goods_price">${e.goods_price}
            </td>
            <td class="goods_num">
                <input name="${e.goods_id}" class="goods_num_input" type="text" size="3" maxlength="2" placeholder="${e.goods_number}">
                <button name="${e.goods_id}" onclick="changeGoodNum(this)" >√</button>
            </td>
            <td class="goods_op">
                <button name="${e.goods_id}" class="delete" onclick="deleteGood(this)">X</button>
            </td>
        </tr>
        `;
        cartMenu.innerHTML += goodsModel;
    });
}

function changeGoodNum(node) {
    let id = node.name;
    let number = node.previousElementSibling.value;
    goods.forEach(e => {
        if(id == e.goods_id) {
            e.goods_number = number;
            e.goods_amount = e.goods_price * number;
            // 通过ajax向后端数据库更新信息
        }
    });
    drawAmount();
}

function deleteGood(node) {
    let id = node.name;
    let goodsMenu = node.parentNode.parentNode;
    let i=0;
    for(i=0; i<goods.length ;i++) {
        if(goods[i].goods_id == id) {
            break;
        }
    }
    goods.splice(i, 1);
    drawAmount();
    drawCart();
}

function drawAmount() {
    let amount = document.getElementById('cart-amount');
    amountNumber = 0;
    goods.forEach(e=>{
        amountNumber += e.goods_amount;
    });
    amount.innerHTML = amountNumber;
    console.log(amountNumber);
}