import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  Tractor, User, PlusCircle, X, MapPin, ArrowLeft, 
  Database, Handshake, Loader, Calendar, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './apiConfig';

const Sahayog = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showListForm, setShowListForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', owner: '', phone: '' });

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // 1. FETCH DATA
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/rentals`, { timeout: 3000 });
      setItems(res.data);
    } catch (err) {
      setItems([
        { _id: '1', name: 'Mahindra 575 DI Tractor', owner: 'Ramesh Reddy', price: '800', location: 'Visakhapatnam' },
        { _id: '2', name: 'Automatic Seed Drill', owner: 'Suresh Kumar', price: '300', location: 'Vizianagaram' }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // 2. NAVIGATE TO BOOKING PAGE
  const handleBookingStart = (item) => {
    // We pass the item details to the booking page via state
    navigate('/book-equipment', { state: { item } });
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(45, 212, 191, 0.3)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <button onClick={() => navigate('/home')} style={iconBtnStyle}><ArrowLeft size={24}/></button>
            <div>
              <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900'}}><Handshake size={24} color="#2dd4bf" /> Sahayog</h2>
              <p style={{margin:0, color:'#94a3b8', fontSize:'0.7rem', letterSpacing:'1px'}}>EQUIPMENT RENTAL GRID</p>
            </div>
          </div>
          <button onClick={() => setShowListForm(true)} style={plusBtnStyle}><PlusCircle size={22}/></button>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        {loading ? (
          <div style={{textAlign:'center', padding:'50px'}}><Loader className="spin" size={40} color="#2dd4bf"/></div>
        ) : (
          <div className="fade-in" style={{display:'flex', flexDirection:'column', gap:'15px'}}>
            {items.map((item) => (
              <div key={item._id} style={itemCardStyle}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                  <div>
                    <h3 style={{margin:'0 0 8px 0', fontSize:'1.2rem', color:'#f8fafc', fontWeight:'900'}}>{item.name}</h3>
                    <p style={{margin:0, color:'#94a3b8', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'5px'}}><MapPin size={14} color="#2dd4bf"/> {item.location || "Nearby"}</p>
                  </div>
                  <div style={priceBadgeStyle}>₹{item.price}<span style={{fontSize:'0.7rem'}}>/hr</span></div>
                </div>
                
                <div style={{display:'flex', gap:'10px', marginTop: '20px'}}>
                  <div style={ownerInfoStyle}><User size={16} color="#2dd4bf"/> {item.owner}</div>
                  <button onClick={() => handleBookingStart(item)} style={bookBtnStyle}>
                    Book Now <ArrowRight size={18}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Internal Styles
const iconBtnStyle = { background:'rgba(45, 212, 191, 0.1)', border:'1px solid rgba(45, 212, 191, 0.3)', color:'#2dd4bf', padding:'10px', borderRadius:'12px', cursor:'pointer' };
const plusBtnStyle = { background:'linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)', color:'white', border:'none', padding:'10px', borderRadius:'12px', cursor:'pointer', boxShadow:'0 4px 15px rgba(45, 212, 191, 0.4)' };
const itemCardStyle = { background: '#0f172a', borderRadius: '24px', border: '1px solid #1e293b', borderTop: '4px solid #2dd4bf', padding: '20px' };
const priceBadgeStyle = { background:'rgba(45, 212, 191, 0.1)', color:'#2dd4bf', padding:'8px 12px', borderRadius:'12px', fontWeight:'900', fontSize:'1.1rem' };
const ownerInfoStyle = { flex:1, padding:'12px', background:'#020617', borderRadius:'12px', border:'1px solid #1e293b', display: 'flex', alignItems:'center', gap: '8px', color: '#cbd5e1', fontSize: '0.85rem' };
const bookBtnStyle = { flex:1, padding:'12px', background:'#2dd4bf', color:'#020617', border:'none', borderRadius:'12px', fontSize:'1rem', fontWeight:'900', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', cursor:'pointer' };

export default Sahayog;