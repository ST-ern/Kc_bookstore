let store_username = '';

window.onload = function() {
    headOperate();
    let btnLogin = this.document.getElementById("btn-login");
    btnLogin.onclick = loginPost;
    document.getElementById('head-l-logout').onclick = buttonLogout;
    
}


function loginPost() {
    let userName = document.getElementById("name").value;
    let pwd = document.getElementById("pwd").value;

    if(localStorage.getItem('login') == 'true') {
        alert("您已登陆，请先退出。")
    } else if (pwd != "" && userName != "") { 
        
        let jsonData = {
            username: userName,
            pwd: pwd,
        };
        let stringJson = 'username=' + userName + '&pwd=' + pwd;
        store_username = userName;
        ajaxPost("/login/click", operateResponse, stringJson);

        // console.log(userName + " " + pwd + " " + login);
        
    } else {
        alert("请输入完整登陆信息！");
        return false;
    }
}
function operateResponse(resText) {
    if(resText == "true") {
        localStorage.setItem('login', true );
        localStorage.setItem('username', store_username );
        console.log("登录成功");
        buttonLogin();
    } else if(resText == "no register") {
        localStorage.setItem('login', false );
        alert("请先注册");
    } else {
        localStorage.setItem('login', false );
        alert("密码错误");
    }
}