import React from 'react';
import './WarmGlass.css';

const BRANDS = [
  'نايك',
  'أديداس',
  'بوما',
  'نيو بالانس',
  'ريبوك',
  'فيلا',
  'أنبر',
  'روث'
];

export function WarmGlass() {
  return (
    <div className="warm-glass-container" dir="rtl">
      <link 
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700&display=swap" 
        rel="stylesheet" 
      />
      
      <div className="warm-glass-scroll-area">
        <div className="warm-glass-track">
          {BRANDS.map((brand, idx) => (
            <button key={idx} className="warm-glass-card" aria-label={brand}>
              <div className="warm-glass-blur-wrapper">
                <div className="warm-glass-decor-bar"></div>
                <span className="warm-glass-brand-name">{brand}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="warm-glass-fade-left"></div>
      <div className="warm-glass-fade-right"></div>
    </div>
  );
}
