window.onload = function () {
    function $(id) {
        return typeof id === 'string'?document.getElementById(id):null;
    }
    
    $('btn').onclick = function () {
        let comment = $('comment').value;
        let newLi = document.createElement('li');
        newLi.innerHTML = `${comment}<a href="javascript:void(0)">删除</a>`;
        $('comment_area').insertBefore(newLi,$('comment_area').children[0]);
        $('comment').value='';
        let remove = document.getElementsByTagName('a');
        for(var i = 0;i<remove.length;i++) {
            remove[i].onclick = function () {
                this.parentNode.remove();
            }
        }
    }
    
};