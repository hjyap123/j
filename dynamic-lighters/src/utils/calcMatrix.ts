import * as THREE from "three";

// 感谢 threejs 带我复习了一遍矩阵变换
/**
 * getRotationMatrix
 * desc: obj 获取根据任意起点方向轴旋转角度的变换矩阵
 *  - start: 向量起点
 *  - axis: 向量方向
 *  - theta: 旋转角度
 * */
const getRotationMatrix = (start: THREE.Vector3, axis: THREE.Vector3, theta: number) => {
  var x = start.x;
  var y = start.y;
  var z = start.z;
  var uUn = axis.x;
  var vUn = axis.y;
  var wUn = axis.z;
  var l = Math.sqrt(uUn * uUn + vUn * vUn + wUn * wUn);

  var u = uUn / l;
  var v = vUn / l;
  var w = wUn / l;

  var u2 = u * u;
  var v2 = v * v;
  var w2 = w * w;
  var cosT = Math.cos(theta);
  var oneMinusCosT = 1 - cosT;
  var sinT = Math.sin(theta);

  // 右乘矩阵
  var rotationMatrixArr = new Array(16);

  rotationMatrixArr[0] = u2 + (v2 + w2) * cosT;
  rotationMatrixArr[1] = u * v * oneMinusCosT + w * sinT;
  rotationMatrixArr[2] = u * w * oneMinusCosT - v * sinT;
  rotationMatrixArr[3] = 0;

  rotationMatrixArr[4] = u * v * oneMinusCosT - w * sinT;
  rotationMatrixArr[5] = v2 + (u2 + w2) * cosT;
  rotationMatrixArr[6] = v * w * oneMinusCosT + u * sinT;
  rotationMatrixArr[7] = 0;

  rotationMatrixArr[8] = u * w * oneMinusCosT + v * sinT;
  rotationMatrixArr[9] = v * w * oneMinusCosT - u * sinT;
  rotationMatrixArr[10] = w2 + (u2 + v2) * cosT;
  rotationMatrixArr[11] = 0;

  rotationMatrixArr[12] =
    (x * (v2 + w2) - u * (y * v + z * w)) * oneMinusCosT + (y * w - z * v) * sinT;
  rotationMatrixArr[13] =
    (y * (u2 + w2) - v * (x * u + z * w)) * oneMinusCosT + (z * u - x * w) * sinT;
  rotationMatrixArr[14] =
    (z * (u2 + v2) - w * (x * u + y * v)) * oneMinusCosT + (x * v - y * u) * sinT;
  rotationMatrixArr[15] = 1;

  const rotationMatrix: THREE.Matrix4 = new THREE.Matrix4();
  rotationMatrix.elements = [...rotationMatrixArr];

  return rotationMatrix;
};

export { getRotationMatrix };
