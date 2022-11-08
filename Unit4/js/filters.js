// workerjs
onmessage = function(e){
      // console.log(e.data); // 接收事件参数
      let {fnName, imageData, imageDataCopy} = e.data;
      let result = eval(fnName + '(imageData, imageDataCopy)');
      // console.log(result);
      postMessage(result);
}

// 浮雕滤镜计算方法
function embossFilter(imageData, imageDataCopy){
      // console.log('emboss');
      
      let width = imageData.width;
      let data = imageData.data;
      let targetData = imageDataCopy.data;
      let length = data.length;

      for(let i=0; i<length; i++){
            // 边界处理
            if(i <= length - width*4){
                  if((i+1)%4 !== 0){
                        // 最右侧的一个像素，取上一个位置的信息
                        if((i+4) % (width*4) == 0){
                           targetData[i] = targetData[i-4];
                           targetData[i+1] = targetData[i-3];
                           targetData[i+2] = targetData[i-2];
                           targetData[i+3] = targetData[i-1];
                           i += 3;
                        }
                        else{
                           // 颜色分量     平均值  +  加上当前像素的2倍 - 下个像素同一个颜色分量值 - 往后四行的颜色分量值
                           targetData[i] = 255/2  + 2*data[i] - data[i+4] - data[i + width *4];
                        }
                  }
                  else{
                        // 透明度
                        targetData[i] = data[i];
                  }
            }
            else{ // 最后几行，没有下面的像素，所以复制上面的计算过的数据
                  targetData[i] = targetData[i - width*4];
            }
      }
      
      // ctx.putImageData(imageDataCopy, 0, 0);
      return imageDataCopy;
}
// 太阳镜滤镜计算方法
function sunglassFilter(imageData, imageDataCopy){
      // console.log('sunglass');

      let width = imageData.width;
      let data = imageData.data;
      let targetData = imageDataCopy.data;
      let length = data.length;

      for(let i=0;i<length;i++){
            if((i+1)%4 !== 0){
                  if((i+4)%(width*4) == 0){ // 最右侧像素
                        targetData[i] = targetData[i-4];
                        targetData[i+1] = targetData[i-3];
                        targetData[i+2] = targetData[i-2];
                        targetData[i+3] = targetData[i-1];
                        i+=3;
                  }
                  else{
                        // 当前颜色分量值的两倍 - 下一个像素点的分量值 - 下一个像素分量值的0.5倍
                        targetData[i] = 2*data[i] - data[i+4] - 0.5*data[i+4];
                  }
            }
            else{
                  targetData[i] = data[i];
            }
      }

      // ctx.putImageData(imageDataCopy, 0, 0);
      return imageDataCopy;
}
// 灰度滤镜计算方法
function grayFilter(imageData, imageDataCopy){
      // console.log('gray');

      let width = imageData.width;
      let data = imageData.data;
      let targetData = imageDataCopy.data;
      let length = data.length;

      for(let i=0;i<length;i++){
            if((i+1)%4 !== 0){
                  // 当前三个颜色分量值的平均值
                  let avg = (data[i] + data[i+1] + data[i+2])/3;
                  targetData[i] = targetData[i+1] = targetData[i+2] = avg;
                  i+=2; // 不是i+=3;这里是过掉两个
            }
            else{
                  targetData[i] = data[i];
            }
      }

      // ctx.putImageData(imageDataCopy, 0, 0);
      return imageDataCopy;
}

