import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Truck, Heart } from 'lucide-react';

const ProductCarousels = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/constants/data.json');
        const jsonData = await response.json();
        const sortedCategories = [...jsonData.categories].sort((a, b) => a.order - b.order);
        setCategories(sortedCategories);
        setProducts(jsonData.products);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
})

  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  const scroll = (categoryId, direction) => {
    const container = document.getElementById(`carousel-${categoryId}`);
    const scrollAmount = isMobile ? 280 : 340;
    if (container) {
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatPrice = (priceObj) => {
    return `₹${(priceObj.amount / 100).toLocaleString('en-IN')}`;
  };

  const calculateDiscount = (price, listPrice) => {
    if (price.amount >= listPrice.amount) return null;
    return Math.round(((listPrice.amount - price.amount) / listPrice.amount) * 100);
  };

  const getColorStyle = (colorName) => {
    const colorMap = {
      'Black': '#000000',
      'Violet': '#8B5CF6',
      'Blue': '#3B82F6',
      'Pink': '#EC4899',
      'Obsidian': '#1F2937',
      'Hazel': '#92400E',
      'Iron Gray': '#6B7280',
      'Forest Green': '#047857'
    };
    return colorMap[colorName] || '#9CA3AF';
  };

  return (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-800">
            Shop by Category
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Discover amazing products across all categories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.id);
          
          if (categoryProducts.length === 0) return null;
          
          return (
            <div key={category.id} className="mb-10 sm:mb-16">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-1">{category.name}</h2>
                  <p className="text-xs sm:text-sm text-gray-600">{category.description}</p>
                </div>
                <a 
                  href={`#${category.slug}`} 
                  className="text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap ml-4 hover:underline transition-all"
                >
                  View All →
                </a>
              </div>

              <div className="relative group">
                {!isMobile && (
                  <button
                    onClick={() => scroll(category.id, 'left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-100 hover:scale-110 border border-gray-200"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-5 h-5 bg-black text-gray-200" />
                  </button>
                )}

                <div
                  id={`carousel-${category.id}`}
                  className="flex gap-3 sm:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {categoryProducts.map((product) => {
                    const discount = calculateDiscount(product.price, product.listPrice);
                    
                    return (
                      <div
                        key={product.id}
                        className="flex-shrink-0 w-64 sm:w-80 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 group/card snap-start hover:-translate-y-1"
                      >
                        <div className="relative rounded-t-2xl overflow-hidden bg-gray-100">
                          <img 
                            src={product.thumbnail} 
                            alt={product.name}
                            className="w-full h-44 sm:h-56 object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                          
                          <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-lg transition-all hover:scale-110">
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:fill-red-500 hover:text-red-500 transition-colors" />
                          </button>
                          
                          {product.badges && product.badges[0] && (
                            <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              {product.badges[0]}
                            </span>
                          )}
                          
                          {discount && (
                            <span className="absolute bottom-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                              {discount}% OFF
                            </span>
                          )}
                        </div>

                        <div className="p-4 sm:p-5">
                          <p className="text-xs text-gray-500 font-medium mb-1">{product.brand}</p>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-600 mb-3">{product.model}</p>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                              <span>{product.rating}</span>
                              <Star className="w-3 h-3 ml-1 fill-current" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {product.reviewsCount.toLocaleString()} reviews
                            </span>
                          </div>
                          <div className="mb-4">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {discount && (
                                <span className="text-sm text-gray-500 line-through">
                                  {formatPrice(product.listPrice)}
                                </span>
                              )}
                            </div>
                          </div>

                          {product.colors && product.colors.length > 0 && (
                            <div className="flex gap-2 mb-4">
                              {product.colors.map((color, idx) => (
                                <div
                                  key={idx}
                                  className="w-7 h-7 rounded-full border-3 border-gray-300 hover:border-blue-500 cursor-pointer transition-all hover:scale-110 shadow-sm"
                                  style={{ backgroundColor: getColorStyle(color) }}
                                  title={color}
                                />
                              ))}
                            </div>
                          )}
                          {product.shipping?.freeShipping && (
                            <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium mb-4 bg-green-50 px-3 py-2 rounded-lg">
                              <Truck className="w-4 h-4" />
                              <span>Free Shipping • {product.shipping.estDays} days</span>
                            </div>
                          )}

                          <button 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="text-sm sm:text-base">Add to Cart</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {!isMobile && (
                  <button
                    onClick={() => scroll(category.id, 'right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 border border-gray-200"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-200" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      `}</style>
    </div>
  );
}


export default ProductCarousels;