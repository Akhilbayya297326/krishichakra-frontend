import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ShieldCheck, Zap, Crown, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

const SubscriptionGate = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 🚀 STATIC PASSCODES FOR THE PITCH
  // You can give "JUDGE-PASS" to the evaluators during your presentation
  const VALID_CODES = ['200530', 'JUDGE-PASS', 'FARMER100', 'AADHRITA-WIN'];

  const handleVerify = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    // Simulate a secure network check delay (looks more professional)
    setTimeout(() => {
      if (VALID_CODES.includes(passcode.trim().toUpperCase())) {
        // Passcode matches! Send them to the login/setup page
        navigate('/login'); 
      } else {
        setIsVerifying(false);
        setError('Invalid Activation Code. Please check your subscription receipt.');
      }
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: '"Inter", sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* BRANDING HEADER */}
      <div className="fade-in" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981', marginBottom: '15px', boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' }}>
          <ShieldCheck size={40} color="#10b981" />
        </div>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>Krishi <span style={{ color: '#10b981' }}>Chakra</span></h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '800' }}>Enterprise Neural Network</p>
      </div>

      {/* SUBSCRIPTION TIERS (To show Business Model) */}
      <div className="fade-in-delayed" style={{ display: 'flex', gap: '15px', width: '100%', maxWidth: '600px', marginBottom: '40px' }}>
        <div style={{ flex: 1, background: '#0f172a', padding: '20px', borderRadius: '24px', border: '1px solid #1e293b' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8', fontSize: '0.9rem', textTransform: 'uppercase' }}>Basic</h3>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5rem' }}>₹0<span style={{ fontSize: '0.9rem', color: '#64748b' }}>/mo</span></h2>
          <ul style={{ padding: 0, listStyle: 'none', margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.8' }}>
            <li><CheckCircle2 size={12} color="#10b981"/> Live Mandi Rates</li>
            <li><CheckCircle2 size={12} color="#10b981"/> Weather Alerts</li>
          </ul>
        </div>

        <div style={{ flex: 1, background: 'linear-gradient(145deg, #064e3b 0%, #022c22 100%)', padding: '20px', borderRadius: '24px', border: '1px solid #10b981', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1 }}><Crown size={100}/></div>
          <h3 style={{ margin: '0 0 10px 0', color: '#34d399', fontSize: '0.9rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}><Zap size={14}/> Pro Matrix</h3>
          <h2 style={{ margin: '0 0 15px 0', fontSize: '1.5rem', color: '#fff' }}>₹299<span style={{ fontSize: '0.9rem', color: '#6ee7b7' }}>/yr</span></h2>
          <ul style={{ padding: 0, listStyle: 'none', margin: 0, fontSize: '0.85rem', color: '#a7f3d0', lineHeight: '1.8' }}>
            <li><CheckCircle2 size={12} color="#34d399"/> AI Crop Doctor</li>
            <li><CheckCircle2 size={12} color="#34d399"/> Vision Grader</li>
            <li><CheckCircle2 size={12} color="#34d399"/> Sahayog Rentals</li>
          </ul>
        </div>
      </div>

      {/* ACTIVATION GATE */}
      <div className="fade-in-delayed-more" style={{ width: '100%', maxWidth: '400px', background: '#0f172a', padding: '30px', borderRadius: '28px', border: '1px solid #1e293b', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
        <Lock size={30} color="#64748b" style={{ marginBottom: '15px' }} />
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '800' }}>Enter Activation Code</h3>
        
        <form onSubmit={handleVerify}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Key size={20} color="#94a3b8" style={{ position: 'absolute', left: '15px', top: '18px' }} />
            <input 
              type="text" 
              placeholder="e.g. KRISHI-PRO-2026"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '18px 15px 18px 45px', borderRadius: '16px', background: '#020617', border: error ? '1px solid #ef4444' : '1px solid #1e293b', color: '#f8fafc', fontSize: '1.1rem', fontWeight: '800', outline: 'none', boxSizing: 'border-box', textTransform: 'uppercase', letterSpacing: '1px' }}
            />
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '-10px', marginBottom: '15px', fontWeight: '600' }}>{error}</p>}

          <button type="submit" disabled={isVerifying || !passcode} style={{ width: '100%', background: passcode ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)' : '#1e293b', color: passcode ? '#fff' : '#64748b', border: 'none', padding: '18px', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '900', cursor: passcode ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.3s ease', boxShadow: passcode ? '0 10px 25px rgba(16, 185, 129, 0.4)' : 'none' }}>
            {isVerifying ? 'VERIFYING NETWORK...' : 'UNLOCK ACCESS'} {isVerifying ? '' : <ArrowRight size={20}/>}
          </button>
        </form>
        <p style={{ margin: '20px 0 0 0', color: '#64748b', fontSize: '0.8rem' }}>Don't have a code? Contact your local Krishi Cooperative.</p>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-out backwards; }
        .fade-in-delayed { animation: fadeIn 0.5s ease-out 0.2s backwards; }
        .fade-in-delayed-more { animation: fadeIn 0.5s ease-out 0.4s backwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default SubscriptionGate;