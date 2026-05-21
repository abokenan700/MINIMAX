import React from 'react';

const brands = [
  'نايك',
  'أديداس',
  'بوما',
  'نيو بالانس',
  'ريبوك',
  'فيلا',
  'أنبر',
  'روث'
];

export function PrestigeCards() {
  return (
    <div className="prestige-cards-container" dir="rtl">
      <link 
        href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" 
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: `
        .prestige-cards-container {
          --brand-primary: #D4503A;
          --brand-hover: #E8674A;
          --brand-light: #FDDFD6;
          --brand-50: #FEF2EE;
          --page-bg: #F7F3EE;
          --card-bg: #FFFFFF;
          --surface-warm: #EDE8E1;
          --bronze: #B8763E;
          --gold: #C49E5C;
          --border: rgba(34,34,34,0.08);
          --text-primary: #222222;
          --text-muted: #8C8480;
          
          font-family: 'Tajawal', sans-serif;
          background-color: var(--page-bg);
          padding: 12px;
          display: flex;
          overflow-x: auto;
          gap: 10px;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          /* Hide scrollbar for clean UI */
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .prestige-cards-container::-webkit-scrollbar {
          display: none;
        }

        .prestige-card {
          flex: 0 0 auto;
          width: 76px;
          height: 100px;
          background-color: var(--card-bg);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(34,34,34,0.08), 0 0 0 1px rgba(34,34,34,0.05);
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }

        .prestige-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(212,80,58,0.18), 0 0 0 1px rgba(34,34,34,0.05);
        }

        .prestige-card:active {
          transform: translateY(1px) scale(0.97);
          box-shadow: 0 1px 4px rgba(34,34,34,0.08), 0 0 0 1px rgba(34,34,34,0.05);
        }

        .prestige-card-top {
          height: 40%;
          background: linear-gradient(to right, var(--brand-primary), var(--brand-hover));
        }

        .prestige-card-bottom {
          height: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--card-bg);
          color: #333333;
          font-weight: 700;
          font-size: 11px;
          padding: 0 4px;
          text-align: center;
          line-height: 1.2;
        }

        .prestige-cards-skeleton-wrapper {
          display: flex;
          gap: 10px;
          padding: 12px;
          overflow: hidden;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
        }
        
        .prestige-card-skeleton {
          flex: 0 0 auto;
          width: 76px;
          height: 100px;
          border-radius: 12px;
          background: linear-gradient(90deg, #EDE8E1 25%, #F7F3EE 50%, #EDE8E1 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          box-shadow: 0 2px 8px rgba(34,34,34,0.04), 0 0 0 1px rgba(34,34,34,0.03);
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}} />
      
      {brands.map((brand, i) => (
        <a href="#" key={i} className="prestige-card" aria-label={brand} onClick={(e) => e.preventDefault()}>
          <div className="prestige-card-top" />
          <div className="prestige-card-bottom">{brand}</div>
        </a>
      ))}
    </div>
  );
}
