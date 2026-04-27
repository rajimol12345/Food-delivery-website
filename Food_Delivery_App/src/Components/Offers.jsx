import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaTag, FaPercentage, FaTruck, FaRegClock } from 'react-icons/fa';

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
          newTimeLeft[idx] = null;
        }
      });
      setTimeLeft(newTimeLeft);
    };
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();
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
      <div className="container">
        <div className="section-header-modern">
          <div className="header-badge">EXCLUSIVE DEALS</div>
          <h2 className="header-title">Limited Time Offers</h2>
          <p className="header-subtitle">Unlock premium savings from our top-rated restaurant partners.</p>
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
              <div className="card-top-professional">
                <div className={`offer-icon-professional ${offer.type}`}>
                  {offer.type === "truck" ? <FaTruck /> : offer.type === "tag" ? <FaTag /> : <FaPercentage />}
                </div>
                <div className={`validity-badge-professional ${!timeLeft[index] ? 'expired' : ''}`}>
                   {formatTime(timeLeft[index])}
                </div>
              </div>

              <div className="card-body-professional">
                <h3 className="offer-title-professional">{offer.title}</h3>
                <p className="offer-desc-professional">{offer.desc}</p>
                
                <div className="coupon-container-professional">
                  <div className="coupon-code-wrapper">
                    <code>{offer.code}</code>
                    <button className="copy-btn-minimal" onClick={() => {
                        navigator.clipboard.writeText(offer.code);
                        alert("Code copied!");
                    }}>
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
          background-color: #ffffff;
          padding: 100px 0;
          font-family: 'Inter', sans-serif;
        }

        .section-header-modern {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 20px;
        }

        .header-badge {
          display: inline-block;
          background: rgba(252, 128, 25, 0.1);
          color: #fc8019;
          padding: 6px 20px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 0.8rem;
          letter-spacing: 2px;
          margin-bottom: 15px;
        }

        .header-title {
          font-family: 'Poppins', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 15px;
          letter-spacing: -1px;
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: #666;
          max-width: 600px;
          margin: 0 auto;
        }

        .professional-offers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          padding: 0 20px;
        }

        .professional-offer-card {
          background: #fbfbfc;
          border: 1.5px solid #f0f0f0;
          border-radius: 28px;
          padding: 35px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .professional-offer-card:hover {
          background: #ffffff;
          border-color: #fc8019;
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
        }

        .card-top-professional {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .offer-icon-professional {
          width: 55px;
          height: 55px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: #ffffff;
          color: #fc8019;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          transition: all 0.4s ease;
        }

        .professional-offer-card:hover .offer-icon-professional {
          background: #fc8019;
          color: #ffffff;
          transform: scale(1.1);
        }

        .validity-badge-professional {
          font-size: 0.75rem;
          font-weight: 800;
          color: #333;
          background: #ffffff;
          padding: 8px 15px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.03);
          font-family: monospace;
        }

        .offer-title-professional {
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 12px;
        }

        .offer-desc-professional {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.6;
          margin-bottom: 30px;
          flex-grow: 1;
        }

        .coupon-code-wrapper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border: 2px dashed #eee;
          padding: 12px 18px;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .professional-offer-card:hover .coupon-code-wrapper {
          border-color: #fc8019;
          background: rgba(252, 128, 25, 0.02);
        }

        .coupon-code-wrapper code {
          font-size: 1rem;
          font-weight: 800;
          color: #fc8019;
          letter-spacing: 1px;
        }

        .copy-btn-minimal {
          background: #fc8019;
          border: none;
          color: #fff;
          font-size: 0.75rem;
          font-weight: 800;
          cursor: pointer;
          padding: 6px 14px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .copy-btn-minimal:hover {
          background: #e67216;
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .header-title { font-size: 1.8rem; }
          .premium-offers-section { padding: 60px 0; }
        }
      `}</style>
    </section>
  );
};

export default Offers;
