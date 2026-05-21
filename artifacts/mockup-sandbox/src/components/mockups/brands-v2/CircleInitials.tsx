import React from "react";

const BRANDS = [
  { name: "نايك", initial: "ن" },
  { name: "أديداس", initial: "أ" },
  { name: "بوما", initial: "ب" },
  { name: "نيو بالانس", initial: "ن" },
  { name: "ريبوك", initial: "ر" },
  { name: "فيلا", initial: "ف" },
  { name: "أنبر", initial: "أ" },
  { name: "روث", initial: "ر" },
];

export function CircleInitials() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@500;800&display=swap');

        .circle-initials-container {
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
          padding: 16px 0;
          width: 100%;
          max-width: 390px;
          margin: 0 auto;
          overflow: hidden;
          direction: rtl;
        }

        .circle-initials-scroll {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 0 16px;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        
        .circle-initials-scroll::-webkit-scrollbar {
          display: none;
        }

        .circle-initials-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .circle-initials-avatar {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FEF2EE 0%, #FDDFD6 50%, #F3B29D 100%);
          border: 1.5px solid rgba(212, 80, 58, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .circle-initials-initial {
          font-weight: 800;
          font-size: 22px;
          color: var(--brand-primary);
          line-height: 1;
          /* Visual adjustment for Arabic baseline */
          transform: translateY(2px); 
        }

        .circle-initials-label {
          font-weight: 500;
          font-size: 10px;
          color: #4A4A4A;
          max-width: 72px;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Interactions */
        .circle-initials-btn:hover .circle-initials-avatar {
          border-color: var(--brand-primary);
          box-shadow: 0 0 0 3px rgba(212, 80, 58, 0.15);
        }

        .circle-initials-btn:active .circle-initials-avatar {
          transform: scale(0.93);
        }
      `}</style>

      <div className="circle-initials-container">
        <div className="circle-initials-scroll">
          {BRANDS.map((brand, i) => (
            <button key={i} className="circle-initials-btn" type="button">
              <div className="circle-initials-avatar">
                <span className="circle-initials-initial">{brand.initial}</span>
              </div>
              <span className="circle-initials-label">{brand.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
