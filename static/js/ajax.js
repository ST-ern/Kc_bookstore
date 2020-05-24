// data是jsonstring格式
function ajaxPost(url, onsuccess, data) {
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xmlhttp.open("POST", url, true);
    xmlhttp.onreadystatechange = function()
    {
        if(4 == xmlhttp.readyState && 200 == xmlhttp.status)
        {
            onsuccess(xmlhttp.responseText);//成功时逻辑操作
        }
    }
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");//可以发送json格式字符串
    xmlhttp.send(data); //这时才开始发送请求
}


function ajaxGet(url,onsuccess) {
    var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function()
    {
        if(4 == xmlhttp.readyState && 200 == xmlhttp.status){
            {
                onsuccess(xmlhttp.responseText);//成功时逻辑操作
            }
        }
    }
    xmlhttp.send(); //这时才开始发送请求
}