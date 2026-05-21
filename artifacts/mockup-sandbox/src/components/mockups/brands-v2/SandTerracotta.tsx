import React, { useState, useEffect } from 'react';
import './_tokens.css';

const brands = [
  "نايك",
  "أديداس",
  "بوما",
  "نيو بالانس",
  "ريبوك",
  "فيلا",
  "أنبر",
  "روث"
];

export function SandTerracotta() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="sand-terracotta-container" dir="rtl">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
        
        .sand-terracotta-container {
          --brand-primary: #D4503A;
          --brand-hover: #E8674A;
          --brand-light: #FDDFD6;
          --brand-50: #FEF2EE;
          --page-bg: #F7F3EE;
          --card-bg: #FFFFFF;
          --surface-warm: #EDE8E1;
          --border: rgba(34,34,34,0.08);
          --text-primary: #222222;
          
          font-family: 'Tajawal', sans-serif;
          background-color: var(--page-bg);
          padding: 10px 12px;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          overflow: hidden;
        }

        .sand-terracotta-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 8px; /* For shadow */
        }
        
        .sand-terracotta-scroll::-webkit-scrollbar {
          display: none;
        }

        .brand-card {
          flex: 0 0 auto;
          width: 88px;
          height: 72px;
          background-color: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 14px;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .brand-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: var(--brand-primary);
          transition: background-color 0.2s ease;
        }

        .brand-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(212, 80, 58, 0.15);
        }
        
        .brand-card:hover::before {
          background-color: var(--brand-hover);
        }

        .brand-card:active {
          transform: translateY(1px) scale(0.97);
          box-shadow: 0 1px 2px rgba(212, 80, 58, 0.1);
        }

        /* Skeleton loader */
        .skeleton-card {
          flex: 0 0 auto;
          width: 88px;
          height: 72px;
          background-color: var(--surface-warm);
          border-radius: 12px;
          position: relative;
          overflow: hidden;
        }

        .skeleton-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div className="sand-terracotta-scroll">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : (
          brands.map((brand, index) => (
            <a href={`#brand-${index}`} key={index} className="brand-card">
              {brand}
            </a>
          ))
        )}
      </div>
    </div>
  );
}
