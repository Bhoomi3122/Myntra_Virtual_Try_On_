import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import * as THREE from "three";
import { motion, AnimatePresence } from 'framer-motion';

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

      const desiredHeight = 3.2; // Increased from 2.3 to make avatar much larger
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

const AvatarViewer = ({ screenSize = "large", modelPath, onRampClick, isTryOnClicked, onProcessingComplete }) => {
  const [currentModel, setCurrentModel] = useState(modelPath);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showRampButton, setShowRampButton] = useState(false);
  const [hasCompletedProcessing, setHasCompletedProcessing] = useState(false);
  const [isShowingRamp, setIsShowingRamp] = useState(false);
  const processingSteps = [
    "Starting to change clothes...",
    "Wait, I am changing...",
    "Wait a bit more...",
    "It's almost done...",
    "Are you ready?"
  ];

  useEffect(() => {
    setCurrentModel(modelPath);
    if (modelPath === "/model_new_stop.glb") {
      setShowRampButton(true);
    }
  }, [modelPath]);

  // Handle try-on processing
  useEffect(() => {
    if (isTryOnClicked && !hasCompletedProcessing) {
      setIsProcessing(true);
      setShowRampButton(false);
      setCurrentModel(""); // Hide current model during processing

      // Start dummy processing
      let step = 0;
      const interval = setInterval(() => {
        setProcessingStep(step);
        step++;
        if (step >= processingSteps.length) {
          clearInterval(interval);
          setIsProcessing(false);
          setHasCompletedProcessing(true);
          setShowRampButton(true);
          onProcessingComplete && onProcessingComplete(); // Notify parent to change to model_red.glb
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTryOnClicked, hasCompletedProcessing, onProcessingComplete]);

  const getCameraDistance = () => {
    switch (screenSize) {
      case "small":
        return 2.5;
      case "medium":
        return 2.8;
      default:
        return 3.2;
    }
  };
  const distance = getCameraDistance();

  const handleShowOnRampClick = () => {
    if (isShowingRamp) {
      // Hide ramp - go back to static model
      setCurrentModel("/model_red.glb");
      setIsShowingRamp(false);
    } else {
      // Show ramp - go to animation model
      setCurrentModel("/model_red_animation.glb");
      setIsShowingRamp(true);
    }
    onRampClick && onRampClick();
  };

  const ProcessingAnimation = () => (
    <div className="flex flex-col items-center py-8">
      {/* Enhanced Spinner replacing video */}
      <div className="relative mb-6">
        <div className="w-24 h-24 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 w-20 h-20 border-4 border-gray-100 border-r-purple-500 rounded-full animate-spin animation-reverse"></div>
        <div className="absolute inset-4 w-16 h-16 border-4 border-gray-50 border-b-pink-400 rounded-full animate-spin"></div>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Processing Text */}
      <motion.p
        key={processingStep}
        className="text-sm font-medium text-gray-700 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        {processingSteps[processingStep]}
      </motion.p>

      {/* Fashion Elements */}
      <div className="flex items-center gap-4 mt-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
        </motion.div>
        <span className="text-xs text-gray-500">Changing your avatar</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-4 h-4 bg-red-400 rounded-full"></div>
        </motion.div>
      </div>

      {/* Step Counter */}
      <div className="mt-4 text-xs text-gray-400">
        Step {processingStep + 1} of {processingSteps.length}
      </div>
    </div>
  );

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
      {/* Ramp Button */}
      {/* Enhanced Ramp Button */}
      {showRampButton && !isProcessing && (
        <motion.button
          onClick={handleShowOnRampClick}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 25px rgba(255, 63, 108, 0.4), 0 4px 15px rgba(164, 92, 254, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 z-50"
          style={{
            padding: "6px 14px",
            borderRadius: "25px",
            background: isShowingRamp
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              : "linear-gradient(135deg, #FF57A6 0%, #A45CFE 100%)",
            color: "#fff",
            fontWeight: "600",
            fontSize: "0.75rem",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            boxShadow: isShowingRamp
              ? "0 4px 15px rgba(102, 126, 234, 0.3), 0 2px 8px rgba(118, 75, 162, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "0 4px 15px rgba(255, 87, 166, 0.3), 0 2px 8px rgba(164, 92, 254, 0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span className="relative z-10">
            {isShowingRamp ? "Hide Ramp" : "Show Ramp"}
          </span>
          <div
            className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
            }}
          />
        </motion.button>
      )}

      {/* Processing Animation */}
      {isProcessing && <ProcessingAnimation />}

      {/* Avatar Canvas - Only show if not processing and model exists */}
      {!isProcessing && currentModel && (
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 1.3, distance], fov: screenSize === "small" ? 45 : 40 }}
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
      )}
    </div>
  );
};

export default AvatarViewer;
