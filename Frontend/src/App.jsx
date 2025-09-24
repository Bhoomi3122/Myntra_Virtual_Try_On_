import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Prompt from './components/prompt';
import AvatarViewer from './components/avatar';
import AvatarCreation from './components/AvatarCreation';

const App = () => {
  const [screenSize, setScreenSize] = useState('large');
  const [currentModel, setCurrentModel] = useState("/model.glb"); // default avatar
  const [isAvatarCreationComplete, setIsAvatarCreationComplete] = useState(false);
  const [isTryOnClicked, setIsTryOnClicked] = useState(false);
  const [showTryOnButton, setShowTryOnButton] = useState(false);

  // Callback from AvatarCreation when processing is complete
  const handleProcessingComplete = () => {
    setCurrentModel("/model_new_stop.glb");
    setIsAvatarCreationComplete(true);
    setShowTryOnButton(true); // Show try-on button in sidebar
  };

  // Handle the try-on button click from sidebar
  const handleTryOnClick = () => {
    setIsTryOnClicked(true);
    setShowTryOnButton(false); // Hide try-on button after click
  };

  // Handle walk on ramp click from avatar viewer
  const handleRampClick = () => {
    console.log("Walk on ramp clicked");
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('small');
      } else if (width < 1024) {
        setScreenSize('medium');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50/20">
      {/* Main Layout Container */}
      <div className="relative h-full w-full flex">
        {/* Sidebar with try-on button */}
        <Sidebar
          onTryOnClick={handleTryOnClick}
          showTryOnButton={showTryOnButton}
        />

        {/* Avatar Creation */}
        <AvatarCreation onProcessingComplete={handleProcessingComplete} />

        {/* Main Content Area - Avatar in Center */}
        {/* Main Content Area - Avatar in Center */}
<div className="flex-1 relative">
  <div className="absolute inset-0 flex items-center justify-center p-2">
    {/* Avatar Container - Much Larger */}
    <div
      className={`${
        screenSize === 'small'
          ? 'w-full h-full max-h-[calc(100vh-4rem)]'
          : screenSize === 'medium'
          ? 'w-[600px] h-[700px]'
          : 'w-[700px] h-[800px]'
      } max-w-full max-h-full`}
    >
              {/* Pass currentModel to AvatarViewer */}
              <AvatarViewer
                screenSize={screenSize}
                modelPath={currentModel}
                isTryOnClicked={isTryOnClicked}
                onRampClick={handleRampClick}
                onProcessingComplete={() => setCurrentModel("/model_red.glb")}
              />

            </div>
          </div>
        </div>

        {/* Bottom Prompt */}
        <Prompt />
      </div>
    </div>
  );
};

export default App;
