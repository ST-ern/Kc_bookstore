let orders = [];
let tableModel = `
<tr>
    <td class="goods_img"> 商品</td>
    <td class="goods_name" >名称</td>
    <td class="goods_price">单价</td>
    <td class="goods_num">数量</td>
    <td class="goods_total"> 总额</td>
</tr>
<tr></tr>
`;


window.onload = function() {
    headOperate();

    let username = localStorage.getItem('username');
    if(username != '') {
        let jsonString = 'username=' + username;
        ajaxPost('/order/get_item', handleOrders, jsonString);
    }
    
    document.getElementById('head-l-logout').onclick = buttonLogout;
}

function handleOrders(resText){
    orders = JSON.parse(resText);
    if(orders.length === 0) {
        let table = document.getElementById('orders-table');
        table.innerHTML = '这里什么都没有o';
    } else {
        drawTable();
    }
}


function drawTable() {
    let table = document.getElementById('orders-table');
    table.innerHTML = tableModel;

    orders.forEach(e => {
        let userModel = `
            <tr>
            <td class="goods_owner">收件人：${e.user}</td>
            <td class="goods_phone">联系电话：${e.phone}</td> 
            <td class="goods_address">地址：${e.address}</td>
            </tr>
            `;
        let amoutModel = `
            <tr><td class="goods_final_price">总价：${e.amount}¥</td></tr>
            <tr></tr>
            `;
        table.innerHTML += userModel;
        e.goods.forEach(ee=> {

            let goodsModel = `
                <tr>
                    <td class="goods_img"> 
                        <img src="${ee.goods_img}">
                    </td>
                    <td class="goods_name" >
                        ${ee.goods_name}
                    </td>
                    <td class="goods_price">
                        ${ee.goods_price} ￥
                    </td>
                    <td class="goods_num">
                        ${ee.goods_number}
                    </td>
                    <td class="goods_total"> 
                        ${ee.goods_amount}
                    </td>
                </tr>
                `;
            table.innerHTML += goodsModel;
        });
        table.innerHTML += amoutModel;
    });
}