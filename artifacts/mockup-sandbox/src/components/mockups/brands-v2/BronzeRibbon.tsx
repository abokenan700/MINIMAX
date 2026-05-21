import React from 'react';

const BRANDS = [
  "نايك",
  "أديداس",
  "بوما",
  "نيو بالانس",
  "ريبوك",
  "فيلا",
  "أنبر",
  "روث"
];

export function BronzeRibbon() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@700&display=swap');
        
        .bronze-ribbon-wrapper {
          display: flex;
          justify-content: center;
          padding: 24px;
          background-color: #F7F3EE; /* --page-bg */
        }

        .bronze-ribbon-container {
          direction: rtl;
          font-family: 'Tajawal', sans-serif;
          background-color: #FFFAF7;
          width: 100%;
          max-width: 390px;
          height: 56px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(34,34,34,0.04);
        }

        /* Fade masks */
        .bronze-ribbon-container::before,
        .bronze-ribbon-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 40px;
          z-index: 2;
          pointer-events: none;
        }

        .bronze-ribbon-container::before {
          right: 0;
          background: linear-gradient(to left, #FFFAF7, transparent);
        }

        .bronze-ribbon-container::after {
          left: 0;
          background: linear-gradient(to right, #FFFAF7, transparent);
        }

        .bronze-ribbon-scroll {
          display: flex;
          align-items: center;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          padding: 0 32px;
          height: 100%;
          white-space: nowrap;
          position: relative;
        }

        .bronze-ribbon-scroll::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .bronze-ribbon-item {
          color: #333333;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 0;
        }

        .bronze-ribbon-item:hover {
          color: #D4503A;
        }

        .bronze-ribbon-item:active {
          transform: scale(0.96);
        }

        .bronze-ribbon-separator {
          color: #B8763E;
          opacity: 0.5;
          font-size: 9px;
          margin: 0 16px;
          transition: opacity 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .bronze-ribbon-item:hover + .bronze-ribbon-separator {
          opacity: 1;
        }

        .bronze-ribbon-line {
          position: absolute;
          bottom: 12px;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, #B8763E 50%, transparent 100%);
          opacity: 0.4;
          pointer-events: none;
          z-index: 1;
        }
      `}</style>

      <div className="bronze-ribbon-wrapper">
        <div className="bronze-ribbon-container">
          <div className="bronze-ribbon-line" />
          <div className="bronze-ribbon-scroll">
            {BRANDS.map((brand, index) => (
              <React.Fragment key={index}>
                <a href="#" className="bronze-ribbon-item" onClick={(e) => e.preventDefault()}>
                  {brand}
                </a>
                {index < BRANDS.length - 1 && (
                  <span className="bronze-ribbon-separator">◆</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
