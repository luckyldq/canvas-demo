/* 
设置主题，如
style： 颜色
注释的属性：在调用时传入即可
*/
let options = {
    color:'black', // 颜色
    style:"black", // fillStyle或者strokeStyle参数
    font:"20px 宋体",
    textAlign:"center",
    textBaseline:"middle",
    lineWidth:1,
    lineCap: "butt",
    lineJoin: "miter",
    r:5,
    // type:'stroke',  // 考虑到可能会同时描边和填充的情况，扩展成isStroke和isFill
    isStroke:true,  // 默认描边
    isFill:false,    // 是否填充
    fillStyle: 'black',
    // style:'', // 颜色，渐变，图案
    // globalCompositeOperation:"source-over"  // 图像混合模式
    // extendStyle:function(){}  // 用来扩展其他样式
}
function setTheme(themeOptions){
    options = Object.assign({}, options, themeOptions);
}
// 窗口坐标转化为基于Canvas的坐标，
/**
 * bbox的宽高可能会受到style中的width/height的影响
 * @param canvas
 * @param x ： 如：pointer.clientX
 * @param y
 * @returns {{x: number, y: number}}
 */
function windowToCanvas(ctx,x,y) {
    let canvas = ctx.canvas;
    var bbox = canvas.getBoundingClientRect();
    return {
        x: x - bbox.left*(canvas.width/bbox.width),
        y: y - bbox.top*(canvas.height/bbox.height)
    }
}
/////////// 绘制基础图形 ////////////////
// 绘制直线
/* 
ctx：
x0, y0：绘制起点
x1, y1：绘制终点
*/
function strokeLine(extendOptions){
    let option = {
        // ctx, x0, y0, x1, y1, 
        style: options.style,
        lineWidth: options.lineWidth,
        // lineCap: options.lineCap,
        // lineJoin: options.lineJoin
    }
    let {ctx, x0, y0, x1, y1, style, lineWidth, lineCap, lineJoin, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.strokeStyle = style || style;
    ctx.lineWidth = lineWidth;
    lineCap && (ctx.lineCap = lineCap);
    lineJoin && (ctx.lineJoin = lineJoin);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    _setComposite(ctx, globalCompositeOperation);
    ctx.stroke();
}
// 绘制虚线
/* 
ctx：
x0, y0：绘制起点
x1, y1：绘制终点
*/
function strokeDashLine(extendOptions){
    let option = {
        // ctx, x0, y0, x1, y1, 
        style: options.style,
        dash: [3,3],
        lineWidth: options.lineWidth
    }
    let {ctx, x0, y0, x1, y1, style, dash, lineWidth, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.setLineDash(dash);
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = style;
    ctx.lineWidth = lineWidth;
    _setComposite(ctx, globalCompositeOperation);
    ctx.stroke();
    // 部分浏览器bug，需要手动重置
    ctx.setLineDash([]);
}
// 绘制文字
function drawText(extendOptions){
    let option = {
        // ctx, text, x, y,
        font: options.font,
        textAlign: options.textAlign,
        textBaseline: options.textBaseline,
        style:options.style,
        isStroke:options.isStroke,
        isFill:options.isFill,
        fillStyle: options.fillStyle
    }
    let {ctx, text, x, y, font, isStroke, isFill, textAlign, textBaseline, style, fillStyle, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.font = font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    _setComposite(ctx, globalCompositeOperation);
    // fillText  strokeText
    if(isStroke){
        ctx.strokeStyle = style;
        ctx.strokeText(text,  x, y);
    }
    if(isFill){
        ctx.fillStyle = fillStyle;
        ctx.fillText(text,  x, y);
    }
}
// 绘制填充矩形
function drawRect(extendOptions){
    let option = {
        // ctx, x, y, w, h,
        style: options.style,
        isStroke:options.isStroke,
        isFill:options.isFill,
        fillStyle: options.fillStyle
    }
    let {ctx, x, y, w, h, isStroke, isFill, style, fillStyle, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    _setComposite(ctx, globalCompositeOperation);
    isStroke && _strokeGraph(ctx, style);
    isFill && _fillGraph(ctx, fillStyle);
}
// 绘制扇形
function drawSector(extendOptions){
    let option = {
        // ctx, x, y, r, deg1, deg2, 
        r:options.r,
        style: options.style,
        counterclockwise: false,
        isStroke:options.isStroke,
        isFill:options.isFill,
        fillStyle: options.fillStyle
    }
    let {ctx, x, y, r, deg1, deg2, counterclockwise, isStroke, isFill, style, fillStyle, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.arc(x, y, r, deg1, deg2, counterclockwise);
    _setComposite(ctx, globalCompositeOperation);
    isStroke && _strokeGraph(ctx, style);
    isFill && _fillGraph(ctx, fillStyle);
}
// 绘制圆形
function drawCircle(extendOptions){
    let option = {
        // ctx, x, y, 
        r: options.r,
        style: options.style,
        isStroke:options.isStroke,
        isFill:options.isFill,
        fillStyle: options.fillStyle
    }
    let {ctx, x, y, r, isStroke, isFill, style, fillStyle, globalCompositeOperation} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI, false);
    _setComposite(ctx, globalCompositeOperation);
    isStroke && _strokeGraph(ctx, style);
    isFill && _fillGraph(ctx, fillStyle);
}
// 设置图形叠加模式
/* 
设置图形叠加模式
*/
function _setComposite(ctx, globalCompositeOperation){
    globalCompositeOperation && (ctx.globalCompositeOperation = globalCompositeOperation);
}
// 描边图形
/* 
描边图形
*/
function _strokeGraph(ctx, style){
    ctx.strokeStyle = style;
    ctx.stroke();
}
// 填充图形
/* 
填充图形
*/
function _fillGraph(ctx, style){
    ctx.fillStyle = style;
    ctx.fill();
}
/////////// 绘制全局效果 ////////////////////
// 设置阴影样式
/* 
绘制阴影比较消耗浏览器性能
x：水平偏移
y：垂直偏移
style：阴影颜色
blur：阴影模糊度
*/
function setShadowStyle(extendOptions){
    let option = {
        // ctx,x,y,blur
        x:5,
        y:5,
        style:options.style,
        blur: 5
    }
    let {ctx, x, y, style, blur} = Object.assign({},option,extendOptions);
    ctx.shadowstyle = style;
    ctx.shadowOffsetX = x;
    ctx.shadowOffsetY = y;
    ctx.shadowBlur = blur;
}
/////////// 绘制复杂业务图形 ////////////////
// 绘制某个坐标的十字线
/* 

*/
function drawCrossLine(extendOptions){
    let option = {
        // ctx, x, y
        lineWidth:0.5
    }
    let {ctx, x, y, style, lineWidth, globalCompositeOperation} = Object.assign({},option,extendOptions);
    // 横向
    strokeLine({
        ctx, 
        x0: 0, 
        y0: y, 
        x1: ctx.canvas.width, 
        y1: y,
        style,
        lineWidth,
        globalCompositeOperation
    });
    // 纵向
    strokeLine({
        ctx, 
        x0: x, 
        y0: 0, 
        x1: x, 
        y1: ctx.canvas.height,
        style,
        lineWidth,
        globalCompositeOperation
    });
}
// 绘制网格
/* 
初始值等于0.5的原因：canvas处理像素边界的规则；
*/
function drawGrid(extendOptions){
    let option = {
        // ctx, 
        stepX:10,
        stepY:10,
        style:'lightgray',
        lineWidth:0.5
    }
    let {ctx, stepX, stepY, style, lineWidth,  globalCompositeOperation} = Object.assign({},option,extendOptions);
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    let x=0.5,
        y=0.5;
    while(x < w){
        strokeLine({
            ctx, 
            x0: x, 
            y0: 0, 
            x1: x, 
            y1: h,
            style,
            lineWidth,
            globalCompositeOperation
        });
        x += stepX;
    }
    while(y < h){
        strokeLine({
            ctx, 
            x0: 0, 
            y0: y, 
            x1: w, 
            y1: y,
            style,
            lineWidth,
            globalCompositeOperation
        });
        y += stepY;
    }
}
// 绘制环形
/* 
关键点：设置路径的方向，非0环绕原则填充；
x,y：圆环中心点
r：内圆半径
deltaR：外圆与内圆半径差值
*/
function drawLoop(extendOptions){
    let option = {
        // ctx, 
    };
    let {ctx, x, y, r1, deltaR, style} = Object.assign({},option,extendOptions);
    ctx.beginPath();
    ctx.arc(x, y, r1, 0, 2*Math.PI, false);
    ctx.moveTo(x,y); // 隐藏路径之间的横线
    ctx.arc(x, y, r1+deltaR, 0, 2*Math.PI, true);
    ctx.fillStyle = style;
    ctx.fill();
}
// 绘制正多边形
function _getPolygonPoints(ctx, x, y, r, lineNums){
    let points = [];
    // 每个角度
    const perAngle = 2*Math.PI / lineNums;
    for(let i=0; i<lineNums; i++){
        let curAngle = i * perAngle;
        points.push([
            r * Math.cos(curAngle) + x,
            r * Math.sin(curAngle) + y
        ]);
    }
    return points;
}
/* 
x,y,r：外接圆圆心和半径
*/
function drawPolygon(extendOptions){
    let option = {
        // ctx, x, y
        r: options.r,
        lines: 3,
        style: options.style,
        isStroke:options.isStroke,
        isFill:options.isFill,
        fillStyle: options.fillStyle
    };
    let {ctx, x, y, r, lines, isStroke, isFill, style, fillStyle} = Object.assign({},option,extendOptions);
    let points = _getPolygonPoints(ctx, x, y, r, lines);
    // lineTo和moveTo用反了，导致渲染没效果，T_T
    for(let i=0; i<points.length; i++){
        let point = points[i];
        if(i == 0){
            ctx.moveTo(point[0], point[1]);
        }else{
            ctx.lineTo(point[0], point[1]);
        }
    }
    ctx.closePath();
    isStroke && _strokeGraph(ctx, style);
    isFill && _fillGraph(ctx, fillStyle);
}
            
export {
    windowToCanvas,
    setTheme,
    strokeLine,
    strokeDashLine,
    drawText,
    drawRect,
    drawSector,
    drawCircle,
    setShadowStyle,
    drawCrossLine,
    drawGrid,
    drawLoop,
    drawPolygon
};