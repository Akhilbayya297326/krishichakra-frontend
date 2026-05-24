import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  PlayCircle, Mic, Search, BookOpen, Loader, Sparkles, 
  Youtube, MicOff, TrendingUp, Info, ArrowLeft, Zap, Play 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getVidyaInfo } from './gemini';

const VidyaVani = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('tech'); 
  const [aiInfo, setAiInfo] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English', name: 'Farmer' };

  // --- 🌍 MULTILINGUAL UI TRANSLATIONS ---
  const ui = {
    English: {
      title: "Vidya Vani", sub: "NEURAL KNOWLEDGE HUB", placeholder: "Identify Crop (e.g., Cotton)...",
      listening: "LISTENING...", loading: "DECODING DATA...", featured: "PHASE-ALIGNED LESSONS",
      watchBtn: "INITIALIZE VIDEO", trendingTitle: "TRENDING PROTOCOLS",
      aiInsights: "AI ANALYTICS", goBack: "RESET TO TRENDING"
    },
    Hindi: {
      title: "विद्या वाणी", sub: "न्यूरल ज्ञान केंद्र", placeholder: "फसल खोजें (जैसे: कपास)...",
      listening: "सुन रहा हूँ...", loading: "डाटा डिकोడింగ్...", featured: "सिफारिशी पाठ",
      watchBtn: "वीडियो शुरू करें", trendingTitle: "ट्रेंडिंग तकनीक",
      aiInsights: "AI फसल विश्लेषण", goBack: "वापस जाएं"
    },
    Telugu: {
      title: "విద్యా వాణి", sub: "న్యూరల్ నాలెడ్జ్ హబ్", placeholder: "పంటను వెతకండి (ఉదా: పత్తి)...",
      listening: "వింటున్నాను...", loading: "డేటా డీకోడింగ్...", featured: "సిఫార్సు చేయబడిన పాఠాలు",
      watchBtn: "వీడియో ప్రారంభించు", trendingTitle: "ట్రెండింగ్ టెక్నాలజీ",
      aiInsights: "AI పంట విశ్లేషణ", goBack: "రీసెట్ చేయండి"
    }
  };

  const t = ui[user.lang] || ui['English'];

  // --- 📺 STATIC VIDEO DATABASE ---
  const videoDB = {
    cotton: [
      { id: 'gtPHQvYyX48', title: { en: "Cotton Disease Management", hi: "कपास रोग प्रबंधन", te: "పత్తి వ్యాధుల నిర్వహణ" } },
      { id: 'FFCUvpoQAVQ', title: { en: "Cotton Fertilizer Management", hi: "कपास उर्वरక प्रबंधन", te: "పత్తి ఎరువుల నిర్వహణ" } }
    ],
    paddy: [
      { id: '-o2qVRbXdlk', title: { en: "Paddy Plant Diseases", hi: "धान के रोग", te: "వరి పంట వ్యాధులు" } },
      { id: 'QHZ1Z8T3oUM', title: { en: "Paddy Disease Prevention", hi: "धान रोग रोकथाम", te: "వరి వ్యాధుల నివారణ" } }
    ],
    vegetables: [
      { id: '0dNegPO8o_g', title: { en: "Vegetable Growing Techniques", hi: "सब्जी उगाने की तकनीक", te: "కూరగాయలు పండించే విధానం" } },
      { id: 'NSuodo1Magc', title: { en: "Advanced Vegetable Farming", hi: "उन्नत सब्जी खेती", te: "అధునాతన కూరగాయల సాగు" } }
    ],
    tech: [
      { id: 'FLhMcM88EvM', title: { en: "New Agriculture Tech in India", hi: "भारत में नई कृषि तकनीक", te: "భారతదేశంలో కొత్త వ్యవసాయ టెక్నాలజీ" } },
      { id: 'jh9lO3RUEHo', title: { en: "Agricultural Drones", hi: "कृषि ड्रोन", te: "వ్యవసాయ డ్రోన్లు" } }
    ]
  };

  const getCategory = (query) => {
    const q = query.toLowerCase();
    if (q.includes('cotton') || q.includes('పత్తి')) return 'cotton';
    if (q.includes('paddy') || q.includes('వరి')) return 'paddy';
    if (q.includes('veg') || q.includes('కూరగాయలు')) return 'vegetables';
    return 'tech';
  };

  const handleSearch = async (query) => {
    if (!query || query.trim() === "") return;
    setLoading(true);
    setAiInfo('');
    const category = getCategory(query);
    setActiveCategory(category);
    try {
      if (category !== 'tech') {
        const aiResponse = await getVidyaInfo(query, user.lang);
        setAiInfo(aiResponse);
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice search is not supported.");
    const recognition = new SpeechRecognition();
    recognition.lang = user.lang === 'Telugu' ? 'te-IN' : user.lang === 'Hindi' ? 'hi-IN' : 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      handleSearch(transcript); 
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (location.state && location.state.search) {
      setSearchTerm(location.state.search);
      handleSearch(location.state.search);
    }
  }, [location]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '120px', fontFamily: '"Inter", sans-serif' }}>
      
      {/* 1. HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(234, 179, 8, 0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <button onClick={() => navigate('/home')} style={{background:'rgba(234, 179, 8, 0.1)', border:'1px solid rgba(234, 179, 8, 0.3)', color:'#eab308', padding:'10px', borderRadius:'12px', cursor:'pointer'}}>
              <ArrowLeft size={24}/>
            </button>
            <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                <div className="pulse-dot" style={{width: '8px', height: '8px', background: '#eab308', borderRadius: '50%'}}></div>
                <p style={{margin:0, color:'#eab308', fontSize:'0.7rem', fontWeight:'900', letterSpacing: '2px'}}>{t.sub}</p>
              </div>
              <h2 style={{margin:0, fontSize:'1.6rem', fontWeight:'900', letterSpacing:'-0.5px'}}>{t.title}</h2>
            </div>
          </div>
          <Zap size={28} color="#eab308" className="pulse-icon" />
        </div>
      </div>

      {/* 2. NEURAL SEARCH BAR */}
      <div style={{ padding: '20px' }}>
        <div style={{ background: '#0f172a', padding: '10px', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#020617', padding: '0 15px', borderRadius: '18px', flex: 1, border: '1px solid #1e293b' }}>
            <Search size={20} color="#eab308"/>
            <input 
              type="text" value={searchTerm} placeholder={t.placeholder} 
              style={{ border: 'none', background: 'transparent', marginLeft: '10px', outline: 'none', width: '100%', fontSize: '1rem', color: '#f8fafc', height: '50px' }}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
            />
          </div>
          <button onClick={startVoiceSearch} style={{ background: isListening ? '#ef4444' : 'rgba(234, 179, 8, 0.1)', color: isListening ? 'white' : '#eab308', border: `1px solid ${isListening ? '#ef4444' : 'rgba(234, 179, 8, 0.3)'}`, width: '55px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {isListening ? <MicOff size={24} className="pulse" /> : <Mic size={24} />}
          </button>
          <button onClick={() => handleSearch(searchTerm)} disabled={loading} style={{ background: 'linear-gradient(135deg, #eab308 0%, #a16207 100%)', color: 'white', border: 'none', width: '55px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)' }}>
            {loading ? <Loader className="spin" size={24}/> : <Sparkles size={24} />}
          </button>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        
        {/* 3. AI ANALYTICS CARD */}
        {aiInfo && !loading && (
          <div className="fade-in" style={{ background: 'linear-gradient(145deg, #0f172a 0%, #020617 100%)', borderRadius: '24px', padding: '25px', marginBottom: '25px', border: '1px solid #1e293b', borderLeft: '4px solid #eab308', boxShadow: '0 8px 30px rgba(0,0,0,0.4)' }}>
            <h3 style={{margin:'0 0 15px 0', color:'#eab308', display:'flex', alignItems:'center', gap:'10px', fontSize:'1.1rem', fontWeight:'900', letterSpacing:'1.5px'}}>
              <Info size={20}/> {t.aiInsights}
            </h3>
            <div style={{color:'#cbd5e1', lineHeight:'1.8', fontSize:'1rem'}}>
              <ReactMarkdown>{aiInfo}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* 4. VIDEO FEED */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '20px' }}>
          <TrendingUp size={14} /> {activeCategory === 'tech' ? t.trendingTitle : t.featured}
        </div>

        {!loading && videoDB[activeCategory]?.map((video, index) => {
          const localizedTitle = video.title[user.lang === 'Telugu' ? 'te' : user.lang === 'Hindi' ? 'hi' : 'en'];
          return (
            <div key={index} className="fade-in" style={{ background: '#0f172a', borderRadius: '28px', overflow: 'hidden', marginBottom: '25px', border: '1px solid #1e293b', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ position: 'relative', width: '100%', height: '200px', backgroundImage: `url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div style={{position:'absolute', top:0, left:0, right:0, bottom:0, background:'rgba(2, 6, 23, 0.4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(234, 179, 8, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(234, 179, 8, 0.5)' }}>
                      <Play fill="white" size={28} color="white" />
                   </div>
                </div>
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#f8fafc', fontWeight: '800', lineHeight: '1.5' }}>
                  {localizedTitle}
                </h3>
                <button 
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
                  style={{ width: '100%', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', padding: '16px', borderRadius: '18px', fontSize: '1rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  <Youtube size={22} /> {t.watchBtn}
                </button>
              </div>
            </div>
          );
        })}

        {activeCategory !== 'tech' && (
          <button onClick={() => {setActiveCategory('tech'); setSearchTerm(''); setAiInfo('');}} style={{width: '100%', padding: '15px', background: 'transparent', border: '1px solid #1e293b', color: '#64748b', fontWeight: '900', fontSize: '0.8rem', borderRadius: '16px', letterSpacing: '1px', marginBottom: '30px'}}>
            {t.goBack}
          </button>
        )}
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out backwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .spin { animation: spin 1s linear infinite; } 
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .pulse-icon { animation: pulseIcon 2s infinite ease-in-out; }
        @keyframes pulseIcon { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
        .pulse-dot { animation: pulseDot 2s infinite ease-in-out; }
        @keyframes pulseDot { 0% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 10px #eab308; } 100% { opacity: 0.4; } }
      `}</style>
    </div>
  );
};

export default VidyaVani;