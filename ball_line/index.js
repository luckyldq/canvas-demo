const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let w = 400,
    h = 400;
canvas.width = w;
canvas.height = h;

function r(base, minNum = 0){
    return Math.random()*base + minNum;
}
// 绘制小球  小球的运动
/* 
options：
    x,y,r,color,xSpeed,ySpeed
*/
function DrawCircle(options){
    this.r = r(10,10);
    this.x = r(300,this.r);
    this.y = r(300,this.r);
    
    this.color = '#'+parseInt(r('0xFFFFFF')).toString(16);
    this.xSpeed = r(-8,4); // [-4,4]
    this.ySpeed = r(-10,5);

}
DrawCircle.prototype.show = function(){
    this.move();
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
    context.fillStyle = this.color
    context.fill();
}
DrawCircle.prototype.move = function(){
    //  物体匀速运动，碰撞静止物体，速度反向
    // let xSpeed = 2;
    // let ySpeed = 4;
    // 碰到左边和右边
    if(this.x - this.r <= 0 || this.x + this.r >= w){
        this.xSpeed = -this.xSpeed;
    }
    // 碰到上边和下边
    if(this.y - this.r <=0 || this.y + this.r >= h){
        this.ySpeed = -this.ySpeed;
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
}
DrawCircle.prototype.showText = function(text){
    context.beginPath();
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.fillText(text, this.x + this.r + 5, this.y)
}
DrawCircle.prototype.showLine = function(x1, y1){
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.lineTo(x1,y1);
    context.strokeStyle = this.color;
    context.stroke();
}
// 实例化一堆小球
let balls = [];
for(let i=0; i<5; i++){
    balls.push(new DrawCircle());
}
// 画布中所有物体需要一起运动
setInterval(()=>{
    context.clearRect(0,0,w,h);
    balls.forEach((ball, i)=>{
        ball.show();
        ball.showText('javascript');
        for(let j=0;j<i;j++){
            ball.showLine(balls[j].x, balls[j].y);
        }
    });
},24);