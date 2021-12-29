window.onload = function () {
    function $(id) {
        return typeof id === 'string'?document.getElementById(id):null;
    }
    $('score').onblur = function () {
        let span = $('prompt');
        let value = parseFloat(this.value); 
        // span.style.color = 'red';
        span.setAttribute('style','color:red');
        if (value>=0&&value<=100) {
            span.innerHTML = '输入成绩正确';
        } else {
            span.innerHTML = '输入成绩不正确';
            $('score').setAttribute('style','border: 1px solid red');
        }
            
        
    }
};