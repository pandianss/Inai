import React, { useState } from 'react';
import { getTranslation } from '../utils/translations';
import '../styles/design-system.css';

/**
 * CommerceHub Component
 * ONDC integration with Indigo & Marigold theme
 * Features: Search, merchant listings, chat-to-pay
 */

const CommerceHub = ({ userData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);

  // Mock user data fallback
  const user = userData || { language: 'English' };
  const t = getTranslation(user.language);

  // Minimalist SVG Icons
  const Icons = {
    All: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3zM9 9h6v6H9z" />
      </svg>
    ),
    Grocery: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    Food: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 10c0-1.5-3-3-3-3s-3 1.5-3 3" />
      </svg>
    ),
    Transport: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
        <circle cx="6.5" cy="16.5" r="2.5" />
        <circle cx="16.5" cy="16.5" r="2.5" />
      </svg>
    ),
    Services: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    Medicine: () => (
      <svg className="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 5h-2M5 19H3m14-8v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m10 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2m-2-2h14" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6v4H9z" />
      </svg>
    )
  };

  const categories = [
    { id: 'all', name: t.commerce.categories.all, icon: <Icons.All /> },
    { id: 'grocery', name: t.commerce.categories.grocery, icon: <Icons.Grocery /> },
    { id: 'food', name: t.commerce.categories.food, icon: <Icons.Food /> },
    { id: 'transport', name: t.commerce.categories.transport, icon: <Icons.Transport /> },
    { id: 'services', name: t.commerce.categories.services, icon: <Icons.Services /> },
    { id: 'medicine', name: t.commerce.categories.medicine, icon: <Icons.Medicine /> }
  ];

  const merchants = [
    {
      id: 1,
      name: 'Raj General Store',
      category: 'grocery',
      distance: '0.5 km',
      rating: 4.5,
      verified: true,
      items: [
        { id: 101, name: 'Rice (Basmati)', price: 45, unit: 'kg' },
        { id: 102, name: 'Lentils (Toor Dal)', price: 120, unit: 'kg' },
        { id: 103, name: 'Wheat Flour (Atta)', price: 35, unit: 'kg' }
      ]
    },
    {
      id: 2,
      name: 'Sharma Tiffin Center',
      category: 'food',
      distance: '1.2 km',
      rating: 4.8,
      verified: true,
      items: [
        { id: 201, name: 'Veg Thali', price: 80, unit: 'plate' },
        { id: 202, name: 'Roti Sabzi', price: 60, unit: 'plate' },
        { id: 203, name: 'Paratha', price: 40, unit: '2 pcs' }
      ]
    },
    {
      id: 3,
      name: 'City Auto Service',
      category: 'transport',
      distance: '0.8 km',
      rating: 4.3,
      verified: false,
      items: [
        { id: 301, name: 'Auto Booking', price: 50, unit: 'base fare' },
        { id: 302, name: 'Shared Auto', price: 20, unit: 'per person' }
      ]
    },
    {
      id: 4,
      name: 'Medicare Pharmacy',
      category: 'medicine',
      distance: '0.3 km',
      rating: 4.7,
      verified: true,
      items: [
        { id: 401, name: 'Paracetamol', price: 15, unit: '10 tablets' },
        { id: 402, name: 'Vitamin C', price: 120, unit: 'bottle' }
      ]
    }
  ];

  const filteredMerchants = merchants.filter(merchant => {
    const matchesCategory = selectedCategory === 'all' || merchant.category === selectedCategory;
    const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (merchant, item) => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    setCart([...cart, { ...item, merchantName: merchant.name, merchantId: merchant.id }]);
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handlePayNow = () => {
    // In production, this would trigger UPI Intent
    alert(`UPI Payment initiated for ₹${getTotalAmount()}`);
  };

  return (
    <div className="commerce-container">
      <div className="background-rangoli rangoli-pattern"></div>

      {/* Commerce Header */}
      <header className="commerce-header glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-devanagari" style={{ color: 'white', margin: 0 }}>Bazaar</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--font-size-sm)', margin: '4px 0 0 0' }}>
              Powered by ONDC
            </p>
          </div>
          <div className="cart-badge-container">
            <button className="icon-btn haptic-click">
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="badge badge-alert cart-count">{cart.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar-container glass-panel">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input text-devanagari"
            placeholder={t.commerce.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="categories-scroll-container">
          <div className="categories-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-chip haptic-click ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                <span className="text-devanagari">{category.name}</span>
              </button>
            ))}
          </div>
        </div></header>

      {/* Merchants List */}
      <div className="merchants-container">
        {filteredMerchants.map(merchant => (
          <div key={merchant.id} className="merchant-card glass-panel-light">
            <div className="merchant-header">
              <div>
                <h3 className="text-devanagari merchant-name">
                  {merchant.name}
                  {merchant.verified && (
                    <span className="badge badge-verified" style={{ marginLeft: '8px' }}>
                      ✓ Verified
                    </span>
                  )}
                </h3>
                <div className="merchant-meta">
                  <span className="rating">⭐ {merchant.rating}</span>
                  <span className="distance">📍 {merchant.distance}</span>
                </div>
              </div>
            </div>

            <div className="items-list">
              {merchant.items.map(item => (
                <div key={item.id} className="item-row">
                  <div className="item-info">
                    <span className="item-name text-devanagari">{item.name}</span>
                    <span className="item-unit">{item.unit}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">₹{item.price}</span>
                    <button
                      className="btn-add haptic-click"
                      onClick={() => handleAddToCart(merchant, item)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary (Fixed Bottom) */}
      {cart.length > 0 && (
        <div className="cart-summary glass-panel">
          <div className="cart-summary-content">
            <div>
              <p className="cart-items-count text-devanagari">
                {cart.length} आइटम
              </p>
              <p className="cart-total">₹{getTotalAmount()}</p>
            </div>
            <button className="btn btn-primary haptic-click" onClick={handlePayNow}>
              <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              Pay Now (UPI)
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .commerce-container {
          min-height: 100vh;
          max-width: 100vw;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-x: hidden;
        }

        .commerce-header {
          padding: var(--space-md) var(--space-lg);
          background: var(--gradient-primary);
          color: white;
          z-index: 10;
          width: 100%;
          box-sizing: border-box;
        }

        .cart-badge-container {
          position: relative;
        }

        .cart-count {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .search-container {
          position: relative;
          margin-top: var(--space-md);
          width: 100%;
          max-width: 100%;
        }

        .search-icon {
          position: absolute;
          left: var(--space-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--primary-dark);
          opacity: 0.5;
        }

        .search-input {
          padding-left: 48px;
          width: 100%;
          box-sizing: border-box;
        }

        .categories-scroll {
          display: flex;
          gap: var(--space-sm);
          overflow-x: auto;
          margin-top: var(--space-lg);
          padding-bottom: var(--space-sm);
          -webkit-overflow-scrolling: touch;
        }

        .categories-scroll::-webkit-scrollbar {
          height: 4px;
        }

        .categories-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }

        .category-pill {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 6px 16px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          color: rgba(255, 255, 255, 0.9);
          font-size: var(--font-size-sm);
          white-space: nowrap;
          transition: all 0.2s ease;
          height: 36px;
          box-sizing: border-box;
        }

        .category-pill:active {
          transform: scale(0.95);
        }

        .category-pill-active {
          background: var(--accent-marigold);
          border-color: var(--accent-marigold);
          color: white;
          box-shadow: var(--shadow-sm);
        }

        .category-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .merchants-container {
          flex: 1;
          padding: var(--space-lg);
          overflow-y: auto;
          padding-bottom: 120px;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .merchant-card {
          margin-bottom: var(--space-xl);
          padding: var(--space-lg);
          animation: fade-in 0.3s ease-out;
          width: 100%;
          box-sizing: border-box;
        }

        .merchant-header {
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-md);
          border-bottom: 1px solid rgba(26, 35, 126, 0.1);
        }

        .merchant-name {
          margin: 0 0 var(--space-xs) 0;
          color: var(--primary-dark);
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }

        .merchant-meta {
          display: flex;
          gap: var(--space-md);
          font-size: var(--font-size-sm);
          color: rgba(26, 35, 126, 0.6);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          background: rgba(255, 255, 255, 0.5);
          border-radius: var(--radius-md);
          min-height: 60px;
        }

        .item-info {
          display: flex;
          flex-direction: column;
        }

        .item-name {
          font-weight: 500;
          color: var(--primary-dark);
        }

        .item-unit {
          font-size: var(--font-size-xs);
          color: rgba(26, 35, 126, 0.6);
        }

        .item-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .item-price {
          font-weight: 600;
          color: var(--accent-marigold);
          font-size: var(--font-size-lg);
        }

        .search-bar-container {
            margin: 0 var(--space-lg);
            padding: 0 var(--space-md);
            height: 48px;
            display: flex;
            align-items: center;
            border-radius: var(--radius-full);
            background: rgba(255,255,255,0.9);
            box-shadow: var(--shadow-sm);
        }

        .categories-scroll-container {
            width: 100%;
            overflow-x: auto;
            padding: var(--space-md) var(--space-lg);
            box-sizing: border-box;
            scrollbar-width: none;
        }
        
        .categories-scroll-container::-webkit-scrollbar { display: none; }

        .categories-list {
            display: flex;
            gap: var(--space-md);
            width: max-content;
        }

        .category-chip {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            padding: 8px 16px;
            background: rgba(255,255,255,0.8);
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: var(--radius-full);
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 14px;
            color: var(--primary-dark);
        }
        
        .category-chip.active {
            background: var(--accent-marigold);
            color: white;
            border-color: var(--accent-marigold);
            font-weight: 600;
        }

        .btn-add {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--gradient-accent);
          color: white;
          border: none;
          font-size: 20px;
          font-weight: 700;
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .btn-add:hover {
          transform: scale(1.1);
        }

        .cart-summary {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-lg);
          background: var(--glass-primary);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 20;
        }

        .cart-summary-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .cart-items-count {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: var(--font-size-sm);
        }

        .cart-total {
          margin: 0;
          color: white;
          font-size: var(--font-size-2xl);
          font-weight: 700;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .commerce-header {
            padding: var(--space-sm) var(--space-md);
          }

          .search-container {
            margin-top: var(--space-sm);
          }

          .merchants-container {
            padding: var(--space-sm);
          }

          .merchant-card {
            padding: var(--space-md);
          }

          .cart-summary {
            padding: var(--space-md);
          }
        }

        @media (max-width: 480px) {
          .merchant-name {
            font-size: var(--font-size-base);
          }

          .item-price {
            font-size: var(--font-size-base);
          }
        }
      `}</style>
    </div>
  );
};

export default CommerceHub;
