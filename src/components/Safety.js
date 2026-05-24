import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Phone, AlertTriangle, ThermometerSun, 
  Syringe, ArrowLeft, ShieldCheck, LifeBuoy, HeartPulse, 
  Zap, Wind, Flame, Droplets, MapPin
} from 'lucide-react';

const Safety = () => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('krishiUser')) || { lang: 'English' };

  // --- 🌍 MULTILINGUAL DICTIONARY (RESTORED & EXPANDED) ---
  const translations = {
    English: {
      title: "Raksha Protocol", subtitle: "NEURAL SAFETY & PROTECTION",
      sosTitle: "CRITICAL EMERGENCY?", sosDesc: "Immediate dispatch of medical assistance.", callBtn: "ACTIVATE SOS 108",
      guidelines: "OPERATIONAL SAFETY PROTOCOLS",
      disasterTitle: "NDRF Disaster Protocol",
      disasterPoints: [
        "Flood: Move livestock and grain to high elevation immediately.",
        "Cyclone: Secure all loose equipment and seek reinforced shelter.",
        "Fire: Establish a 10ft dirt perimeter around dry crops.",
        "Helpline: Contact NDRF at 011-24363260 for field rescue."
      ],
      snakeTitle: "Biological Hazard (Snake Bite)",
      snakePoints: [
        "Zero Movement: Do not walk or move the bitten limb.",
        "Heart Level: Keep the bite area below the heart.",
        "No Suction: Traditional 'venom sucking' is strictly prohibited.",
        "Clinical Link: Transport to the nearest serum center immediately."
      ],
      pestTitle: "Chemical Safety Matrix",
      pestPoints: [
        "Neural Gear: Wear specialized masks and chemical-grade gloves.",
        "Wind Vector: Never spray against current wind direction.",
        "Neutralize: Bathe and wash all gear immediately post-application."
      ],
      directoryTitle: "Agri-Emergency Directory",
      kisanCall: "Kisan Call Center (Expert Advice)",
      police: "Local Law Enforcement",
      fire: "Fire Services",
      electricity: "Power Grid Issues"
    },
    Hindi: {
      title: "रक्षा प्रोटोकॉल", subtitle: "क्षेत्रीय सुरक्षा और संरक्षण",
      sosTitle: "आपातकालीन स्थिति?", sosDesc: "चिकित्सा सहायता के लिए तुरंत कॉल करें।", callBtn: "SOS 108 सक्रिय करें",
      guidelines: "सुरक्षा दिशानिर्देश",
      disasterTitle: "NDRF आपदा प्रोटोकॉल",
      disasterPoints: [
        "बाढ़: पशुधन और अनाज को तुरंत ऊंचाई पर ले जाएं।",
        "चक्रवात: ढीले उपकरणों को सुरक्षित करें और आश्रय लें।",
        "आग: सूखी फसलों के चारों ओर 10 फीट की मिट्टी का घेरा बनाएं।",
        "NDRF हेल्पलाइन: बचाव के लिए 011-24363260 पर संपर्क करें।"
      ],
      snakeTitle: "सांप के काटने पर प्रोटोकॉल",
      snakePoints: [
        "स्थिर रहें: काटे हुए अंग को बिल्कुल न हिलाएं।",
        "हृदय स्तर: घाव को हृदय के स्तर से नीचे रखें।",
        "चूसें नहीं: जहर चूसने का प्रयास सख्त मना है।",
        "अस्पताल: तुरंत एंटी-वेनम सेंटर पहुंचें।"
      ],
      pestTitle: "कीटनाशक सुरक्षा मैट्रिक्स",
      pestPoints: [
        "सुरक्षा गियर: मास्क और दस्ताने का प्रयोग अनिवार्य है।",
        "हवा की दिशा: हवा के विपरीत दिशा में स्प्रे न करें।",
        "स्नान: छिड़काव के बाद तुरंत स्नान करें।"
      ],
      directoryTitle: "कृषि आपातकालीन निर्देशिका",
      kisanCall: "किसान कॉल सेंटर (सलाह)",
      police: "पुलिस सहायता",
      fire: "दमकल सेवा",
      electricity: "बिजली विभाग"
    },
    Telugu: {
      title: "రక్ష ప్రోటోకాల్", subtitle: "పొలంలో భద్రత మరియు రక్షణ",
      sosTitle: "అత్యవసర పరిస్థితా?", sosDesc: "వెంటనే వైద్య సహాయం పొందండి.", callBtn: "SOS 108 కాల్ చేయండి",
      guidelines: "భద్రతా సూచనలు",
      disasterTitle: "NDRF విపత్తు ప్రోటోకాల్",
      disasterPoints: [
        "వరదలు: పశువులను, ధాన్యాన్ని వెంటనే ఎత్తైన ప్రాంతాలకు తరలించండి.",
        "తుఫాను: వదులుగా ఉన్న యంత్రాలను సురక్షితం చేయండి.",
        "మంటలు: పొడి పంటల చుట్టూ 10 అడుగుల దూరం మట్టితో కందకం చేయండి.",
        "NDRF హెల్ప్‌లైన్: సహాయం కోసం 011-24363260 కి కాల్ చేయండి."
      ],
      snakeTitle: "పాము కాటు జాగ్రత్తలు",
      snakePoints: [
        "కదల్చకండి: కాటు వేసిన భాగాన్ని అస్సలు కదల్చవద్దు.",
        "గుండె స్థాయి: కాటు వేసిన భాగాన్ని గుండె కంటే తక్కువ ఎత్తులో ఉంచండి.",
        "పీల్చవద్దు: విషాన్ని నోటితో పీల్చడం ప్రాణాపాయం.",
        "ఆసుపత్రి: వెంటనే యాంటీ వీనం ఉన్న ఆసుపత్రికి వెళ్ళండి."
      ],
      pestTitle: "పురుగు మందుల జాగ్రత్తలు",
      pestPoints: [
        "రక్షణ కవచం: మాస్క్ మరియు గ్లౌజులు తప్పక ధరించాలి.",
        "గాలి దిశ: గాలికి ఎదురుగా మందు కొట్టవద్దు.",
        "స్నానం: మందు కొట్టిన వెంటనే స్నానం చేయాలి."
      ],
      directoryTitle: "అత్యవసర ఫోన్ నంబర్లు",
      kisanCall: "కిసాన్ కాల్ సెంటర్ (సలహాల కోసం)",
      police: "పోలీస్ స్టేషన్",
      fire: "ఫైర్ సర్వీస్",
      electricity: "విద్యుత్ శాఖ"
    }
  };

  const t = translations[user.lang] || translations['English'];

  const emergencyNumbers = [
    { name: t.kisanCall, number: "1551", icon: <LifeBuoy size={20} color="#10b981"/> },
    { name: t.police, number: "100", icon: <ShieldCheck size={20} color="#38bdf8"/> },
    { name: t.fire, number: "101", icon: <Flame size={20} color="#ef4444"/> },
    { name: t.electricity, number: "1912", icon: <Zap size={20} color="#eab308"/> }
  ];

  const handleCall = (num) => window.open(`tel:${num}`);

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', paddingBottom: '120px', fontFamily: '"Inter", sans-serif'}}>
      
      {/* HUD HEADER */}
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', padding: '35px 20px 25px 20px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
          <button onClick={() => navigate('/home')} style={{background:'rgba(239, 68, 68, 0.1)', border:'1px solid rgba(239, 68, 68, 0.3)', color:'#ef4444', padding:'10px', borderRadius:'12px', cursor:'pointer'}}>
            <ArrowLeft size={24}/>
          </button>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
              <div className="pulse-dot-red" style={{width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%'}}></div>
              <p style={{margin:0, color:'#ef4444', fontSize:'0.75rem', fontWeight:'800', letterSpacing: '2px'}}>{t.subtitle}</p>
            </div>
            <h2 style={{margin:0, fontSize:'1.6rem', fontWeight:'900', letterSpacing:'-0.5px'}}>{t.title}</h2>
          </div>
        </div>
      </div>

      <div style={{padding: '20px'}}>
        
        {/* SOS TERMINAL */}
        <div className="fade-in" style={{ background: 'linear-gradient(135deg, #450a0a 0%, #020617 100%)', borderRadius: '24px', padding: '25px', border: '2px solid #ef4444', boxShadow: '0 0 30px rgba(239, 68, 68, 0.2)', textAlign: 'center', marginBottom: '30px' }}>
          <AlertTriangle size={40} color="#ef4444" style={{marginBottom: '10px'}} className="shake-icon"/>
          <h3 style={{margin:'0 0 5px 0', color:'#f8fafc', fontSize:'1.2rem', fontWeight:'900'}}>{t.sosTitle}</h3>
          <p style={{color:'#94a3b8', fontSize:'0.85rem', marginBottom:'20px'}}>{t.sosDesc}</p>
          <button onClick={() => handleCall("108")} style={{ width: '100%', background: '#ef4444', color: 'white', border: 'none', padding: '18px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)' }}>
            <Phone size={24} /> {t.callBtn}
          </button>
        </div>

        {/* GUIDELINES GRID */}
        <div style={sectionHeaderStyle}><ShieldCheck size={14} /> {t.guidelines}</div>

        {/* 1. NDRF DISASTER PROTOCOL */}
        <div className="fade-in" style={{...cardStyle, borderLeft: '4px solid #f97316'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'15px'}}>
            <div style={iconBoxStyle('#f97316')}><Wind size={24}/></div>
            <h3 style={cardTitleStyle}>{t.disasterTitle}</h3>
          </div>
          <ul style={listStyle}>
            {t.disasterPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        {/* 2. SNAKE BITE */}
        <div className="fade-in" style={{...cardStyle, borderLeft: '4px solid #ef4444'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'15px'}}>
            <div style={iconBoxStyle('#ef4444')}><Syringe size={24}/></div>
            <h3 style={cardTitleStyle}>{t.snakeTitle}</h3>
          </div>
          <ul style={listStyle}>
            {t.snakePoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        {/* 3. PESTICIDE SAFETY */}
        <div className="fade-in" style={{...cardStyle, borderLeft: '4px solid #eab308'}}>
          <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'15px'}}>
            <div style={iconBoxStyle('#eab308')}><ShieldAlert size={24}/></div>
            <h3 style={cardTitleStyle}>{t.pestTitle}</h3>
          </div>
          <ul style={listStyle}>
            {t.pestPoints.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>

        {/* 4. EMERGENCY DIRECTORY */}
        <div style={sectionHeaderStyle}><MapPin size={14} /> {t.directoryTitle}</div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
          {emergencyNumbers.map((item, idx) => (
            <div key={idx} onClick={() => handleCall(item.number)} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '18px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
              {item.icon}
              <span style={{fontSize:'0.8rem', fontWeight:'800', color:'#f8fafc', marginTop:'10px', textAlign:'center'}}>{item.name}</span>
              <span style={{fontSize:'0.7rem', color:'#38bdf8', fontWeight:'900', marginTop:'4px'}}>{item.number}</span>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-out backwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-dot-red { animation: pulseRed 2s infinite ease-in-out; }
        @keyframes pulseRed { 0% { opacity: 0.4; } 50% { opacity: 1; box-shadow: 0 0 10px #ef4444; } 100% { opacity: 0.4; } }
        @keyframes shake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
        .shake-icon { animation: shake 0.5s infinite linear; }
      `}</style>
    </div>
  );
};

const sectionHeaderStyle = { display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '15px', marginTop: '10px' };
const cardStyle = { background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b', marginBottom: '20px' };
const iconBoxStyle = (color) => ({ width: '45px', height: '45px', borderRadius: '12px', background: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const cardTitleStyle = { margin: 0, fontSize: '1rem', fontWeight: '900', color: '#f8fafc' };
const listStyle = { paddingLeft: '20px', color: '#94a3b8', lineHeight: '1.7', fontSize: '0.9rem', fontWeight: '600' };

export default Safety;