window.onload = function () {
    let file = document.getElementById('file');
    file.onchange = function () {
        let path = this.value;
        let d = path.lastIndexOf('.');
        let result = path.slice(d+1);
        alert(result);
    }
};