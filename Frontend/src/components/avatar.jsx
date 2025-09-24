import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import * as THREE from "three";

// Avatar component
const Avatar = ({ modelPath, scale = 1.2 }) => {
  const { scene, animations } = useGLTF(modelPath);
  const { actions, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    if (scene) {
      const box = new Box3().setFromObject(scene);
      const center = new Vector3();
      box.getCenter(center);
      const size = new Vector3();
      box.getSize(size);

      scene.position.x -= center.x;
      scene.position.z -= center.z;
      scene.position.y = -center.y + size.y * 0.5;

      const desiredHeight = 2.3;
      const scaleFactor = desiredHeight / size.y;
      scene.scale.set(scaleFactor * scale, scaleFactor * scale, scaleFactor * scale);

      scene.rotation.y = 0;

      if (animations.length > 0) {
        const firstAction = actions[Object.keys(actions)[0]];
        firstAction.play();
        firstAction.setLoop(THREE.LoopRepeat, Infinity);
      }
    }

    return () => mixer?.stopAllAction();
  }, [scene, animations, actions, mixer, scale]);

  return <primitive object={scene} />;
};

// Camera & OrbitControls
const FixedCameraControls = () => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1.3, 4);
    camera.lookAt(0, 1.0, 0);
  }, [camera]);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 2}
      maxPolarAngle={Math.PI / 2}
      minAzimuthAngle={-Math.PI}
      maxAzimuthAngle={Math.PI}
      enableDamping={true}
      dampingFactor={0.05}
      target={[0, 1.3, 0]}
    />
  );
};

// Main AvatarViewer component
const AvatarViewer = ({ screenSize = "large", modelPath }) => {
  const [currentModel, setCurrentModel] = useState(modelPath);

  useEffect(() => {
    setCurrentModel(modelPath);
  }, [modelPath]);

  const getCameraDistance = () => {
    switch (screenSize) {
      case "small":
        return 3;
      case "medium":
        return 3.5;
      default:
        return 4;
    }
  };
  const distance = getCameraDistance();

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        height: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Stop Animation Button */}
      {currentModel === "/model_new.glb" && (
        <button
          onClick={() => setCurrentModel("/model_new_stop.glb")}
          style={{
            position: "absolute",
            top: "12px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: "linear-gradient(90deg, #f472b6, #a78bfa)",
            color: "#fff",
            fontWeight: "bold",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            border: "none",
            cursor: "pointer",
            fontSize: "0.85rem",
            zIndex: 50,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
          }}
        >
          Stop Animation
        </button>
      )}

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.3, distance], fov: screenSize === "small" ? 50 : 45 }}
        style={{ width: "100%", height: "100%", borderRadius: "20px", overflow: "hidden" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.8} color="#ffffff" />
        <directionalLight
          position={[3, 5, 3]}
          intensity={2}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-3, 3, 2]} intensity={1} color="#f0f8ff" />
        <directionalLight position={[0, 2, -3]} intensity={0.8} color="#fff5ee" />
        <directionalLight position={[0, -2, 2]} intensity={0.4} color="#ffffff" />

        {/* Avatar */}
        <Avatar modelPath={currentModel} />

        {/* Camera controls */}
        <FixedCameraControls />
      </Canvas>
    </div>
  );
};

export default AvatarViewer;
