window.onload = function () {
    let btn = document.getElementsByClassName('pic-select')[0];
    let skin = document.getElementsByClassName('pic-box')[0];
    let pic = document.getElementsByTagName('img');
    let bodyskin = document.body;
    btn.onmouseover = function () {
        skin.style.display = 'block';
    }
    btn.onclick = function () {
        skin.style.display = 'none';
    }
    for(let i=0;i<pic.length;i++) {
        pic[i].onclick = function () {
            document.body.style.backgroundImage = `url(./pic/${i+1}.jpg)`;           
        }
    }
};