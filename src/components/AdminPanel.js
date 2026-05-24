import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Save, Trash2, PlusCircle, ArrowLeft, MapPin, 
  RefreshCw, Database, ShieldAlert, CheckCircle, Search 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🚀 IMPORTING YOUR DYNAMIC API CONFIG
import { API_BASE_URL } from './apiConfig';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  const [newCrop, setNewCrop] = useState({ 
    crop: '', price: '', market: '', city: '', trend: 'up' 
  });

  // 1. READ: Fetch all items using the Network IP
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/mandi`);
      setItems(res.data);
    } catch (err) {
      console.error("Network Link Error", err);
      setStatus({ type: 'error', msg: 'Sync Failed: Cannot reach 10.112.181.207' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. CREATE: Insert a new crop
  const handleInsert = async () => {
    if (!newCrop.crop || !newCrop.price || !newCrop.city) {
      return setStatus({ type: 'error', msg: 'Mandatory: Crop, Price, and City profiles required.' });
    }
    try {
      const res = await axios.post(`${API_BASE_URL}/api/mandi`, newCrop);
      setItems([...items, res.data]);
      setNewCrop({ crop: '', price: '', market: '', city: '', trend: 'up' });
      setStatus({ type: 'success', msg: 'Neural Matrix Updated: New Entry Saved.' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Write Error: Database rejected entry.' });
    }
  };

  // 3. UPDATE: Save changes
  const handleUpdate = async (id, updatedData) => {
    try {
      await axios.put(`${API_BASE_URL}/api/mandi/${id}`, updatedData);
      setStatus({ type: 'success', msg: `ID ${id.substring(0,6)} Profile Synchronized.` });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Update Failed: Network interruption.' });
    }
  };

  // 4. DELETE: Remove a crop
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ DELETION PROTOCOL: Permanent removal from Cloud?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/mandi/${id}`);
      setItems(items.filter(item => item._id !== id));
      setStatus({ type: 'success', msg: 'Item Purged from Cloud Matrix.' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Delete Failed: Admin privilege required.' });
    }
  };

  const handleListChange = (id, field, value) => {
    setItems(items.map(item => item._id === id ? { ...item, [field]: value } : item ));
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '100px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(16px)', padding: '30px 20px', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color:'#10b981', fontSize:'0.75rem', fontWeight:'900', letterSpacing:'2px'}}>
               <Database size={14}/> {loading ? "SYNCING..." : "LIVE DATABASE LINK"}
            </div>
            <h1 style={{margin:0, fontSize:'1.6rem', fontWeight:'900'}}>System Administrator</h1>
          </div>
          <button onClick={() => navigate('/mandi')} style={navBtnStyle}><ArrowLeft size={18}/> Exit</button>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        {status.msg && (
          <div className="fade-in" style={{...statusBanner, background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${status.type === 'success' ? '#10b981' : '#ef4444'}`}}>
            {status.type === 'success' ? <CheckCircle size={18} color="#10b981"/> : <ShieldAlert size={18} color="#ef4444"/>}
            <span style={{color: status.type === 'success' ? '#10b981' : '#fca5a5'}}>{status.msg}</span>
          </div>
        )}

        {/* --- INSERT SECTION --- */}
        <div style={formCardStyle}>
          <h3 style={{marginTop:0, color:'#10b981', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'8px'}}>
            <PlusCircle size={18}/> EXECUTE NEW ENTRY
          </h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            <input type="text" placeholder="Crop Name" value={newCrop.crop} onChange={(e)=>setNewCrop({...newCrop, crop:e.target.value})} style={inputStyle}/>
            <input type="text" placeholder="Price (₹)" value={newCrop.price} onChange={(e)=>setNewCrop({...newCrop, price:e.target.value})} style={inputStyle}/>
            <input type="text" placeholder="City" value={newCrop.city} onChange={(e)=>setNewCrop({...newCrop, city:e.target.value})} style={inputStyle}/>
            <input type="text" placeholder="Mandi Name" value={newCrop.market} onChange={(e)=>setNewCrop({...newCrop, market:e.target.value})} style={inputStyle}/>
            <select value={newCrop.trend} onChange={(e)=>setNewCrop({...newCrop, trend:e.target.value})} style={{...inputStyle, gridColumn:'span 2'}}>
              <option value="up">Trend: Up 📈</option>
              <option value="down">Trend: Down 📉</option>
            </select>
          </div>
          <button onClick={handleInsert} style={primaryBtnStyle}>Commit to Network Matrix</button>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', margin:'30px 0 15px 0'}}>
            <h3 style={{margin:0, fontSize:'1rem', color:'#94a3b8'}}>DATA NODES ({items.length})</h3>
            <button onClick={fetchData} style={{background:'none', border:'none', color:'#10b981', cursor:'pointer'}}><RefreshCw size={20} className={loading ? "spin" : ""}/></button>
        </div>

        {/* --- READ / UPDATE / DELETE SECTION --- */}
        {items.map((item) => (
          <div key={item._id} className="fade-in" style={itemCardStyle}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
               <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <input 
                    type="text" value={item.crop} 
                    onChange={(e) => handleListChange(item._id, 'crop', e.target.value)}
                    style={{...inputStyle, width:'140px', fontWeight:'900', border:'none', padding:0, fontSize:'1.1rem'}}
                  />
               </div>
               <button onClick={() => handleDelete(item._id)} style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer'}}><Trash2 size={20}/></button>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:'10px', alignItems:'center'}}>
              <input type="text" value={item.price} onChange={(e) => handleListChange(item._id, 'price', e.target.value)} style={inputStyle}/>
              <select value={item.trend} onChange={(e) => handleListChange(item._id, 'trend', e.target.value)} style={inputStyle}>
                <option value="up">Up 📈</option>
                <option value="down">Down 📉</option>
              </select>
              <button onClick={() => handleUpdate(item._id, { crop: item.crop, price: item.price, trend: item.trend })} style={saveBtnStyle}>
                <Save size={20}/>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- STYLING (THEME: SYSTEM HUD) ---
const inputStyle = { padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', background: '#020617', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', fontWeight:'600' };
const navBtnStyle = { background: '#1e293b', border: 'none', color: '#fff', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight:'700' };
const primaryBtnStyle = { width: '100%', marginTop: '15px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' };
const formCardStyle = { background: '#0f172a', padding: '25px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' };
const itemCardStyle = { background: '#0f172a', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b', marginBottom: '15px', borderLeft: '4px solid #38bdf8' };
const saveBtnStyle = { background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px', borderRadius: '10px', cursor: 'pointer' };
const statusBanner = { padding: '15px', borderRadius: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: '800' };

export default AdminPanel;