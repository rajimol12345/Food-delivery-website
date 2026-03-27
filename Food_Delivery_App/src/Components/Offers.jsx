import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaPercentage, FaTruck, FaRegClock } from 'react-icons/fa';

// Utility: Calculate initial expiry based on hours from now
const getExpiryDate = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

const defaultOffers = [
  { title: "50% OFF First Order", desc: "Premium quality meals delivered to your doorstep.", code: "EATWAY50", type: "discount", expiry: getExpiryDate(48) },
  { title: "Complimentary Delivery", desc: "Enjoy free shipping on all orders over ₹500.", code: "FREEDELAY", type: "truck", expiry: getExpiryDate(12) },
  { title: "Exclusive BOGO Deal", desc: "Buy 1 Get 1 Free on all signature desserts.", code: "SWEETBOGO", type: "tag", expiry: getExpiryDate(72) },
  { title: "Digital Payment Bonus", desc: "Flat ₹200 cashback via UPI or Credit Cards.", code: "PAYLATER", type: "discount", expiry: getExpiryDate(5) }
];

const Offers = ({ offers }) => {

  const initialOffers = useMemo(() => (offers && offers.length > 0) 
    ? offers.map((o, i) => ({ 
        title: o, 
        desc: "Exclusive partner offer. Limited availability.", 
        code: `EATWAY${i+1}`, 
        type: i % 2 === 0 ? "discount" : "truck",
        expiry: getExpiryDate(24 + (i * 6))
      }))
    : defaultOffers, [offers]);

  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft = {};
      initialOffers.forEach((offer, idx) => {
        const difference = +new Date(offer.expiry) - +new Date();
        if (difference > 0) {
          newTimeLeft[idx] = {
            d: Math.floor(difference / (1000 * 60 * 60 * 24)),
            h: Math.floor((difference / (1000 * 60 * 60)) % 24),
            m: Math.floor((difference / 1000 / 60) % 60),
            s: Math.floor((difference / 1000) % 60)
          };
        } else {
          newTimeLeft[idx] = null; // Expired
        }
      });
      setTimeLeft(newTimeLeft);
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Initial run

    return () => clearInterval(timer);
  }, [initialOffers]);

  const formatTime = (time) => {
    if (!time) return "EXPIRED";
    const { d, h, m, s } = time;
    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    parts.push(`${h.toString().padStart(2, '0')}h`);
    parts.push(`${m.toString().padStart(2, '0')}m`);
    parts.push(`${s.toString().padStart(2, '0')}s`);
    return parts.join(" ");
  };

  if (!initialOffers || initialOffers.length === 0) return null;

  return (
    <section className="premium-offers-section">
      <div className="container-fluid px-3 px-lg-5">
        <div className="section-header-professional">
          <div className="header-label">
            <span className="accent-dot"></span>
            LIMITED TIME OFFERS
          </div>
          <h2 className="header-title-professional">Exclusive Promotions</h2>
          <p className="header-subtitle-professional">Curated deals from our top-rated restaurants, just for you.</p>
        </div>

        <div className="professional-offers-grid">
          {initialOffers.slice(0, 4).map((offer, index) => (
            <motion.div
              key={index}
              className="professional-offer-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="card-accent-bar"></div>
              <div className="card-top-professional">
                <div className={`offer-icon-professional ${offer.type}`}>
                  {offer.type === "truck" ? <FaTruck /> : offer.type === "tag" ? <FaTag /> : <FaPercentage />}
                </div>
                <div className={`validity-badge-professional ${!timeLeft[index] ? 'expired' : ''}`}>
                  <FaRegClock className="me-1" /> {formatTime(timeLeft[index])}
                </div>
              </div>

              <div className="card-body-professional">
                <h3 className="offer-title-professional">{offer.title}</h3>
                <p className="offer-desc-professional">{offer.desc}</p>
                
                <div className="coupon-container-professional">
                  <span className="coupon-label">USE CODE</span>
                  <div className="coupon-code-wrapper">
                    <code>{offer.code}</code>
                    <button className="copy-btn-minimal" onClick={() => navigator.clipboard.writeText(offer.code)}>
                      COPY
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        .premium-offers-section {
          background-color: #fafbfc;
          padding: 85px 0;
          border-top: 1px solid rgba(0,0,0,0.02);
          border-bottom: 1px solid rgba(0,0,0,0.02);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .section-header-professional {
          margin-bottom: 50px;
          text-align: left;
          padding: 0 15px;
        }

        .header-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 800;
          color: #fc8019;
          letter-spacing: 2px;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .accent-dot {
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #fc8019 0%, #ff9e43 100%);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 10px rgba(252, 128, 25, 0.4);
        }

        .header-title-professional {
          font-size: 38px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 12px;
          letter-spacing: -1px;
        }

        .header-subtitle-professional {
          color: #666;
          font-size: 17px;
          max-width: 600px;
          line-height: 1.6;
        }

        .professional-offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          padding: 0 15px;
        }

        .professional-offer-card {
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.03);
          border-radius: 20px;
          padding: 30px;
          position: relative;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          cursor: pointer;
        }

        .professional-offer-card:hover {
          border-color: rgba(252, 128, 25, 0.2);
          box-shadow: 0 20px 40px rgba(252, 128, 25, 0.08);
          transform: translateY(-8px);
        }

        .card-accent-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 0%;
          height: 5px;
          background: linear-gradient(90deg, #fc8019, #ff9e43);
          transition: width 0.4s ease;
        }

        .professional-offer-card:hover .card-accent-bar {
          width: 100%;
        }

        .card-top-professional {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }

        .offer-icon-professional {
          width: 50px;
          height: 50px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          background: rgba(252, 128, 25, 0.06);
          color: #fc8019;
          transition: all 0.4s ease;
        }

        .professional-offer-card:hover .offer-icon-professional {
          background: linear-gradient(135deg, #fc8019 0%, #ff9e43 100%);
          color: #ffffff;
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 15px rgba(252, 128, 25, 0.2);
        }

        .validity-badge-professional {
          font-size: 11px;
          font-weight: 700;
          color: #fc8019;
          display: flex;
          align-items: center;
          background: rgba(252, 128, 25, 0.1);
          padding: 6px 12px;
          border-radius: 20px;
          transition: all 0.3s ease;
          font-family: 'JetBrains Mono', monospace;
          min-width: 110px;
          justify-content: center;
        }

        .validity-badge-professional.expired {
          color: #dc3545;
          background: rgba(220, 53, 69, 0.1);
        }

        .professional-offer-card:hover .validity-badge-professional {
          background: rgba(252, 128, 25, 0.2);
        }

        .offer-title-professional {
          font-size: 20px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .offer-desc-professional {
          font-size: 15px;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
          flex-grow: 1;
        }

        .coupon-container-professional {
          border-top: 1px dashed rgba(0,0,0,0.08);
          padding-top: 25px;
          transition: border-color 0.3s ease;
        }

        .professional-offer-card:hover .coupon-container-professional {
          border-color: rgba(252, 128, 25, 0.2);
        }

        .coupon-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #999;
          letter-spacing: 1.5px;
          margin-bottom: 10px;
        }

        .coupon-code-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fcfcfc;
          border: 1px solid rgba(0,0,0,0.05);
          padding: 10px 14px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .professional-offer-card:hover .coupon-code-wrapper {
          background: rgba(252, 128, 25, 0.02);
          border-color: rgba(252, 128, 25, 0.15);
        }

        .coupon-code-wrapper code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 15px;
          font-weight: 800;
          color: #fc8019;
          letter-spacing: 1px;
        }

        .copy-btn-minimal {
          background: rgba(0,0,0,0.04);
          border: none;
          color: #555;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .copy-btn-minimal:hover {
          background: #fc8019;
          color: #fff;
          box-shadow: 0 4px 10px rgba(252, 128, 25, 0.3);
        }

        @media (max-width: 768px) {
          .premium-offers-section {
            padding: 60px 0;
          }
          .header-title-professional {
            font-size: 30px;
          }
        }
      `}</style>
    </section>
  );
};

export default Offers;