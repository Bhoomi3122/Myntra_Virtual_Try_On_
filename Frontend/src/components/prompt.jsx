import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';

const MyntraPromptComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const textareaRef = useRef(null);

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = screenSize === 'mobile' ? 60 : 70;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [inputValue, screenSize]);

  // Demo fetch call
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    setIsLoading(true);
    
    // Demo API call - replace with your actual API
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      console.log('Message sent:', inputValue);
      
      // Clear input after successful send
      setInputValue('');
      setIsFocused(false);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isButtonActive = inputValue.trim().length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50/20 relative">
      

      {/* Fixed Bottom Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg">
        <div className={`max-w-full mx-auto ${
          screenSize === 'mobile' ? 'p-3' : 'p-3'
        }`}>
          {/* Quick Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${screenSize === 'mobile' ? 'mb-2' : 'mb-3'}`}
          >
            <div className={`flex flex-wrap gap-2 ${
              screenSize === 'mobile' ? 'text-xs' : 'text-sm'
            }`}>
              {[
                "What colors go with navy?",
                "Summer work outfits",
                "Style a denim jacket?"
              ].map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputValue(suggestion)}
                  disabled={isLoading}
                  className={`${
                    screenSize === 'mobile' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs'
                  } bg-pink-50 text-pink-600 rounded-full border border-pink-200 hover:bg-pink-100 transition-colors duration-200 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Input Area */}
          <div className={`relative bg-gray-50 rounded-xl border-2 transition-all duration-200 ${
            isFocused ? 'border-pink-300 bg-white shadow-sm' : 'border-gray-200'
          }`}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about fashion trends, styling tips, color combinations..."
              disabled={isLoading}
              className={`w-full bg-transparent border-none outline-none resize-none text-gray-800 placeholder-gray-500 ${
                screenSize === 'mobile' 
                  ? 'p-2.5 pr-10 text-xs min-h-[28px]' 
                  : 'p-3 pr-12 text-sm min-h-[36px]'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              rows={1}
            />

            {/* Send Button */}
            <motion.button
              whileHover={isButtonActive ? { scale: 1.05 } : {}}
              whileTap={isButtonActive ? { scale: 0.95 } : {}}
              onClick={handleSend}
              disabled={!isButtonActive}
              className={`absolute ${
                screenSize === 'mobile' 
                  ? 'right-2 top-2 w-7 h-7' 
                  : 'right-2.5 top-2.5 w-8 h-8'
              } rounded-lg transition-all duration-200 flex items-center justify-center ${
                isButtonActive
                  ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-md cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, rotate: 0 }}
                    animate={{ opacity: 1, rotate: 360 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className={`${
                      screenSize === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'
                    } animate-spin`} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Send className={`${
                      screenSize === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'
                    }`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Helper Text */}
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={`${screenSize === 'mobile' ? 'mt-1.5' : 'mt-2'} flex items-center justify-between ml-2`}
            >
              <span className={`text-gray-400 ${
                screenSize === 'mobile' ? 'text-xs' : 'text-xs'
              }`}>
                Press Enter to send
              </span>
              
              {/* Character counter */}
              {inputValue.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`text-gray-400 ${
                    screenSize === 'mobile' ? 'text-xs' : 'text-sm'
                  } ${inputValue.length > 400 ? 'text-orange-500' : ''} ${
                    inputValue.length > 480 ? 'text-red-500' : ''
                  }`}
                >
                  {inputValue.length}/500
                </motion.span>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyntraPromptComponent;