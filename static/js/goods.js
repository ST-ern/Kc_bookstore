window.onload = function() {
    headOperate();
    
    let addCart = this.document.getElementById('add-cart-btn');
    addCart.onclick = addToCart;

    document.getElementById("head-l-logout").onclick = buttonLogout;
}

function addToCart() {
    let login = localStorage.getItem('login');
    if(login == 'true'){
        let username = localStorage.getItem('username');
        let purchaseNumber = document.getElementById('purchase-number').value;
        let id = document.getElementById('add-cart-btn').name;
        // 将good_id加入后端cart数据库

        let jsonString = 'username=' + username + '&goodId=' + id + '&goodNum=' + purchaseNumber;
        let url = '/good/add';
        ajaxPost(url, function(e){console.log(e);}, jsonString);
        alert('添加成功！');
    } else {
        alert('请先登录！');
    }
}