// let login = false; // 存到cookie或者前端，是一个能对是得到的变量值
// let username = "";

function headOperate() {
    let login_tmp = localStorage.getItem('login');
    let username = localStorage.getItem('username');
    console.log('login = ' + login_tmp);

    let headLogin = document.getElementById("head-l-login");
    let headRegister = document.getElementById("head-l-register");
    let headName = document.getElementById("head-l-name");
    let headLogout = document.getElementById("head-l-logout");
    let headCart = document.getElementById("head-l-cart");
    let headOrder = document.getElementById("head-l-order");

    if(login_tmp == 'true') {
        console.log('headOperate-true');
        headLogin.innerHTML = note(headLogin.innerHTML);
        headRegister.innerHTML = note(headRegister.innerHTML);
        headName.innerHTML = username;
        headLogout.innerHTML = unnote(headLogout.innerHTML);
        headCart.innerHTML = unnote(headCart.innerHTML);
        headOrder.innerHTML = unnote(headOrder.innerHTML);
    } else {
        console.log('headOperate-false');
        headLogin.innerHTML = unnote(headLogin.innerHTML);
        headRegister.innerHTML = unnote(headRegister.innerHTML);
        headName.innerHTML = "";
        headLogout.innerHTML = note(headLogout.innerHTML);
        headCart.innerHTML = note(headCart.innerHTML);
        headOrder.innerHTML = note(headOrder.innerHTML);
    }
}

function note(stringHtml) {
    if(stringHtml[1] != '!') {
        return '<!--' + stringHtml + '-->';
    } else {
        return stringHtml;
    }
    
}

function unnote(stringHtml) {
    if(stringHtml[1] != '!') {
        return stringHtml;
    } else {
        return stringHtml.substring(4, stringHtml.length-3);
    }
}

function buttonLogout() {
    // login = false;
    console.log('logout');
    localStorage.setItem('login', false );
    headOperate();
    window.location.href = '/';
}
function buttonLogin() {
    // login = true;
    headOperate();
    console.log('ready to jump');
    window.location.href = '/';
}
