const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

// context.beginPath();
// context.arc(200, 200, 100, 0, 1*Math.PI/180);
// context.stroke();

// context.beginPath();
// context.arc(200, 200, 100, 0, 2*Math.PI/180);
// context.stroke();

function animate(i){
    context.beginPath();
    context.arc(200, 200, 100, i*Math.PI/180, (i+1)*Math.PI/180);
    context.stroke();
}
let i = 0;
let timer = setInterval(() => {
    animate(i);
    i++;
    if(i>180){
        clearInterval(timer);
    }
}, 60);
