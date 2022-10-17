/* 
设置主题，如
color： 颜色
type: 描边或填充
*/
let options = {
    color:"black",
    font:"20px 宋体",
    textAlign:"center",
    textBaseline:"middle",
    lineWidth:5,
    lineCap: "round",
    lineJoin: "round",
    r:5,
    type:'stroke',
    
    // globalCompositeOperation:"source-over"
}
function setTheme(themeOptions){
    options = Object.assign({}, options, themeOptions);
}
/* 
绘制直线
ctx：
x0, y0：绘制起点
x1, y1：绘制终点
*/
function strokeLine(extendOptions){
    let option = {
        // ctx, x0, y0, x1, y1, 
        color: options.color,
        lineWidth: options.lineWidth,
        lineCap: options.lineCap,
        lineJoin: options.lineJoin
    }
    let {ctx, x0, y0, x1, y1, color, lineWidth, lineCap, lineJoin, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    _setComposite(ctx, globalCompositeOperation);
    ctx.stroke();
}
/* 
绘制虚线
ctx：
x0, y0：绘制起点
x1, y1：绘制终点
*/
function strokeDashLine(extendOptions){
    let option = {
        // ctx, x0, y0, x1, y1, 
        color: options.color,
        dash: [3,3],
        lineWidth: options.lineWidth
    }
    let {ctx, x0, y0, x1, y1, color, dash, lineWidth, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    _setComposite(ctx, globalCompositeOperation);
    ctx.stroke();
    // 部分浏览器bug，需要手动重置
    ctx.setLineDash([]);
}
/* 
绘制文字
type: stroke  fill
*/
function drawText(extendOptions){
    let option = {
        // ctx, text, x, y, 
        type: options.type,
        font: options.font,
        textAlign: options.textAlign,
        textBaseline: options.textBaseline,
    }
    let {ctx, text, x, y, font, type, textAlign, textBaseline, color, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    _setComposite(ctx, globalCompositeOperation);
    // fillText  strokeText
    ctx[type + 'Style'] = color;
    ctx[type+'Text'](text,  x, y);
}
/* 
绘制填充矩形
*/
function drawRect(extendOptions){
    let option = {
        // ctx, x, y, w, h, 
        type: options.type, 
        color: options.color
    }
    let {ctx, x, y, w, h, type, color, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    _setComposite(ctx, globalCompositeOperation);
    // 动态函数名优化
    type=='fill'?_fillGraph(ctx, color):_strokeGraph(ctx, color);
}
/* 
绘制扇形
*/
function drawSector(extendOptions){
    let option = {
        // ctx, x, y, r, deg1, deg2, 
        r:options.r,
        type: options.type, 
        color: options.color,
        counterclockwise: false
    }
    let {ctx, x, y, r, deg1, deg2, counterclockwise, type, color, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.arc(x, y, r, deg1, deg2, counterclockwise);
    _setComposite(ctx, globalCompositeOperation);
    // 动态函数名优化
    type=='fill'?_fillGraph(ctx, color):_strokeGraph(ctx, color);
}
/* 
绘制圆形
*/
function drawCircle(extendOptions){
    let option = {
        // ctx, x, y, 
        r: options.r,
        type: options.type, 
        color: options.color
    }
    let {ctx, x, y, r, type, color, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false);
    _setComposite(ctx, globalCompositeOperation);
    // 动态函数名优化
    type=='fill'?_fillGraph(ctx, color):_strokeGraph(ctx, color);
}
/* 
设置图形叠加模式
*/
function _setComposite(ctx, globalCompositeOperation){
    globalCompositeOperation && (ctx.globalCompositeOperation = globalCompositeOperation);
}
/* 
描边图形
*/
function _strokeGraph(ctx, color){
    ctx.strokeStyle = color;
    ctx.stroke();
}
/* 
填充图形
*/
function _fillGraph(ctx, color){
    ctx.fillStyle = color;
    ctx.fill();
}

export {
    setTheme,
    strokeLine,
    strokeDashLine,
    drawText,
    drawRect,
    drawSector,
    drawCircle
};