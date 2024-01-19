import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import * as Tone from "tone";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getRotationMatrix } from "./utils/calcMatrix";
import "./App.css";
import { fragmentShader, vertexShader } from "./utils/fireMaterial";

const App: React.FC = () => {
  const lighterOn1 = useRef<boolean>(false);
  const lighterOn2 = useRef<boolean>(false);
  const lighterOn3 = useRef<boolean>(false);

  const modelRef = useRef<HTMLDivElement>(null);

  // 全局变量
  // const bgWidth: number = 600;
  // const bgHeight: number = 400;
  const bgWidth: number = window.innerWidth;
  const bgHeight: number = window.innerHeight;

  const scene: THREE.Scene = new THREE.Scene(); // 场景
  const camera = new THREE.PerspectiveCamera(75, bgWidth / bgHeight, 0.1, 1000); // 相机
  const renderer = new THREE.WebGL1Renderer({ logarithmicDepthBuffer: true }); // 渲染器
  const controls = new OrbitControls(camera, renderer.domElement); // 控件对象

  // 渲染
  const renderDom = () => {
    renderer.render(scene, camera);
  };

  // 初始化设置
  const initSetting = () => {
    // 相机
    camera.position.set(-10, 151, 282);
    camera.lookAt(scene.position);
    // 渲染器
    renderer.setSize(bgWidth, bgHeight);
    renderer.setClearColor(0xf0f0f0, 0.8);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // 坐标系
    const axes: THREE.AxesHelper = new THREE.AxesHelper(1000);
    // scene.add(axes);
    // 环境光
    const ambientLight: THREE.AmbientLight = new THREE.AmbientLight(0x000000, 0.7);
    scene.add(ambientLight);
    // 点光源
    const pointLight1: THREE.PointLight = new THREE.PointLight(0x000000, 0.9);
    pointLight1.position.set(40, 80, 80);
    scene.add(pointLight1);
    // 半球光源
    const HemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    HemisphereLight.position.set(0, 200, 0);
    scene.add(HemisphereLight);
    // 直径光源
    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    DirectionalLight.position.set(0, 200, 100);
    DirectionalLight.castShadow = true;
    DirectionalLight.shadow.camera.top = 180;
    DirectionalLight.shadow.camera.bottom = -100;
    DirectionalLight.shadow.camera.left = -120;
    DirectionalLight.shadow.camera.right = 120;
    scene.add(DirectionalLight);
    // 地面
    const groundMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({ color: 0x222222, depthWrite: false })
    );
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);
    renderDom();
    // 视角控件
    controls.addEventListener("change", () => {
      renderer.render(scene, camera);
    });
  };

  // 初始化物体
  const initLighter = (
    modelName: string,
    modelBodyColor: number,
    modelHeadColor: number,
    modelPos: any
  ) => {
    // model 命名
    const ItemName: string = `${modelName}Item`;
    const modelBodyName: string = `${modelName}Body`;
    const modelHeadName: string = `${modelName}Head`;

    // 机身 - 主体
    const lighterBodyBox1 = new THREE.Mesh(
      new THREE.BoxGeometry(46, 50, 22),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyBox1.name = ItemName;
    lighterBodyBox1.position.set(modelPos.x + 0, modelPos.y + 27, modelPos.z + 0);

    const lighterBodyBox2 = new THREE.Mesh(
      new THREE.BoxGeometry(42, 50, 26),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyBox2.name = ItemName;
    lighterBodyBox2.position.set(modelPos.x + 0, modelPos.y + 27, modelPos.z + 0);

    const lighterBodyBox3 = new THREE.Mesh(
      new THREE.BoxGeometry(42, 50, 22),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyBox3.name = ItemName;
    lighterBodyBox3.position.set(modelPos.x + 0, modelPos.y + 25, modelPos.z + 0);

    // 机身 - 轴承
    const lighterBodyBearing = new THREE.Mesh(
      new THREE.CylinderGeometry(1, 1, 22, 8),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyBearing.name = ItemName;
    lighterBodyBearing.position.set(modelPos.x - 22, modelPos.y + 52, modelPos.z + 0);
    lighterBodyBearing.rotateX(Math.PI / 2);

    // 机身 - 出火孔
    const lighterBodyHole1 = new THREE.Mesh(
      new THREE.CylinderGeometry(9, 9, 14, 6),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyHole1.name = ItemName;
    lighterBodyHole1.position.set(modelPos.x + 4, modelPos.y + 53, modelPos.z + 0);

    const lighterBodyHole2 = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshLambertMaterial({ color: modelBodyColor })
    );
    lighterBodyHole2.name = ItemName;
    lighterBodyHole2.position.set(modelPos.x + 10, modelPos.y + 51, modelPos.z + 0);
    lighterBodyHole2.rotateZ(Math.PI / 4);

    // 火焰
    let pre = 80;
    let width = bgWidth / pre;
    let height = bgHeight / pre;
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(1, 1, 1) },
        iMouse: { value: new THREE.Vector2(0.0, 0.0) },
      },
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
      transparent: true,
    });
    geometry.scale(1, 2.5, 4);
    const lighterFire1 = new THREE.Mesh(geometry, material);
    lighterFire1.position.set(modelPos.x + 5, modelPos.y + 70, modelPos.z + 0.5);
    const lighterFire2 = new THREE.Mesh(geometry, material);
    lighterFire2.position.set(modelPos.x + 5, modelPos.y + 70, modelPos.z - 0.5);

    scene.add(lighterFire1);
    scene.add(lighterFire2);

    function animate() {
      requestAnimationFrame(animate);
      material && (material.uniforms.iTime.value += 0.004);
      renderer.render(scene, camera);
    }
    animate();

    // 机身 group
    const lighterBody = new THREE.Group();
    lighterBody.name = modelBodyName;
    lighterBody.add(
      lighterBodyBox1,
      lighterBodyBox2,
      lighterBodyBox3,
      lighterBodyBearing,
      lighterBodyHole1,
      lighterBodyHole2
    );

    // 机首 - 主体
    const lighterHeadBox1 = new THREE.Mesh(
      new THREE.BoxGeometry(46, 20, 22),
      new THREE.MeshLambertMaterial({ color: modelHeadColor })
    );
    lighterHeadBox1.name = ItemName;
    lighterHeadBox1.position.set(modelPos.x + 0, modelPos.y + 62, modelPos.z + 0);

    const lighterHeadBox2 = new THREE.Mesh(
      new THREE.BoxGeometry(42, 20, 26),
      new THREE.MeshLambertMaterial({ color: modelHeadColor })
    );
    lighterHeadBox2.name = ItemName;
    lighterHeadBox2.position.set(modelPos.x + 0, modelPos.y + 62, modelPos.z + 0);

    const lighterHeadBox3 = new THREE.Mesh(
      new THREE.BoxGeometry(42, 20, 22),
      new THREE.MeshLambertMaterial({ color: modelHeadColor })
    );
    lighterHeadBox3.name = ItemName;
    lighterHeadBox3.position.set(modelPos.x + 0, modelPos.y + 64, modelPos.z + 0);

    // 机首 group
    const lighterHead = new THREE.Group();
    lighterHead.name = modelHeadName;
    lighterHead.add(lighterHeadBox1, lighterHeadBox2, lighterHeadBox3);

    const lighter = new THREE.Group();
    lighter.name = "lighter1";
    lighter.add(lighterBody, lighterHead);
    scene.add(lighter);

    renderDom();
  };

  // music
  const audioCtx = new AudioContext();
  let player1: Tone.Player;
  let player2: Tone.Player;
  let player3: Tone.Player;
  fetch("./src/music/test1.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      player1 = new Tone.Player(audioBuffer).toDestination();
    });
  fetch("./src/music/test2.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      player2 = new Tone.Player(audioBuffer).toDestination();
    });
  fetch("./src/music/test3.mp3")
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      player3 = new Tone.Player(audioBuffer).toDestination();
    });

  // 点击物体
  const handleClickModal = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const raycaster = new THREE.Raycaster(); // 光线投射
    const mouse = new THREE.Vector2(); // 投射向量
    // 归一化坐标
    mouse.x = (event.nativeEvent.offsetX / bgWidth) * 2 - 1;
    mouse.y = -((event.nativeEvent.offsetY / bgHeight) * 2 - 1);
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const objName = intersects[0].object.name;
      switch (objName) {
        case "lighter1Item":
          const intersectObject1 = scene.getObjectByName("lighter1Head");
          // 旋转轴
          const matrixStart1 = new THREE.Vector3(-93, 53, 0);
          const matrixDirect1 = new THREE.Vector3(0, 0, 1);
          if (intersectObject1 && !lighterOn1.current) {
            const rotateMatrix = getRotationMatrix(matrixStart1, matrixDirect1, Math.PI / 3);
            intersectObject1.applyMatrix4(rotateMatrix);
            lighterOn1.current = true;
            Tone.loaded().then(() => {
              player2.stop();
              player3.stop();
              player1.start();
            });
          } else if (intersectObject1 && lighterOn1.current) {
            const rotateMatrix = getRotationMatrix(matrixStart1, matrixDirect1, -Math.PI / 3);
            intersectObject1.applyMatrix4(rotateMatrix);
            lighterOn1.current = false;
            Tone.loaded().then(() => {
              player1.stop();
            });
          }
          renderDom();
          break;
        case "lighter2Item":
          const intersectObject2 = scene.getObjectByName("lighter2Head");
          // 旋转轴
          const matrixStart2 = new THREE.Vector3(-22, 53, 0);
          const matrixDirect2 = new THREE.Vector3(0, 0, 1);
          if (intersectObject2 && !lighterOn2.current) {
            const rotateMatrix = getRotationMatrix(matrixStart2, matrixDirect2, Math.PI / 3);
            intersectObject2.applyMatrix4(rotateMatrix);
            lighterOn2.current = true;
            Tone.loaded().then(() => {
              player1.stop();
              player3.stop();
              player2.start();
            });
          } else if (intersectObject2 && lighterOn2.current) {
            const rotateMatrix = getRotationMatrix(matrixStart2, matrixDirect2, -Math.PI / 3);
            intersectObject2.applyMatrix4(rotateMatrix);
            lighterOn2.current = false;
            Tone.loaded().then(() => {
              player2.stop();
            });
          }
          renderDom();
          break;
        case "lighter3Item":
          const intersectObject3 = scene.getObjectByName("lighter3Head");
          // 旋转轴
          const matrixStart3 = new THREE.Vector3(47, 53, 0);
          const matrixDirect3 = new THREE.Vector3(0, 0, 1);
          if (intersectObject3 && !lighterOn3.current) {
            const rotateMatrix = getRotationMatrix(matrixStart3, matrixDirect3, Math.PI / 3);
            intersectObject3.applyMatrix4(rotateMatrix);
            lighterOn3.current = true;
            Tone.loaded().then(() => {
              player1.stop();
              player2.stop();
              player3.start();
            });
          } else if (intersectObject3 && lighterOn3.current) {
            const rotateMatrix = getRotationMatrix(matrixStart3, matrixDirect3, -Math.PI / 3);
            intersectObject3.applyMatrix4(rotateMatrix);
            lighterOn3.current = false;
            Tone.loaded().then(() => {
              player3.stop();
            });
          }
          renderDom();
          break;
        default:
          break;
      }
    }
  };

  // 初始化
  initSetting();
  // 调色 website
  // https://ant-design.antgroup.com/docs/spec/colors-cn
  // 打火机 1
  initLighter("lighter1", 0x391085, 0x9254de, { x: -70, y: 0, z: 0 });
  // 打火机 2
  initLighter("lighter2", 0x003eb3, 0x4096ff, { x: 0, y: 0, z: 0 });
  // 打火机 3
  initLighter("lighter3", 0x141414, 0x1f1f1f, { x: 70, y: 0, z: 0 });

  // 更新节点
  useEffect(() => {
    modelRef.current?.appendChild(renderer.domElement);
    return () => {
      modelRef.current?.removeChild(renderer.domElement);
    };
  }, [modelRef, renderer]);

  return (
    <>
      <div style={{ width: bgWidth, height: bgHeight }}>
        <div ref={modelRef} onClick={handleClickModal}></div>
      </div>
    </>
  );
};

export default App;
