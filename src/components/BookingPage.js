import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, MapPin, Wallet, ShieldCheck, QrCode } from 'lucide-react';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state || { item: { name: 'Equipment', price: '0' } };

  const [step, setStep] = useState(1); // 1: Details, 2: Payment
  const [formData, setFormData] = useState({ hours: 1, address: '' });

  const totalAmount = parseInt(item.price) * formData.hours;

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', padding: '20px', fontFamily: '"Inter", sans-serif'}}>
      <button onClick={() => navigate(-1)} style={{background:'none', border:'none', color:'#94a3b8', display:'flex', alignItems:'center', gap:'5px', marginBottom:'20px'}}>
        <ArrowLeft size={20}/> Cancel Booking
      </button>

      <div style={{textAlign:'center', marginBottom:'30px'}}>
        <h2 style={{fontSize:'1.8rem', fontWeight:'900'}}>Confirm Booking</h2>
        <p style={{color:'#2dd4bf', fontSize:'1.1rem'}}>{item.name}</p>
      </div>

      {step === 1 ? (
        <div className="fade-in" style={cardStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}><Clock size={16}/> How many hours do you need?</label>
            <input 
              type="number" 
              value={formData.hours} 
              onChange={(e) => setFormData({...formData, hours: e.target.value})} 
              style={inputStyle}
            />
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}><MapPin size={16}/> Where should we bring it? (Address)</label>
            <textarea 
              placeholder="Enter your field location or landmark" 
              rows="3" 
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{...inputStyle, resize:'none'}}
            />
          </div>

          <div style={summaryBox}>
            <span>Estimated Total:</span>
            <span style={{fontSize:'1.5rem', color:'#2dd4bf', fontWeight:'900'}}>₹{totalAmount}</span>
          </div>

          <button onClick={() => setStep(2)} style={actionBtnStyle}>Proceed to Secure Payment</button>
        </div>
      ) : (
        <div className="fade-in" style={{...cardStyle, textAlign:'center'}}>
          <ShieldCheck size={40} color="#2dd4bf" style={{margin:'0 auto 10px auto'}}/>
          <h3 style={{margin:0}}>Secure Payment Gate</h3>
          <p style={{color:'#94a3b8', fontSize:'0.8rem', marginBottom:'20px'}}>Transaction ID: #KC-{Math.floor(Math.random()*90000)}</p>

          <div style={qrContainer}>
             <QrCode size={180} color="#f8fafc"/>
             <p style={{marginTop:'15px', color:'#2dd4bf', fontWeight:'bold'}}>SCAN TO PAY ₹{totalAmount}</p>
          </div>

          <div style={{background:'#020617', padding:'15px', borderRadius:'15px', marginTop:'20px', fontSize:'0.85rem', color:'#94a3b8', border:'1px dashed #1e293b'}}>
            After payment, the owner ({item.owner}) will receive your location and confirm the schedule.
          </div>

          <button onClick={() => { alert("Booking Confirmed! SMS sent to farmer."); navigate('/home'); }} style={actionBtnStyle}>
            Verify Payment
          </button>
        </div>
      )}
    </div>
  );
};

// Styles
const cardStyle = { background:'#0f172a', padding:'30px', borderRadius:'28px', border:'1px solid #1e293b', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' };
const inputGroup = { marginBottom:'25px' };
const labelStyle = { display:'flex', alignItems:'center', gap:'8px', color:'#94a3b8', fontSize:'0.9rem', marginBottom:'10px', fontWeight:'600' };
const inputStyle = { width:'100%', padding:'18px', borderRadius:'15px', border:'1px solid #1e293b', background:'#020617', color:'#fff', fontSize:'1.1rem', boxSizing:'border-box', fontWeight:'700' };
const summaryBox = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px', background:'#020617', borderRadius:'15px', border:'1px solid #2dd4bf33', marginBottom:'25px' };
const actionBtnStyle = { width:'100%', padding:'20px', background:'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', border:'none', borderRadius:'15px', color:'#020617', fontSize:'1.1rem', fontWeight:'900', cursor:'pointer' };
const qrContainer = { background:'#020617', padding:'30px', borderRadius:'20px', border:'1px solid #1e293b', display:'inline-block' };

export default BookingPage;