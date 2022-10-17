
/* 
option = {
    el   //  挂载canvas的元素
}
*/
function antoGraph(option){
    // 创建画布
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const ratio = 1; // window.devicePixelRatio; // 缩放比，针对屏幕的清晰度不同
    
    updateSize();
    canvasStyle();
    option.el.appendChild(canvas);
    
    // 存储绘画状态
    let isDrawing = false, // 是否正在绘画中
        hasDraw = false, // 画布中是否有内容
        startX = startY = 0;

    // canvas-mousedown canvas-mousemove canvas-mouseup document-mouseup
    canvas.addEventListener('mousedown',onMouseDown)
    canvas.addEventListener('mousemove',onMouseMove);
    canvas.addEventListener('mouseup',onMouseUp);
    document.addEventListener('mouseup',documentUp);
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchmove", onTouchMove);
    canvas.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchend", documentUp);
    // 设置画布大小
    function updateSize(w,h) {
        console.log(w, h)
        canvas.width = option.el.clientWidth; // w ?? option.el.clientWidth;
        canvas.height = option.el.clientHeight; // h ?? option.el.clientHeight;  // 手机不识别??
    }
    // 初始化画布样式
    function canvasStyle(){
        context.lineCap = "round";
        context.lineJoin = "round";
        context.fillStyle = "#000000";
        context.fillRect(0,0,canvas.width, canvas.height);
        context.lineWidth = 4;
        context.strokeStyle = 'red';
    }
    // 鼠标按下
    function onMouseDown(e){
        e.preventDefault();
        // 更改绘画状态
        isDrawing = true;
        hasDraw = true;
        // 开始绘制
        drawStart({
            x: e.offsetX,  // 当前鼠标相对于canvas的位置
            y: e.offsetY
        });
    }
    // 鼠标移动
    function onMouseMove(e){
        e.preventDefault();
        // 移动绘制
        isDrawing && drawMove({
            x: e.offsetX,
            y: e.offsetY
        });
    }
    // 鼠标抬起
    function onMouseUp(e){
        e.preventDefault();
        isDrawing && drawEnd({
            x: e.offsetX,
            y: e.offsetY
        });
        isDrawing = false;
    }
    function drawStart({x, y}){
        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
        startX = x;
        startY = y;
    }
    function drawMove({x, y}){
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
        startX = x;
        startY = y;
    }
    function drawEnd({x, y}){
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(x, y);
        context.stroke();
        context.closePath();
    }
    function documentUp(){
        isDrawing = false;
        // 如果节点被销毁了就取消document的事件
        // if(document.body.contains(canvas)){
        //     document.removeEventListener('mouseup', documentUp);
        // }
    }
    // 手指按下
    function onTouchStart(e){
        e.preventDefault();
        if(e.touches.length === 1){
            isDrawing = true;
            hasDraw = true;
            const finger = e.touches[0];
            const box = canvas.getBoundingClientRect();
            drawStart({
                x: finger.clientX - box.left,
                y: finger.clientY - box.top
            });
        }
    }
    // 手指移动
    function onTouchMove(e){
        e.preventDefault();
        if (!isDrawing) return;
        if (e.touches.length === 1) {
            const finger = e.touches[0];
            const box = canvas.getBoundingClientRect();
            drawMove({
                x: finger.clientX - box.left,
                y: finger.clientY - box.top
            })
        }
    }
    // 手指抬起
    function onTouchEnd(e){
        e.preventDefault();
        if (!isDrawing) return;
        if (e.touches.length === 1) {
            const finger = e.touches[0];
            const box = canvas.getBoundingClientRect();
            drawEnd({
                x: finger.clientX - box.left,
                y: finger.clientY - box.top
            })
        }
    }
    
    // 重置
    function onReset() {
        if(!hasDraw) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        hasDraw = false;
        console.log('已清除');
        initCanvas();
    }
    // 输出图片
    function getBase64(){
        
    }
    return {
        canvas,
        context,
        onReset,
        getBase64
    }
}

let el = document.querySelector('.autograph-box');
let lastCanvas,lastContext;
let isHorizen = false; // 初始化是横屏

init();
function init(){
    let {context, canvas, onReset} = antoGraph({
        el
    });
    lastCanvas = canvas;
    lastContext = context;
}

// canvas切换为全屏，再切换回去
function changeScreen(){
    isHorizen = !isHorizen;
    // 将canvas容器设置为全屏
    // 保存canvas内容的base64，并销毁canvas元素
    // 重新生成canvas元素
    // 将base64绘制在canvas中
    // 
    el.style.width = document.documentElement.clientWidth + 'px';
    el.style.height = isHorizen?document.documentElement.clientHeight + 'px':'300px';
    // 
    let canvasEl = el.querySelector('canvas')
    let base64 = canvasEl.toDataURL();
    el.removeChild(canvasEl);
    //
    let {context,canvas, onReset} = antoGraph({
        el
    });
    //
    context.translate(canvas.width/2, canvas.height/2);
    context.rotate(90*Math.PI/180);
    context.translate(-canvas.width/2, -canvas.height/2);

    let img = new Image();
    img.src = base64;
    img.onload = function(){
        context.drawImage(img,0,0,img.width,img.height,0,0,canvas.width,canvas.height);
    }

}
// 横屏竖屏切换
function changeScreen2(){
    isHorizen = !isHorizen;
    if(isHorizen){
        el.style.height = document.documentElement.clientHeight + 'px';
    }else{
        el.style.height = '300px';
    }
    // 
    let imageData0 = lastContext.getImageData(0,0,lastCanvas.width, lastCanvas.height);
    el.removeChild(lastCanvas);
    //
    let {context,canvas, onReset} = antoGraph({
        el
    });
    lastCanvas = canvas;
    lastContext = context;

    let w = canvas.width,
        h = canvas.height;
    
    let imageData = rotateImage(imageData0, w, h, isHorizen?'r':'l');
    // 画布大小改变后会清空内容，需要保存绘制的内容，然后重绘
    context.putImageData(imageData,0,0);
    
}
// 旋转imagedata
// https://www.codenong.com/cs106055830/
function rotateImage(imageData0, w, h, direction='l'){
    // let w = canvas.width,
    //     h = canvas.height;
    // let imageData0 = context.getImageData(0,0,w, h);
    let imageData1 = new ImageData(h, w);
    let imageData2 = new ImageData(h, w);
    let data0 = imageData0.data;
    let data1 = imageData1.data;
    let data2 = imageData2.data;
    // transpose
    let r = r1 = 0;
    for(let y=0, lenH = h; y<lenH; y++){
        for(let x=0, lenW = w; x<lenW; x++){
            r = (x + lenW * y) * 4;
            r1 = (y + lenH * x) * 4;
            data1[r1+0] = data0[r+0];
            data1[r1+1] = data0[r+1];
            data1[r1+2] = data0[r+2];
            data1[r1+3] = data0[r+3];
        }
    }
    // reverse width/height
    for(let y=0, lenH = w; y<lenH; y++){
        for(let x=0, lenW = h; x<lenW; x++){
            r = (x + lenW * y) * 4;
            r1 = direction=='l'?(x + lenW * (lenH - y - 1)) * 4:((lenW - x - 1) + lenW * y ) * 4;
            data2[r1+0] = data1[r+0];
            data2[r1+1] = data1[r+1];
            data2[r1+2] = data1[r+2];
            data2[r1+3] = data1[r+3];
        }
    }
    return imageData2;
}