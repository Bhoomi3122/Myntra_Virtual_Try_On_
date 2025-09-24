import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shirt, Heart, ShoppingBag, Search, Grid, List } from 'lucide-react';

const sampleProducts = [
  { id: 1, name: "Red Summer Dress", category: "Dress", image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSLnZa4uG4q-nazDSbxWNo2sVCOSP5L12Eu_J8YsGVHfhngM0XVCqJrQPCH2Eo03gwqMYwTXv3qYUsRuEaN2_D087ABY9BM9QqtLj9N71yFy4x4JcZMEZWfcA&usqp=CAc" },
  { id: 2, name: "Casual Blue Jeans", category: "Jeans", image: "https://assets.myntassets.com/h_1440,q_75,w_1080/v1/assets/images/29742550/2024/5/23/7f484c2b-a6bd-45e8-9b3d-9e3b55dead411716462342911FREAKINSWomenWideLegHigh-RiseMildlyDistressedLightFadeJeans1.jpg", brand: "Levi's" },
  { id: 3, name: "White Cotton Shirt", category: "Shirt", image: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcScJ7wiclSPu9c2_s7oa0LVhRYw3PoW2--6Oxv6Dl2k_rvo4fZ2YUry2pTAbUMtQPaMIWlwsqnI7D1_V1lvbhwhO1ateHZPIJmA8qdc5zrD1Ri2XlvOTCXoeQ2k&usqp=CAc", brand: "H&M" },
  { id: 4, name: "Black Leather Jacket", category: "Jacket", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREw6a0gW5ZkphKTjncNvveHd27rWR84-dilQ&s", brand: "Forever21" },
  { id: 5, name: "Floral Print Blouse", category: "Jeans", image: "data:image/jpeg;base64,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", brand: "Mango" },
  { id: 6, name: "Denim Skirt", category: "Skirt", image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2025/APRIL/23/DduXGgpS_4ce1e2ad73174bbfbf01211e571d0201.jpg", brand: "Zara" },
  { id: 7, name: "Striped Sweater", category: "Sweater", image: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/9479111/2019/9/28/58258e36-dd85-48dc-ac7d-8b8aa220ce421569647989170-Roadster-Women-Sweaters-7751569647987823-1.jpg", brand: "Gap" },
  { id: 8, name: "Formal Blazer", category: "Blazer", image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/27030652/2024/3/5/fedbde65-8ba8-46f6-b1d2-fcbb8503b6411709637891801JeansNEXTWomenTrousersNEXTMenJeansNEXTWomenDressesNEXTWomenS1.jpg", brand: "Arrow" },
  { id: 9, name: "Summer Top", category: "Top", image: "https://assets.myntassets.com/w_412,q_30,dpr_3,fl_progressive,f_webp/assets/images/2024/OCTOBER/14/6br8OwTp_18a8a97498964a04adca653695f5b409.jpg", brand: "Forever21" },
  { id: 10, name: "Evening Gown", category: "Dress", image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRAap5b0TAP9nlb7iHhDelM-GuXRTR4-WstRII9fBZwprVIHPYsYPHZtfL9lzu-wJzjlnWoTXb-AYG0GqK0ZYU-9skHHgFzuMMidkrfUWVr35K4yCq6JSlPuQ&usqp=CAc", brand: "Zara" }
];



const MyntraWardrobe = () => {
  const [products] = useState(sampleProducts);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenSize, setScreenSize] = useState('large');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const scrollRef = useRef(null);
  const sidebarRef = useRef(null);
  const categories = ['All', 'Dress', 'Jeans', 'Shirt', 'Jacket', 'Blouse', 'Skirt', 'Sweater', 'Blazer', 'Top'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let size = 'large';
      if (width < 640) size = 'small';
      else if (width < 1024) size = 'medium';
      setScreenSize(size);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  const handleItemClick = (item) => {
    const scrollTop = scrollRef.current?.scrollTop;
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) return prev.filter(selected => selected.id !== item.id);
      return [...prev, item];
    });
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollTop;
    });
  };

  const isItemSelected = (itemId) => selectedItems.some(item => item.id === itemId);

  const getDynamicSidebarWidth = () => {
    if (screenSize === 'small') return '85vw';
    if (screenSize === 'medium') return '65vw';
    return '350px';
  };

  const ProductCard = ({ product }) => (
    <motion.div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('product', JSON.stringify(product))}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleItemClick(product)}
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${isItemSelected(product.id) ? 'ring-2 ring-[#ff3f6c] shadow-xl shadow-pink-200/50' : 'shadow-md hover:shadow-lg'} bg-white`}
    >
      <AnimatePresence>
        {isItemSelected(product.id) && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            className="absolute top-1 right-1 z-20 w-4 h-4 bg-gradient-to-r from-[#ff3f6c] to-[#ff6b9d] rounded-full flex items-center justify-center shadow-lg"
          >
            <Heart className="w-2.5 h-2.5 text-white fill-current" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full object-cover transition-transform duration-300 hover:scale-110 ${screenSize === 'small' ? 'h-24' : 'h-28'}`} 
          loading="lazy" 
        />
      </div>
      <div className="p-2 space-y-0.5">
        <h3 className="text-xs font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 font-medium">{product.brand}</p>
      </div>
    </motion.div>
  );

  const SidebarContent = () => (
    <div className="h-full bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 backdrop-blur-xl flex flex-col border-r border-white/20 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 50%, rgba(253,242,248,0.85) 100%)"
      }}
    >
      <div className="p-4 border-b border-white/30 bg-gradient-to-r from-white/50 to-purple-50/30 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[#ff3f6c] to-[#ff6b9d] rounded-lg flex items-center justify-center shadow-lg">
            <Shirt className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold bg-gradient-to-r from-[#ff3f6c] to-[#ff6b9d] bg-clip-text text-transparent">My Wardrobe</h2>
            <p className="text-xs text-gray-500">{filteredProducts.length} items</p>
          </div>
        </div>
        
        {/* Remove All Button */}
        {selectedItems.length > 0 && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedItems([])}
            className="px-3 py-1.5 bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white text-xs font-medium rounded-lg shadow-md transition-all duration-200"
          >
            Clear All
          </motion.button>
        )}
      </div>
      <div className="p-3 space-y-3 border-b border-white/30 bg-gradient-to-r from-white/30 to-pink-50/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-white/40 bg-white/70 backdrop-blur-sm rounded-lg focus:ring-2 focus:ring-[#ff3f6c] focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 6).map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-2 py-1 text-xs font-medium rounded-full transition-all ${selectedCategory === category ? 'bg-gradient-to-r from-[#ff3f6c] to-[#ff6b9d] text-white shadow-md' : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80 border border-white/40'}`}
            >
              {category}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#ff3f6c]/20 text-[#ff3f6c]' : 'bg-white/60 backdrop-blur-sm text-gray-500 border border-white/40'}`}><Grid className="w-3 h-3" /></motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#ff3f6c]/20 text-[#ff3f6c]' : 'bg-white/60 backdrop-blur-sm text-gray-500 border border-white/40'}`}><List className="w-3 h-3" /></motion.button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-auto p-3">
        <motion.div layout className={`grid gap-2 ${screenSize === 'small' ? 'grid-cols-2' : viewMode === 'list' ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 25 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">No items found</p>
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 63, 108, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)
        `
      }}
    >

      {/* Hamburger */}
      <motion.button 
        whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255, 63, 108, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-r from-[#ff3f6c] to-[#ff6b9d] text-white rounded-xl shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
          setIsSidebarOpen(prev => !prev);
        }}
      >
        <Shirt className="w-4 h-4" />
      </motion.button>

      {/* Cool Selected Items Bar */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4"
          >
            {/* Animated Background with Multiple Layers */}
            <div className="absolute inset-0 rounded-2xl opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff3f6c]/80 to-purple-500/80 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl backdrop-blur-xl"></div>
            
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400 via-pink-600 to-pink-400 p-[1px]">
              <div className="w-full h-full bg-transparent rounded-2xl"></div>
            </div>
            
            {/* Main Content */}
            <motion.div 
              className="relative bg-white/90 backdrop-blur-xl rounded-2xl px-3 py-1 shadow-2xl border border-white/20"
              style={{
                background: "pink"
              }}
            >
              <div className="flex items-center justify-between gap-4">
                {/* Item Preview with Enhanced Styling */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    <AnimatePresence mode="popLayout">
                      {selectedItems.slice(0, 6).map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ scale: 0, opacity: 0, y: 20 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0, opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-full border-3 border-white shadow-lg ring-2 ring-pink-200/50"
                          />
                
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {selectedItems.length > 6 && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-white border-3 border-white shadow-lg ring-2 ring-slate-200/50"
                      >
                        +{selectedItems.length - 6}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Try On Button with Enhanced Styling */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 8px 32px rgba(255, 63, 108, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-pink-500 hover:from-purple-500 hover:to-[#ff3f6c] text-white px-6 py-2 rounded-xl font-semibold text-sm shadow-xl transition-all duration-300 flex items-center gap-2 border border-white/20"
                >
                  <ShoppingBag className="w-3 h-3" />
                  Try On
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (screenSize === 'small' || screenSize === 'medium') && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full z-40 shadow-2xl"
            style={{ width: getDynamicSidebarWidth() }}
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyntraWardrobe;