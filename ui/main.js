console.log('Loaded!');
var img = document.getElementById('madi');
function moveRight (){
    marginLeft = marginLeft + 10;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function (){
    var interval = setInterval(moveRight, 100);
    img.style.marginLeft = '100px';
};