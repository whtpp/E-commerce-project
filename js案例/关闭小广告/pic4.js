window.onload = function () {
    let closeBtn = document.getElementsByTagName('button')[0];
    let closeAd = document.getElementsByTagName('div')[0];
    closeBtn.onclick = function () {
        closeAd.style.display = 'none';
    }
};