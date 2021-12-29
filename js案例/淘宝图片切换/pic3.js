window.onload = function () {
    let bigPic = document.getElementById('big');
    let smallPic = document.getElementsByClassName('smallImg');
    for (let i = 0;i<smallPic.length;i++)
    {
        smallPic[i].onmouseover = function () {
            for (let j = 0;j<smallPic.length;j++) {
                smallPic[j].parentNode.parentNode.setAttribute('class','');
            }
            this.parentNode.parentNode.setAttribute('class','active');
            // var picSrc = this.getAttribute('src');
            // console.log(picSrc);
            // bigPic.setAttribute('src',picSrc);
            let curent = i+1;
            bigPic.setAttribute('src',`./img3/img/${curent}.webp`);
        }
    }
};