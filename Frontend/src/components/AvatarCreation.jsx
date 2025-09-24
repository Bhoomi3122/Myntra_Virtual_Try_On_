import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, User, X, Camera, Check, RotateCcw, RotateCw, Sparkles, Heart } from 'lucide-react';

const ThreePhotoUpload = ({ onProcessingComplete }) => { 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [photos, setPhotos] = useState({
    front: null,
    left: null,
    right: null
  });
  const [dragActive, setDragActive] = useState({
    front: false,
    left: false,
    right: false
  });

  const photoTypes = [
    { key: 'front', label: 'Front Face', icon: User, description: 'Look straight' },
    { key: 'left', label: 'Left Profile', icon: RotateCcw, description: 'Turn 45° left' },
    { key: 'right', label: 'Right Profile', icon: RotateCw, description: 'Turn 45° right' }
  ];

const processingSteps = [
  "Myntra + Google Cloud = AI room visuals magic!",
  "'It's You 2.0' celebrates your style & confidence!",
  "Sell ethnic wear with zero commission on Myntra!",
  "Glamstream: Watch celebs, shop their style instantly!",
  "M-Now delivers your fashion picks in 30 mins!",
  "Big Fashion Festival: Millions of styles, endless fun!"
];


  const handleFileUpload = (file, photoType) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotos(prev => {
        const updatedPhotos = {
          ...prev,
          [photoType]: {
            file: file,
            preview: e.target.result,
            name: file.name
          }
        };

        return updatedPhotos;
      });
    };
    reader.readAsDataURL(file);
  }
};


  const handleDrag = (e, photoType) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [photoType]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [photoType]: false }));
    }
  };

  const handleDrop = (e, photoType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [photoType]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0], photoType);
    }
  };

  const handleFileSelect = (e, photoType) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0], photoType);
    }
  };

  const removePhoto = (photoType) => {
    setPhotos(prev => ({
      ...prev,
      [photoType]: null
    }));
  };

  const allPhotosUploaded = () => {
    return photos.front && photos.left && photos.right;
  };

  const handleProcess = async () => {
  if (!allPhotosUploaded()) return;

  setIsProcessing(true);
  setProcessingStep(0);

  // Simulate processing steps with delays
  for (let i = 0; i < processingSteps.length; i++) {
    setProcessingStep(i);
    await new Promise(resolve => setTimeout(resolve, 4500));
  }

  console.log('Processing photos:', {
    front: photos.front.name,
    left: photos.left.name,
    right: photos.right.name
  });

  setIsProcessing(false);
  setIsModalOpen(false);

  // Notify App that processing is complete
  onProcessingComplete && onProcessingComplete();

  // Reset photos after processing
  const resetPhotos = { front: null, left: null, right: null };
  setPhotos(resetPhotos);
};


  const closeModal = () => {
    if (!isProcessing) {
      setIsModalOpen(false);
      setPhotos({ front: null, left: null, right: null });
    }
  };


  const ProcessingAnimation = () => (
    <div className="flex flex-col items-center py-8">
      <video
        src="/model-is-beautiful..mp4" // replace with your actual file name
        autoPlay
        loop
        muted
        playsInline
        className="w-68 h-68 mx-auto mb-6 object-contain rounded-lg shadow-lg"
      />

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
          <Sparkles className="w-4 h-4 text-pink-500" />
        </motion.div>
        <span className="text-xs text-gray-500">Creating your fashion avatar</span>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Heart className="w-4 h-4 text-red-400" />
        </motion.div>
      </div>

      {/* Step Counter */}
      <div className="mt-4 text-xs text-gray-400">
        Step {processingStep + 1} of {processingSteps.length}
      </div>
    </div>
  );

  const PhotoSlot = ({ type, data }) => {
    const photoInfo = photoTypes.find(p => p.key === type);
    const IconComponent = photoInfo.icon;

    return (
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <IconComponent className="w-3 h-3 text-pink-600" />
          <span className="text-xs font-medium text-gray-700">{photoInfo.label}</span>
          {photos[type] && (
            <Check className="w-3 h-3 text-green-600" />
          )}
        </div>

        <div
          className={`relative border-2 border-dashed rounded-lg overflow-hidden transition-all duration-200 ${dragActive[type]
              ? 'border-pink-500 bg-pink-50'
              : photos[type]
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-pink-400 hover:bg-gray-50'
            } ${isProcessing ? 'pointer-events-none opacity-60' : 'cursor-pointer'}`}
          style={{ height: '120px' }}
          onDragEnter={(e) => handleDrag(e, type)}
          onDragLeave={(e) => handleDrag(e, type)}
          onDragOver={(e) => handleDrag(e, type)}
          onDrop={(e) => handleDrop(e, type)}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e, type)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isProcessing}
          />

          {photos[type] ? (
            <div className="relative w-full h-full">
              <img
                src={photos[type].preview}
                alt={`${type} face`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(type);
                  }}
                  className="p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                  disabled={isProcessing}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-2">
              <div className="w-7 h-7 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                <Camera className="w-3.5 h-3.5 text-pink-600" />
              </div>
              <p className="text-xs font-medium text-gray-700 text-center mb-1">
                {dragActive[type] ? 'Drop here' : 'Upload'}
              </p>
              <p className="text-xs text-gray-500 text-center leading-tight">
                {photoInfo.description}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Fixed Avatar Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed top-4 right-4 z-40 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <User className="w-4 h-4" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Background Overlay */}
            <motion.div
              className="absolute inset-0 backdrop-blur-sm bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Create Fashion Avatar
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Upload three angles for your perfect 3D model
                  </p>
                </div>

                {!isProcessing && (
                  <button
                    onClick={closeModal}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                {!isProcessing ? (
                  <div className="space-y-5">
                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {photoTypes.map((type, index) => (
                        <div key={type.key} className="flex items-center">
                          <div className={`w-2 h-2 rounded-full transition-colors ${photos[type.key] ? 'bg-pink-600' : 'bg-gray-300'
                            }`} />
                          {index < photoTypes.length - 1 && (
                            <div className={`w-8 h-0.5 transition-colors ${photos[type.key] ? 'bg-pink-600' : 'bg-gray-300'
                              }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Horizontal Photo Upload Slots */}
                    <div className="flex gap-3">
                      {photoTypes.map((type) => (
                        <PhotoSlot key={type.key} type={type.key} data={photos[type.key]} />
                      ))}
                    </div>

                    {/* Upload Instructions */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-3 border border-pink-100">
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Good lighting, no shadows</li>
                        <li>• Same distance from camera</li>
                        <li>• Neutral expression</li>
                        <li>• Clear face visibility (PNG/JPG, max 5MB)</li>
                      </ul>
                    </div>

                    {/* Process Button */}
                    <motion.button
                      onClick={handleProcess}
                      disabled={!allPhotosUploaded()}
                      className={`w-full text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 ${allPhotosUploaded()
                          ? 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      whileHover={allPhotosUploaded() ? { scale: 1.02 } : {}}
                      whileTap={allPhotosUploaded() ? { scale: 0.98 } : {}}
                    >
                      {allPhotosUploaded() ? (
                        <span className="flex items-center justify-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Create My Avatar
                        </span>
                      ) : (
                        `Upload ${3 - Object.values(photos).filter(Boolean).length} more photo${3 - Object.values(photos).filter(Boolean).length !== 1 ? 's' : ''}`
                      )}
                    </motion.button>
                  </div>
                ) : (
                  <ProcessingAnimation />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThreePhotoUpload;