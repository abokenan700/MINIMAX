import React, { useState } from 'react';

const brands = [
  { id:"1", label:"Chanel", icon: null },
  { id:"2", label:"Gucci", icon: null },
  { id:"3", label:"Dior", icon: null },
  { id:"4", label:"Louis Vuitton", icon: null },
  { id:"5", label:"Versace", icon: null },
  { id:"6", label:"Prada", icon: null },
  { id:"7", label:"Hermès", icon: null }
];

export function V1DarkCinematic() {
  const [activeId, setActiveId] = useState("1");

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#111',
      padding: '40px 20px',
      minHeight: '100vh'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Reem+Kufi+Fun:wght@400;500;600;700&display=swap');

        .brands-v1-container {
          width: 390px;
          height: 844px; /* iPhone 12 Pro proportions */
          background-color: #0d0d0d;
          border-radius: 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 0 4px #1a1a1a;
          overflow: hidden;
          position: relative;
          color: #FBFAF8;
          font-family: 'IBM Plex Sans Arabic', sans-serif;
          direction: rtl;
        }

        /* Chrome details */
        .brands-v1-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 30px;
          background-color: #1a1a1a;
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
          z-index: 20;
        }

        .brands-v1-content {
          padding-top: 100px;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .brands-v1-header {
          font-family: 'Reem Kufi Fun', sans-serif;
          font-size: 28px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 30px;
          background: linear-gradient(to right, #b8860b, #d4af37, #fdf5e6, #d4af37, #b8860b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          background-size: 200% auto;
          animation: shine 4s linear infinite;
        }

        .brands-v1-strip-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .brands-v1-strip-wrapper::before,
        .brands-v1-strip-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 60px;
          z-index: 10;
          pointer-events: none;
        }

        .brands-v1-strip-wrapper::before {
          right: 0;
          background: linear-gradient(to left, #0d0d0d 0%, transparent 100%);
        }

        .brands-v1-strip-wrapper::after {
          left: 0;
          background: linear-gradient(to right, #0d0d0d 0%, transparent 100%);
        }

        .brands-v1-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 20px 40px;
          scroll-behavior: smooth;
          scrollbar-width: none; /* Firefox */
        }

        .brands-v1-scroll::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .brands-v1-card {
          flex: 0 0 auto;
          width: 130px;
          height: 190px;
          background-color: #121212;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
          position: relative;
          border: 1px solid rgba(212, 175, 55, 0.05);
          overflow: hidden;
        }

        .brands-v1-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          color: rgba(251, 250, 248, 0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          transition: all 0.5s ease;
          position: relative;
          z-index: 2;
          text-align: center;
        }

        .brands-v1-card.active {
          transform: scale(1.1);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 25px rgba(212, 175, 55, 0.15), inset 0 0 15px rgba(212, 175, 55, 0.05);
          background-color: #171717;
          margin: 0 10px;
        }

        .brands-v1-card.active .brands-v1-card-name {
          color: #d4af37;
          font-size: 18px;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
        }

        /* Shimmer effect for active card */
        .brands-v1-card::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -100%;
          width: 300%;
          height: 300%;
          background: linear-gradient(
            to right,
            rgba(212, 175, 55, 0) 0%,
            rgba(212, 175, 55, 0) 45%,
            rgba(212, 175, 55, 0.15) 50%,
            rgba(212, 175, 55, 0) 55%,
            rgba(212, 175, 55, 0) 100%
          );
          transform: rotate(30deg);
          transition: opacity 0.3s ease;
          opacity: 0;
          pointer-events: none;
        }

        .brands-v1-card.active::after {
          opacity: 1;
          animation: shimmer 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shimmer {
          0% { transform: translateX(-50%) translateY(-50%) rotate(30deg); }
          100% { transform: translateX(50%) translateY(50%) rotate(30deg); }
        }

        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}} />
      <div className="brands-v1-container">
        <div className="brands-v1-content">
          <h2 className="brands-v1-header">الماركات العالمية</h2>
          
          <div className="brands-v1-strip-wrapper">
            <div className="brands-v1-scroll">
              {brands.map(brand => (
                <div 
                  key={brand.id}
                  className={"brands-v1-card" + (activeId === brand.id ? " active" : "")}
                  onClick={() => setActiveId(brand.id)}
                  onMouseEnter={() => setActiveId(brand.id)}
                >
                  <span className="brands-v1-card-name">{brand.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default V1DarkCinematic;
