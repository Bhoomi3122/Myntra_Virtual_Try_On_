import { useState, useEffect } from 'react';
import Sidebar from './components/sidebar';
import Prompt from './components/prompt';
import AvatarViewer from './components/avatar';
import AvatarCreation from './components/AvatarCreation';

const App = () => {
  const [screenSize, setScreenSize] = useState('large');
  const [currentModel, setCurrentModel] = useState("/model.glb"); // default avatar

  // Handle screen size detection
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

  // Callback from AvatarCreation when processing is complete
  const handleProcessingComplete = () => {
    setCurrentModel("/model_new.glb"); // switch to the new avatar model
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50/20">
      {/* Main Layout Container */}
      <div className="relative h-full w-full flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Avatar Creation */}
        <AvatarCreation onProcessingComplete={handleProcessingComplete} />

        {/* Main Content Area - Avatar in Center */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-center justify-center p-4 pb-32">
            {/* Avatar Container */}
            <div
              className={`${
                screenSize === 'small'
                  ? 'w-full h-full max-h-[calc(100vh-10rem)]'
                  : screenSize === 'medium'
                  ? 'w-96 h-[500px]'
                  : 'w-[450px] h-[600px]'
              } max-w-full max-h-full`}
            >
              {/* Pass currentModel to AvatarViewer */}
              <AvatarViewer screenSize={screenSize} modelPath={currentModel} />
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
