let store_username = '';

window.onload = function() {
    headOperate();
    let btnRegister = this.document.getElementById("btn-register");
    btnRegister.onclick = registerPost;
    document.getElementById('head-l-logout').onclick = buttonLogout;
}

function registerPost() {
    let userName = document.getElementById("name").value;
    let psw = document.getElementById("pwd").value;
    let pswAgain = document.getElementById("pwd-again").value;
    if(psw != pswAgain) {
        alert("两次密码输入不一致。");
        return false;
    }
    if(localStorage.getItem('login') == 'true') {
        alert("您已登陆，请先退出。")
    } else if (userName == "" || userName == null) {
        document.getElementById("name").style.color = "red";
        alert("用户名为6-10位英文或数字");
    } else {
        // let jsonData = {
        //     username: userName,
        //     pwd: psw,
        // };
        let stringJson = 'username=' + userName + '&pwd=' + psw;
        // console.log(stringJson);
        store_username = userName;
        
        ajaxPost('/register/click', operateResponse, stringJson)
        // //ajaxPost
        // let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        
        // xmlhttp.onreadystatechange = function()
        // {
        //     console.log(xmlhttp.readyState);
        //     console.log(xmlhttp.status);
        //     if(xmlhttp.readyState == 4 && xmlhttp.status==200)
        //     {
                
        //         operateResponse(xmlhttp.responseText);//成功时逻辑操作
        //     } else {
        //         console.log("unknow fail");
        //     }
        // }
        // xmlhttp.open("POST", '/register/click', true);
        // xmlhttp.setRequestHeader('content-type','application/x-www-form-urlencoded');//可以发送json格式字符串
        // xmlhttp.send(stringJson); //这时才开始发送请求
    }

}

function operateResponse(resText) {
    console.log(resText);
    if (resText == "forbid") {
        localStorage.setItem('login', false );
        document.getElementById("name").style.color = "red";
        alert("用户名非法");
    } else if (resText == "already have") {
        localStorage.setItem('login', false );
        document.getElementById("name").style.color = "red";
        alert("用户名已使用");
    } else {
        localStorage.setItem('login', true);
        localStorage.setItem('username', store_username);
        buttonLogin();
    }
}