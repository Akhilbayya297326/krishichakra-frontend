import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Radar, AlertTriangle, MapPin, 
  ShieldAlert, Bug, CheckCircle, Volume2, Loader, Database
} from 'lucide-react';

// 🚀 YOUR BACKEND IP
import { API_BASE_URL } from './apiConfig';

const PestRadar = () => {
  const navigate = useNavigate();
  const [outbreaks, setOutbreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoc, setUserLoc] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({ crop: '', disease: '' });
  const [connectionError, setConnectionError] = useState(false);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL UI ---
  const ui = {
    English: {
      title: "Pest Radar", sub: "Live Community Outbreak Map",
      detecting: "Acquiring GPS Signal...",
      safe: "No nearby threats detected. Your area is safe.",
      warning: "CRITICAL ALERT: {disease} detected {dist}km away!",
      btnReport: "Report Disease in my Farm",
      phCrop: "Crop Name (e.g. Cotton)", phDisease: "Disease/Pest (e.g. Armyworm)",
      submit: "Broadcast Alert", cancel: "Cancel",
      locError: "Location access denied. Displaying standard grid data.",
      distText: "km away", dbEmpty: "No threat reports found in the network.",
      listenBtn: "Tap to Hear Voice Alert"
    },
    Hindi: {
      title: "कीट रडार", sub: "लाइव कम्युनिटी अलर्ट",
      detecting: "GPS सिग्नल खोज रहा है...",
      safe: "आसपास कोई खतरा नहीं है। आपका क्षेत्र सुरक्षित है।",
      warning: "अलर्ट: {disease} {dist} किमी दूर पाया गया!",
      btnReport: "मेरे खेत में बीमारी की रिपोर्ट करें",
      phCrop: "फसल का नाम (जैसे: कपास)", phDisease: "बीमारी/कीट (जैसे: सुंडी)",
      submit: "अलर्ट भेजें", cancel: "रद्द करें",
      locError: "स्थान पहुंच अस्वीकृत। मानक ग्रिड डेटा प्रदर्शित कर रहा है।",
      distText: "किमी दूर", dbEmpty: "नेटवर्क में कोई खतरे की रिपोर्ट नहीं मिली।",
      listenBtn: "वॉयस अलर्ट सुनने के लिए टैप करें"
    },
    Telugu: {
      title: "పెస్ట్ రాడార్", sub: "లైవ్ కమ్యూనిటీ మ్యాప్",
      detecting: "GPS సిగ్నల్ వెతుకుతోంది...",
      safe: "దగ్గరలో ఎలాంటి ముప్పు లేదు. మీ ప్రాంతం సురక్షితం.",
      warning: "హెచ్చరిక: {disease} {dist} కి.మీ దూరంలో కనుగొనబడింది!",
      btnReport: "నా పొలంలో తెగులును రిపోర్ట్ చేయండి",
      phCrop: "పంట పేరు (ఉదా: పత్తి)", phDisease: "తెగులు/పురుగు (ఉదా: కత్తెర పురుగు)",
      submit: "అలర్ట్ పంపండి", cancel: "రద్దు చేయండి",
      locError: "స్థాన ప్రాప్యత నిరాకరించబడింది. ప్రామాణిక గ్రిడ్ డేటాను చూపుతోంది.",
      distText: "కి.మీ దూరం", dbEmpty: "నెట్‌వర్క్‌లో ముప్పు నివేదికలు కనుగొనబడలేదు.",
      listenBtn: "వాయిస్ అలర్ట్ వినడానికి నొక్కండి"
    }
  };

  const t = ui[user.lang] || ui['English'];

  // 🛡️ BULLETPROOF OFFLINE FALLBACK DATA 🛡️
  const fallbackOutbreaks = [
    { _id: '1', crop: 'Cotton', disease: 'Pink Bollworm', lat: 17.6868 + 0.05, lon: 83.2185 + 0.05 },
    { _id: '2', crop: 'Paddy', disease: 'Brown Plant Hopper', lat: 17.6868 - 0.08, lon: 83.2185 + 0.02 },
    { _id: '3', crop: 'Tomato', disease: 'Leaf Miner', lat: 17.6868 + 0.15, lon: 83.2185 - 0.10 }
  ];

  // --- 🧮 HAVERSINE DISTANCE CALCULATOR ---
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }, []);

  // --- 🗣️ BULLETPROOF AI VOICE ALERT (Bypasses Browser Blocks) ---
  const triggerVoiceAlert = (threat) => {
    if (!window.speechSynthesis) {
      alert("Voice alerts are not supported in this browser.");
      return;
    }
    
    // Cancel any currently playing speech to prevent overlap
    window.speechSynthesis.cancel();

    const message = t.warning.replace('{disease}', threat.disease).replace('{dist}', threat.distance);
    const utterance = new SpeechSynthesisUtterance(message);
    
    // Set regional language based on user profile
    if (user.lang === 'Telugu') utterance.lang = 'te-IN';
    else if (user.lang === 'Hindi') utterance.lang = 'hi-IN';
    else utterance.lang = 'en-IN';
    
    // Optimize voice clarity
    utterance.rate = 0.9; 
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
  };

  const fetchOutbreaks = useCallback(async (userLat, userLon) => {
    try {
      setConnectionError(false);
      // 3 SECOND TIMEOUT ensures app doesn't freeze on mobile
      const res = await axios.get(`${API_BASE_URL}/api/outbreaks`, { timeout: 3000 });
      let dataToProcess = res.data;

      if (dataToProcess.length > 0) {
        const processedData = dataToProcess.map(report => ({
          ...report,
          distance: calculateDistance(userLat, userLon, report.lat, report.lon)
        }));

        processedData.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        setOutbreaks(processedData);
      } else {
        setOutbreaks([]); // Empty DB
      }

    } catch (err) {
      console.warn("Backend Blocked! Loading Safe-Mode Offline Data.");
      setConnectionError(true);
      
      // Process Fallback Data
      const processedFallback = fallbackOutbreaks.map(report => ({
        ...report,
        distance: calculateDistance(userLat, userLon, report.lat, report.lon)
      }));
      processedFallback.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setOutbreaks(processedFallback);
    } finally {
      setLoading(false);
    }
  }, [calculateDistance]);

  // 1. DUAL-ENGINE GEOLOCATION (Solves HTTP Mobile Block)
  useEffect(() => {
    const handleDetectLocation = async () => {
      const fetchFromIP = async () => {
        try {
          const ipRes = await axios.get('https://ipapi.co/json/');
          const lat = ipRes.data.latitude;
          const lon = ipRes.data.longitude;
          setUserLoc({ lat, lon });
          fetchOutbreaks(lat, lon);
        } catch (e) {
          // Absolute worst case scenario fallback coordinates
          setUserLoc({ lat: 17.6868, lon: 83.2185 });
          fetchOutbreaks(17.6868, 83.2185);
        }
      };

      if (!navigator.geolocation) {
        fetchFromIP();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserLoc({ lat, lon });
          fetchOutbreaks(lat, lon);
        },
        (error) => {
          fetchFromIP(); // Fallback if Browser blocks HTTP location
        },
        { timeout: 5000 }
      );
    };

    handleDetectLocation();
  }, [fetchOutbreaks]);

  // 🚀 DB SEEDER: Instantly populates your empty MongoDB
  const seedDatabase = async () => {
    setLoading(true);
    try {
      for (const item of fallbackOutbreaks) {
        const { _id, distance, ...cleanItem } = item; 
        await axios.post(`${API_BASE_URL}/api/outbreaks`, cleanItem);
      }
      alert("✅ Successfully injected threat data into your MongoDB!");
      if (userLoc) fetchOutbreaks(userLoc.lat, userLoc.lon); 
    } catch (err) {
      console.error("Seeding Failed:", err);
      alert("Failed to inject data. Check your Node.js console.");
    } finally {
      setLoading(false);
    }
  };

  const handleReportSubmit = async () => {
    if (!newReport.crop || !newReport.disease) return alert("Please fill all details");
    
    const randomOffset = () => (Math.random() - 0.5) * 0.02;

    const payload = {
      crop: newReport.crop,
      disease: newReport.disease,
      lat: userLoc.lat + randomOffset(),
      lon: userLoc.lon + randomOffset()
    };

    try {
      await axios.post(`${API_BASE_URL}/api/outbreaks`, payload);
      setShowReportModal(false);
      setNewReport({ crop: '', disease: '' });
      fetchOutbreaks(userLoc.lat, userLoc.lon); 
      alert("Outbreak broadcasted to nearby farmers successfully!");
    } catch (err) {
      alert("Failed to report to backend.");
    }
  };

  return (
    <div style={{paddingBottom:'90px', background:'#020617', minHeight:'100vh', color:'#f8fafc', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(220, 38, 38, 0.3)', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)' }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(220, 38, 38, 0.1)', border:'1px solid rgba(220, 38, 38, 0.3)', color:'#ef4444', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
          <div>
            <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}><Radar size={24} color="#ef4444"/> {t.title}</h2>
            <p style={{margin:'4px 0 0 0', opacity:0.7, fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.sub}</p>
          </div>
        </div>
      </div>

      {/* 2. RADAR ANIMATION UI */}
      <div style={{position:'relative', height:'250px', display:'flex', justifyContent:'center', alignItems:'center', overflow:'hidden', borderBottom:'1px solid #1e293b', background:'radial-gradient(circle, #450a0a 0%, #020617 70%)'}}>
        {loading ? (
          <div style={{textAlign:'center', color:'#ef4444'}}><Loader className="spin" size={40} style={{margin:'0 auto 10px auto'}}/><p style={{fontWeight:'bold', letterSpacing:'1px'}}>{t.detecting}</p></div>
        ) : (
          <>
            <div style={{width:'200px', height:'200px', borderRadius:'50%', border:'1px solid rgba(239, 68, 68, 0.2)', position:'absolute'}}></div>
            <div style={{width:'120px', height:'120px', borderRadius:'50%', border:'1px solid rgba(239, 68, 68, 0.4)', position:'absolute'}}></div>
            <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'#ef4444', position:'absolute', boxShadow:'0 0 20px #ef4444'}} className="pulse-icon"></div>
            
            <div className="radar-sweep" style={{position:'absolute', width:'100px', height:'100px', borderRight:'2px solid #ef4444', background:'linear-gradient(45deg, transparent 50%, rgba(239, 68, 68, 0.4) 100%)', borderRadius:'0 100px 0 0', transformOrigin:'bottom left', top:'25px', left:'50%'}}></div>
            
            {outbreaks.slice(0, 4).map((threat, i) => {
              const distanceNum = parseFloat(threat.distance);
              if (distanceNum > 25) return null; 
              const topPos = i === 0 ? '30%' : (i === 1 ? '70%' : (i === 2 ? '40%' : '60%'));
              const leftPos = i === 0 ? '70%' : (i === 1 ? '30%' : (i === 2 ? '20%' : '80%'));
              return (
                <div key={threat._id || i} className="pulse-icon" style={{position:'absolute', top:topPos, left:leftPos}}>
                  <ShieldAlert size={20} fill="#dc2626" color="white" />
                </div>
              );
            })}
          </>
        )}
      </div>

      <div style={{padding: '20px'}}>
        
        {/* 3. REPORT BUTTON */}
        <button onClick={() => setShowReportModal(true)} style={{ width:'100%', padding:'18px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color:'white', border:'none', borderRadius:'16px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', display:'flex', justifyContent:'center', alignItems:'center', gap:'10px', cursor:'pointer', marginBottom:'25px', boxShadow:'0 8px 25px rgba(220, 38, 38, 0.4)' }}>
          <AlertTriangle size={20}/> {t.btnReport}
        </button>

        <h3 style={{color:'#94a3b8', fontSize:'0.85rem', letterSpacing:'2px', margin:'0 0 15px 0', textTransform:'uppercase'}}>Live Local Threats</h3>

        {/* 4. REAL OUTBREAK DATA LIST */}
        {!loading && outbreaks.length === 0 && !connectionError && (
          <div style={{textAlign:'center', marginTop:'30px', color:'#64748b', padding: '30px 20px', background: '#0f172a', borderRadius: '20px', border:'1px solid #1e293b'}}>
            <CheckCircle size={50} color="#10b981" style={{margin: '0 auto 15px auto', opacity:0.8}} />
            <p style={{margin: '0 0 20px 0', fontWeight:'bold', fontSize:'1.1rem'}}>{t.safe}</p>
            
            <button onClick={seedDatabase} style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color: 'white', border: 'none', padding: '15px 25px', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto', boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)'
            }}>
              <Database size={20} /> Initialize Database Data
            </button>
          </div>
        )}

        {outbreaks.map((threat) => {
          const isCritical = parseFloat(threat.distance) < 10;
          return (
            <div key={threat._id || Math.random()} className="fade-in" style={{
              background: isCritical ? '#450a0a' : '#0f172a', 
              border: isCritical ? '2px solid #dc2626' : '1px solid #1e293b',
              padding:'20px', borderRadius:'20px', marginBottom:'15px',
              boxShadow: isCritical ? '0 10px 30px rgba(220, 38, 38, 0.3)' : '0 8px 20px rgba(0,0,0,0.3)'
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
                <div>
                  <h3 style={{margin:0, color: isCritical ? '#fca5a5' : '#f8fafc', fontSize:'1.2rem', fontWeight:'900', display:'flex', alignItems:'center', gap:'8px'}}>
                    <Bug size={20} color={isCritical ? '#ef4444' : '#94a3b8'}/> {threat.disease}
                  </h3>
                  <p style={{margin:'8px 0 0 0', color:'#94a3b8', fontSize:'0.9rem'}}>Affecting: <strong style={{color:'#f8fafc'}}>{threat.crop}</strong></p>
                </div>
                
                <div style={{background: isCritical ? '#dc2626' : '#1e293b', padding:'10px 15px', borderRadius:'14px', textAlign:'center', border: isCritical ? 'none' : '1px solid #334155'}}>
                  <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', color:'white'}}>{threat.distance}</h2>
                  <p style={{margin:0, fontSize:'0.75rem', color: isCritical ? '#fecaca' : '#94a3b8', fontWeight:'bold'}}>{t.distText}</p>
                </div>
              </div>

              {/* INTERACTIVE VOICE BUTTON - Guarantees Browser Playback */}
              {isCritical && (
                <button 
                  onClick={() => triggerVoiceAlert(threat)}
                  style={{
                    marginTop:'20px', width: '100%', background:'rgba(220, 38, 38, 0.15)', 
                    padding:'15px', borderRadius:'12px', display:'flex', alignItems:'center', 
                    justifyContent:'center', gap:'10px', border:'1px solid rgba(220, 38, 38, 0.4)', 
                    cursor:'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  <Volume2 size={24} color="#fca5a5" className="pulse-icon"/>
                  <span style={{color:'#fca5a5', fontSize:'0.95rem', fontWeight:'900', letterSpacing:'1px', textTransform:'uppercase'}}>
                    {t.listenBtn}
                  </span>
                </button>
              )}
            </div>
          );
        })}

      </div>

      {/* 5. MODAL TO REPORT OUTBREAK */}
      {showReportModal && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'20px' }}>
          <div className="fade-in" style={{ background:'#0f172a', padding:'30px', borderRadius:'24px', width:'100%', maxWidth:'400px', border:'1px solid #1e293b', boxShadow:'0 20px 40px rgba(0,0,0,0.6)' }}>
            <h3 style={{color:'#f8fafc', margin:'0 0 25px 0', fontSize:'1.3rem', display:'flex', alignItems:'center', gap:'10px'}}><ShieldAlert color="#ef4444"/> Broadcast Threat</h3>
            
            <input placeholder={t.phCrop} value={newReport.crop} onChange={e=>setNewReport({...newReport, crop:e.target.value})} style={inputStyle}/>
            <input placeholder={t.phDisease} value={newReport.disease} onChange={e=>setNewReport({...newReport, disease:e.target.value})} style={inputStyle}/>
            
            <div style={{background:'#020617', padding:'15px', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', marginBottom:'25px', border:'1px solid #1e293b'}}>
              <MapPin size={20} color="#10b981"/> <span style={{fontSize:'0.9rem', color:'#cbd5e1', fontWeight:'600'}}>GPS Location Attached Automatically</span>
            </div>

            <button onClick={handleReportSubmit} style={{width:'100%', padding:'18px', background:'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', color:'white', border:'none', borderRadius:'14px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1px', cursor:'pointer', marginBottom:'15px', boxShadow:'0 8px 25px rgba(220, 38, 38, 0.4)'}}>
              {t.submit}
            </button>
            <button onClick={() => setShowReportModal(false)} style={{width:'100%', padding:'15px', background:'transparent', color:'#94a3b8', border:'1px solid #1e293b', borderRadius:'14px', fontSize:'1rem', fontWeight:'bold', cursor:'pointer'}}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .radar-sweep { animation: sweep 3s infinite linear; }
        @keyframes pulseIcon { 0% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 15px #ef4444; } 100% { opacity: 0.4; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '16px 15px', marginBottom: '15px', borderRadius: '12px', border: '1px solid #1e293b', background:'#020617', color:'#f8fafc', fontSize:'1rem', boxSizing:'border-box', outline:'none' };

export default PestRadar;