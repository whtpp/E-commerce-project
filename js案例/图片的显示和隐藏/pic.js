window.onload = function () {
    let btn = document.getElementById('btn');
    let pic = document.getElementsByTagName('img')[0];
    let isShow = true;
    btn.onclick = function () {
        if (isShow) {
            pic.style.display = 'none';
            btn.innerHTML = '显示';
            isShow = false;
        } else {
            pic.style.display = 'block';
            btn.innerHTML = '隐藏';
            isShow = true;
        }
    }
};