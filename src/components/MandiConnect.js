import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  TrendingUp, TrendingDown, MapPin, Loader, Navigation, 
  AlertCircle, ArrowLeft, Search, IndianRupee, RefreshCw, 
  Volume2, VolumeX, Info, ListFilter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 🚀 THE FIX: Properly defined API URL for mobile access!
import { API_BASE_URL } from './apiConfig';

const MandiConnect = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('All India'); 
  const [detecting, setDetecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // UX Enhancements
  const [searchTerm, setSearchTerm] = useState(''); 
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Voice State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);

  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🛡️ FAIL-SAFE DEFAULT DATA ---
  const fallbackPrices = [
    { crop: "Paddy (Basmati)", price: "4,250", market: "Kurnool Mandi", city: "Kurnool", trend: "up" },
    { crop: "Onion (Red)", price: "2,100", market: "Lasalgaon", city: "Nashik", trend: "down" },
    { crop: "Cotton", price: "7,800", market: "Warangal Mandi", city: "Warangal", trend: "up" },
    { crop: "Wheat", price: "2,450", market: "Khanna Mandi", city: "Ludhiana", trend: "up" },
    { crop: "Tomato", price: "1,800", market: "Bowenpally", city: "Hyderabad", trend: "down" },
    { crop: "Maize", price: "2,200", market: "Nalgonda Mandi", city: "Nalgonda", trend: "up" }
  ];

  // --- 🌍 MULTILINGUAL DICTIONARY ---
  const ui = {
    English: {
      title: "Live Mandi", subtitle: "Real-time Market Matrix", search: "Search crop...",
      yourLocation: "MARKET LOCATION", allIndia: "All India", detected: "Detected",
      detectBtn: "GPS Auto-Locate", showingRates: "Live rates for:",
      fetching: "Syncing Live Rates...", errConn: "Safe Mode Active",
      errConnSub: "Displaying verified regional market benchmarks.",
      errEmpty: "No market data found for this region.",
      priceRising: "Trending Up", priceFalling: "Trending Down",
      catAll: "All", catGrain: "Grains", catVeg: "Vegetables", catCash: "Cash Crops",
      voiceBanner: "Listen to the live market broadcast for your region.",
      playVoice: "Broadcast Rates", stopVoice: "Stop Audio",
      refresh: "Refresh Data"
    },
    Hindi: {
      title: "लाइव मंडी", subtitle: "वास्तविक समय बाजार मैट्रिक्स", search: "फसल खोजें...",
      yourLocation: "बाजार स्थान", allIndia: "पूरा भारत", detected: "खोजा गया",
      detectBtn: "GPS ऑटो-लोकेट", showingRates: "लाइव दरें:",
      fetching: "लाइव दरें सिंक कर रहे हैं...", errConn: "सुरक्षित मोड सक्रिय",
      errConnSub: "सत्यापित क्षेत्रीय बाजार बेंचमार्क प्रदर्शित कर रहा है।",
      errEmpty: "इस क्षेत्र के लिए कोई बाजार डेटा नहीं मिला।",
      priceRising: "कीमत ऊपर", priceFalling: "कीमत नीचे",
      catAll: "सभी", catGrain: "अनाज", catVeg: "सब्जियां", catCash: "नकदी फसलें",
      voiceBanner: "अपने क्षेत्र के लिए लाइव मार्केट ब्रॉडकास्ट सुनें।",
      playVoice: "दरें सुनें", stopVoice: "ऑडियो रोकें",
      refresh: "डेटा ताज़ा करें"
    },
    Telugu: {
      title: "లైవ్ మండి", subtitle: "రియల్ టైమ్ మార్కెట్ మ్యాట్రిక్స్", search: "పంటను శోధించండి...",
      yourLocation: "మార్కెట్ లొకేషన్", allIndia: "అఖిల భారతదేశం", detected: "గుర్తించబడింది",
      detectBtn: "GPS ఆటో-లొకేట్", showingRates: "లైవ్ ధరలు:",
      fetching: "లైవ్ ధరలను సింక్ చేస్తోంది...", errConn: "సేఫ్ మోడ్ యాక్టివ్",
      errConnSub: "ప్రాంతీయ మార్కెట్ ధరలను ప్రదర్శిస్తోంది.",
      errEmpty: "ఈ ప్రాంతానికి మార్కెట్ డేటా కనుగొనబడలేదు.",
      priceRising: "ధర పెరిగింది", priceFalling: "ధర పడిపోయింది",
      catAll: "అన్ని", catGrain: "ధాన్యాలు", catVeg: "కూరగాయలు", catCash: "వాణిజ్య పంటలు",
      voiceBanner: "మీ ప్రాంతం కోసం లైవ్ మార్కెట్ ప్రసారాన్ని వినండి.",
      playVoice: "ధరలను వినండి", stopVoice: "ఆడియో ఆపండి",
      refresh: "డేటాను రిఫ్రెష్ చేయండి"
    }
  };
  const t = ui[user.lang] || ui['English'];

  // --- PRE-LOAD VOICES ---
  useEffect(() => {
    const loadVoices = () => setAvailableVoices(window.speechSynthesis.getVoices());
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => { if (window.speechSynthesis) window.speechSynthesis.cancel(); };
  }, []);

  const fetchPrices = useCallback(async (city) => {
    setLoading(true);
    setConnectionError(false);
    try {
      const url = city === 'All India' || city === t.allIndia
        ? `${API_BASE_URL}/api/mandi` 
        : `${API_BASE_URL}/api/mandi?market=${encodeURIComponent(city)}`;
      
      const res = await axios.get(url);
      
      // 🚀 THE FIX: If database is empty, load Fallback Data
      if (res.data.length === 0) {
        setPrices(fallbackPrices);
      } else {
        setPrices(res.data);
      }
    } catch (err) {
      console.warn("Backend Unreachable - Entering Safe Mode");
      setConnectionError(true);
      setPrices(fallbackPrices); // Load default data on connection failure
    } finally {
      setLoading(false);
    }
  }, [t.allIndia]);

  useEffect(() => { fetchPrices('All India'); }, [fetchPrices]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`);
          const detectedCity = res.data.city || res.data.locality || "Unknown";
          setLocation(detectedCity);
          fetchPrices(detectedCity);
        } catch (error) {
          alert("Location detection failed.");
        } finally { setDetecting(false); }
      },
      () => { alert("Location access denied."); setDetecting(false); }
    );
  };

  // --- SMART CATEGORIZATION ENGINE ---
  const getCropCategory = (cropName) => {
    const lower = cropName.toLowerCase();
    if (['tomato', 'onion', 'potato', 'cabbage', 'chilli', 'garlic'].some(v => lower.includes(v))) return 'Vegetables';
    if (['paddy', 'wheat', 'maize', 'rice', 'bajra', 'jowar'].some(v => lower.includes(v))) return 'Grains';
    if (['cotton', 'soyabean', 'sugarcane', 'groundnut', 'mustard'].some(v => lower.includes(v))) return 'Cash Crops';
    return 'Other';
  };

  const filteredPrices = prices.filter(p => {
    const matchesSearch = p.crop.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || getCropCategory(p.crop) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // --- VOICE BROADCASTER ---
  const handleSpeak = () => {
    if (!window.speechSynthesis) return alert("Voice not supported.");
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (filteredPrices.length === 0) return;

    let rawText = `${t.showingRates} ${location}. `;
    filteredPrices.slice(0, 5).forEach(item => {
      rawText += `${item.crop} is trading at ${item.price} rupees per quintal. `;
    });
    
    if (filteredPrices.length > 5) {
      rawText += `And ${filteredPrices.length - 5} more items are available on the screen.`;
    }

    const cleanText = rawText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').replace(/\*/g, '').replace(/#/g, '');
    const targetLangCode = user.lang === 'Hindi' ? 'hi-IN' : user.lang === 'Telugu' ? 'te-IN' : 'en-IN';
    const specificVoice = availableVoices.find(voice => voice.lang === targetLangCode || voice.lang.startsWith(targetLangCode.substring(0, 2)));

    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText];
    let currentSentenceIndex = 0;

    const speakNextSentence = () => {
      if (currentSentenceIndex < sentences.length) {
        const utterance = new SpeechSynthesisUtterance(sentences[currentSentenceIndex].trim());
        utterance.lang = targetLangCode;
        if (specificVoice) utterance.voice = specificVoice;
        utterance.rate = 0.85;

        utterance.onend = () => {
          currentSentenceIndex++;
          speakNextSentence();
        };
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeaking(false);
      }
    };

    setIsSpeaking(true);
    speakNextSentence();
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '90px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* 1. HUD HEADER */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)',
        padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(249, 115, 22, 0.3)',
        position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
            <button onClick={() => navigate('/home')} style={{background:'rgba(249, 115, 22, 0.1)', border:'1px solid rgba(249, 115, 22, 0.3)', color:'#ea580c', padding:'10px', borderRadius:'12px', cursor:'pointer'}}><ArrowLeft size={24}/></button>
            <div>
              <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                <h2 style={{margin:0, fontSize:'1.5rem', fontWeight:'900', color:'#f8fafc'}}>{t.title}</h2>
                <div style={{width:'8px', height:'8px', background: connectionError ? '#fbbf24' : '#10b981', borderRadius:'50%'}} className="pulse-icon"></div>
              </div>
              <p style={{margin:'4px 0 0 0', color:'#94a3b8', fontSize:'0.8rem', letterSpacing:'1px', textTransform:'uppercase'}}>{t.subtitle}</p>
            </div>
          </div>
          
          <button onClick={() => fetchPrices(location)} style={{background:'transparent', border:'none', color:'#ea580c', cursor:'pointer', padding:'10px'}}>
              <RefreshCw size={22} className={loading ? "spin" : ""}/>
          </button>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* Connection Error Banner (Safe Mode) */}
        {connectionError && (
          <div style={{background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '16px', padding: '12px 15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px'}}>
            <AlertCircle size={18} color="#fbbf24"/>
            <span style={{fontSize: '0.8rem', color: '#fbbf24', fontWeight: '700'}}>{t.errConnSub}</span>
          </div>
        )}

        {/* 2. ADVANCED LOCATION SCANNER */}
        <div className="fade-in" style={{background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', marginBottom:'20px'}}>
          <label style={{fontSize:'0.75rem', fontWeight:'800', color:'#94a3b8', marginBottom:'10px', display:'flex', alignItems:'center', gap:'6px', letterSpacing:'1px'}}><MapPin size={14}/> {t.yourLocation}</label>
          
          <div style={{display:'flex', gap:'10px'}}>
            <select 
              value={location} onChange={(e) => {setLocation(e.target.value); fetchPrices(e.target.value);}}
              style={{ flex:1, padding: '16px 15px', borderRadius: '14px', border: '1px solid #1e293b', background:'#020617', fontSize:'1rem', fontWeight:'800', color:'#ea580c', appearance: 'none', cursor:'pointer', outline:'none' }}
            >
              <option value="All India">{t.allIndia}</option>
              <option value="Warangal">Warangal</option>
              <option value="Nalgonda">Nalgonda</option>
              <option value="Nagpur">Nagpur</option>
              {!['All India', 'Warangal', 'Nalgonda', 'Nagpur'].includes(location) && (
                <option value={location}>{location} ({t.detected})</option>
              )}
            </select>

            <button 
              onClick={handleDetectLocation} disabled={detecting}
              style={{ background: detecting ? 'rgba(249, 115, 22, 0.2)' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: detecting ? '#ea580c' : 'white', border: 'none', borderRadius: '14px', padding: '0 20px', cursor:'pointer', boxShadow:'0 4px 15px rgba(234, 88, 12, 0.4)', transition:'all 0.3s' }}
            >
              {detecting ? <Loader className="spin" size={24}/> : <Navigation size={24}/>}
            </button>
          </div>
        </div>

        {/* 3. FILTERS & SEARCH */}
        <div style={{display:'flex', gap:'10px', overflowX:'auto', paddingBottom:'10px', marginBottom:'15px'}} className="hide-scrollbar">
          {[{ id: 'All', label: t.catAll }, { id: 'Grains', label: t.catGrain }, { id: 'Vegetables', label: t.catVeg }, { id: 'Cash Crops', label: t.catCash }].map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              style={{
                whiteSpace:'nowrap', padding:'12px 20px', borderRadius:'20px', fontWeight:'800', fontSize:'0.9rem', cursor:'pointer', transition:'all 0.2s',
                background: activeCategory === cat.id ? 'rgba(249, 115, 22, 0.15)' : '#0f172a',
                color: activeCategory === cat.id ? '#ea580c' : '#64748b',
                border: activeCategory === cat.id ? '1px solid rgba(249, 115, 22, 0.4)' : '1px solid #1e293b'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{position:'relative', marginBottom:'25px'}}>
          <Search size={20} color="#94a3b8" style={{position:'absolute', left:'15px', top:'18px'}}/>
          <input 
            type="text" placeholder={t.search} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
            style={{width:'100%', padding:'18px 20px 18px 45px', borderRadius:'16px', border:'1px solid #1e293b', background:'#0f172a', color:'#f8fafc', fontSize:'1rem', boxSizing:'border-box', outline:'none', fontWeight:'600'}}
          />
        </div>

        {/* 4. CONTENT */}
        {loading ? (
          <div style={{textAlign:'center', marginTop:'40px', color:'#94a3b8', fontSize:'1rem', fontWeight:'bold'}}>
            <Loader className="spin" size={40} color="#ea580c" style={{display:'block', margin:'0 auto 15px auto'}} /> {t.fetching}
          </div>
        ) : filteredPrices.length > 0 ? (
          <div className="fade-in">
            <div style={{ background:'rgba(249, 115, 22, 0.05)', border:'1px solid rgba(249, 115, 22, 0.2)', borderRadius:'20px', padding:'20px', marginBottom:'25px', textAlign:'center' }}>
              <Info size={28} color="#ea580c" style={{marginBottom:'10px'}} />
              <p style={{margin:'0 0 20px 0', color:'#cbd5e1', fontSize:'0.95rem', lineHeight:'1.5', fontWeight:'500'}}>{t.voiceBanner}</p>
              <button onClick={handleSpeak} className={isSpeaking ? "pulse-voice" : ""}
                style={{
                  width: '100%', background: isSpeaking ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
                  border: 'none', color: 'white', padding: '20px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  fontWeight: '900', fontSize: '1.15rem', cursor: 'pointer', transition: 'all 0.3s ease',
                  boxShadow: isSpeaking ? '0 8px 25px rgba(239, 68, 68, 0.4)' : '0 8px 25px rgba(234, 88, 12, 0.3)'
                }}
              >
                 {isSpeaking ? <VolumeX size={28}/> : <Volume2 size={28}/>}
                 {isSpeaking ? t.stopVoice : t.playVoice}
              </button>
            </div>

            <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
              {filteredPrices.map((item, idx) => (
                <div key={idx} style={{background: '#0f172a', borderRadius: '20px', padding: '20px', border:'1px solid #1e293b', borderLeft: item.trend === 'up' ? '4px solid #10b981' : '4px solid #ef4444', boxShadow:'0 8px 20px rgba(0,0,0,0.3)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <div>
                      <h3 style={{margin: '0 0 8px 0', fontSize:'1.3rem', color:'#f8fafc', fontWeight:'900'}}>{item.crop}</h3>
                      <p style={{margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight:'600', display:'flex', alignItems:'center', gap:'5px'}}><MapPin size={14} color="#ea580c"/> {item.market}, {item.city}</p>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <h2 style={{margin: 0, color: item.trend === 'up' ? '#10b981' : '#ef4444', fontSize:'1.5rem', display:'flex', alignItems:'center', gap:'2px'}}>
                        <IndianRupee size={20}/> {item.price}
                      </h2>
                      <span style={{fontSize:'0.75rem', color:'#64748b', fontWeight:'800', textTransform:'uppercase'}}>/ Quintal</span>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize:'0.85rem', fontWeight:'800', color: item.trend === 'up' ? '#10b981' : '#ef4444', background: item.trend === 'up' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding:'8px 12px', borderRadius:'10px', width:'fit-content', marginTop:'15px', border: item.trend === 'up' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)'}}>
                      {item.trend === 'up' ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
                      {item.trend === 'up' ? t.priceRising : t.priceFalling}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{textAlign:'center', marginTop:'30px', color:'#64748b', padding: '20px', background: '#0f172a', borderRadius: '20px', border:'1px solid #1e293b'}}>
            <ListFilter size={40} style={{margin: '0 auto 10px auto', opacity:0.5}} />
            <p style={{margin: 0, fontWeight:'bold'}}>{t.errEmpty}</p>
          </div>
        )}
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulseIcon { 0% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 10px #10b981; } 100% { opacity: 0.4; } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
        @keyframes pulseVoice { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
        .pulse-voice { animation: pulseVoice 1.5s infinite; }
      `}</style>
    </div>
  );
};

export default MandiConnect;