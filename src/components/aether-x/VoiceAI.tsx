'use client';

import React, { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/aether-x/SoundEngine';
import { Mic, MicOff, Globe, Sparkles } from 'lucide-react';

interface PresetQuery {
  lang: 'en' | 'hi' | 'es';
  queryText: string;
  responseText: string;
}

export const VoiceAI: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'es'>('en');
  const [responseText, setResponseText] = useState('AETHER-X listening. Select query or trigger microphone.');
  const [waveScale, setWaveScale] = useState(1);

  const presets: PresetQuery[] = [
    {
      lang: 'en',
      queryText: 'Forecast operations impact if Suez Channel closes.',
      responseText: 'AETHER Analysis: Rerouting vessels via southern Cape increases CapEx by $4.2M. Transit latency +4.2 days. Exemption tariff codes activated.',
    },
    {
      lang: 'hi',
      queryText: 'सुएज नहर संकट का वित्तीय प्रभाव दिखाएं।',
      responseText: 'एथर विश्लेषण: सुएज नहर बंद होने से $4.2M का वित्तीय प्रभाव पड़ेगा। वैकल्पिक मार्ग सक्रिय कर दिया गया है।',
    },
    {
      lang: 'es',
      queryText: 'Pronosticar el impacto si falla el proveedor Apex.',
      responseText: 'Análisis AETHER: La falla total del proveedor Apex genera un riesgo de bloqueo de red de 87% y pérdidas de $28.5M si no se mitiga.',
    },
  ];
 
  const speakResponse = (text: string, langCode: 'en' | 'hi' | 'es') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (langCode === 'hi') {
      utterance.lang = 'hi-IN';
    } else if (langCode === 'es') {
      utterance.lang = 'es-ES';
    } else {
      utterance.lang = 'en-US';
    }
    utterance.pitch = 1.15;
    utterance.rate = 1.02;
    window.speechSynthesis.speak(utterance);
  };

  // Real Speech Recognition initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    if (selectedLanguage === 'hi') {
      recognition.lang = 'hi-IN';
    } else if (selectedLanguage === 'es') {
      recognition.lang = 'es-ES';
    } else {
      recognition.lang = 'en-US';
    }

    recognition.onstart = () => {
      setIsListening(true);
      setResponseText('Aether-X listening... Speak now.');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setResponseText(`Speech Decoded: "${transcript}"`);
      
      // Match query phrases to generate smart responses
      setTimeout(() => {
        let reply = "Aether Voice Core matches query. Calibrating operations matrices.";
        const lowerText = transcript.toLowerCase();
        
        if (selectedLanguage === 'hi') {
          if (lowerText.includes('नहर') || lowerText.includes('वित्तीय')) {
            reply = 'एथर विश्लेषण: सुएज नहर बंद होने से $4.2M का वित्तीय प्रभाव पड़ेगा। वैकल्पिक मार्ग सक्रिय कर दिया गया है।';
          } else {
            reply = `एथर प्रणाली ने आपकी आवाज़ पहचान ली है: "${transcript}"।`;
          }
        } else if (selectedLanguage === 'es') {
          if (lowerText.includes('proveedor') || lowerText.includes('apex')) {
            reply = 'Análisis AETHER: La falla total del proveedor Apex genera un riesgo de bloqueo de red de 87% y pérdidas de $28.5M si no se mitiga.';
          } else {
            reply = `Sistema AETHER decodificó su voz: "${transcript}".`;
          }
        } else {
          if (lowerText.includes('suez') || lowerText.includes('channel') || lowerText.includes('closure')) {
            reply = 'AETHER Analysis: Rerouting vessels via Cape increases CapEx by $4.2M. Transit latency +4.2 days.';
          } else if (lowerText.includes('reactor') || lowerText.includes('leak') || lowerText.includes('hydrogen')) {
            reply = 'Reactor Core Diagnostic: Pressure delta has stabilized. Residual leakage rate is 0.00%.';
          } else if (lowerText.includes('risk') || lowerText.includes('cyber')) {
            reply = 'War Room Threat Scan: Intrusion firewall blocked 4 vectors. Cape routing secure.';
          } else {
            reply = `AETHER decrypted speech: "${transcript}". Core consciousness aligns with your query.`;
          }
        }

        setResponseText(reply);
        setIsListening(false);
        soundEngine.playLaunch();
        speakResponse(reply, selectedLanguage);
      }, 1500);
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech recognition error", e);
      // Gracefully shift to simulation on error
      setResponseText('Aether-X listening (simulated)... Speak now.');
      setIsListening(true);
    };

    recognition.onend = () => {
      // Do not force disable listening immediately to allow simulation to complete
    };

    (window as any).aetherSpeechRecognition = recognition;
  }, [selectedLanguage]);

  // Fluctuate waveform heights when listening
  useEffect(() => {
    if (!isListening) {
      setWaveScale(1);
      return;
    }

    const interval = setInterval(() => {
      setWaveScale(0.6 + Math.random() * 0.9);
    }, 150);

    return () => clearInterval(interval);
  }, [isListening]);

  // Simulated speech decoder timeout fallback
  useEffect(() => {
    if (!isListening) return;

    const timer = setTimeout(() => {
      let queryText = '';
      let replyText = '';

      if (selectedLanguage === 'hi') {
        queryText = 'सुएज नहर संकट का वित्तीय प्रभाव दिखाएं।';
        replyText = 'एथर विश्लेषण: सुएज नहर बंद होने से $4.2M का वित्तीय प्रभाव पड़ेगा। वैकल्पिक मार्ग सक्रिय कर दिया गया है।';
      } else if (selectedLanguage === 'es') {
        queryText = 'Pronosticar el impacto si falla el proveedor Apex.';
        replyText = 'Análisis AETHER: La falla total del proveedor Apex genera un riesgo de bloqueo de red de 87% y pérdidas de $28.5M si no se mitiga.';
      } else {
        queryText = 'Forecast operations impact if Suez Channel closes.';
        replyText = 'AETHER Analysis: Rerouting vessels via Cape increases CapEx by $4.2M. Transit latency +4.2 days.';
      }

      setResponseText(`Decoded voice: "${queryText}"`);
      soundEngine.playCyberSweep();

      setTimeout(() => {
        setResponseText(replyText);
        setIsListening(false);
        soundEngine.playLaunch();
        speakResponse(replyText, selectedLanguage);
      }, 1500);

    }, 4500);

    return () => clearTimeout(timer);
  }, [isListening, selectedLanguage]);

  const toggleMic = () => {
    if (typeof window === 'undefined') return;
    soundEngine.playClick();
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    const recognition = (window as any).aetherSpeechRecognition;
    if (recognition) {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
        setResponseText('Vocal interface standby.');
        soundEngine.stopAmbientHum();
      } else {
        try {
          recognition.start();
          soundEngine.startAmbientHum();
        } catch (e) {
          setIsListening(true);
          setResponseText('Vocal interface active (Simulated). Speak now.');
          soundEngine.startAmbientHum();
        }
      }
    } else {
      setIsListening(!isListening);
      if (!isListening) {
        setResponseText('Vocal interface active (Simulated). Speak now.');
        soundEngine.startAmbientHum();
      } else {
        setResponseText('Vocal interface standby.');
        soundEngine.stopAmbientHum();
      }
    }
  };

  const handlePresetClick = (preset: PresetQuery) => {
    setIsListening(true);
    soundEngine.playCyberSweep();
    setResponseText('Decoding vocal envelope...');
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    setTimeout(() => {
      setResponseText(preset.responseText);
      setIsListening(false);
      soundEngine.playLaunch();
      speakResponse(preset.responseText, preset.lang);
    }, 2000);
  };

  return (
    <div className="glass-panel border-cyan-500/20 bg-slate-950/70 p-5 rounded-lg flex flex-col items-center justify-between w-full h-[320px] relative overflow-hidden">
      {/* Corner glow */}
      <div className="absolute top-0 left-0 w-16 h-16 bg-cyan-500/5 rounded-full filter blur-xl" />

      {/* Header Info */}
      <div className="w-full flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 font-mono text-[9px] text-slate-400">
        <span className="flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
          <span className="font-bold text-slate-300">AETHER VOICE ASSISTANT</span>
        </span>
        <div className="flex space-x-1.5 text-[8px]">
          {(['en', 'hi', 'es'] as const).map((l) => (
            <button
              key={l}
              onClick={() => {
                setSelectedLanguage(l);
                soundEngine.playClick();
              }}
              className={`px-1.5 rounded border ${
                selectedLanguage === l ? 'border-cyan-400 text-cyan-400 font-bold bg-cyan-500/10' : 'border-slate-800 text-slate-500'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Orb Sphere Reacting */}
      <div className="relative w-28 h-28 flex items-center justify-center my-3">
        {/* Pulsing shell rings */}
        <div
          style={{
            transform: `scale(${waveScale * 1.1})`,
            transition: 'transform 0.15s ease',
          }}
          className={`absolute inset-0 rounded-full border border-cyan-500/15 animate-pulse ${
            isListening ? 'border-cyan-400/30' : ''
          }`}
        />
        <div
          style={{
            transform: `scale(${waveScale * 1.3})`,
            transition: 'transform 0.15s ease',
          }}
          className="absolute inset-4 rounded-full border border-purple-500/10 border-dashed"
        />

        {/* Central glowing orb */}
        <div
          onClick={toggleMic}
          className={`w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center cursor-pointer shadow-lg transition-all duration-300 ${
            isListening ? 'shadow-cyan-500/30 scale-105' : 'hover:scale-103'
          }`}
        >
          {isListening ? (
            <Mic className="w-6 h-6 text-slate-950 animate-bounce" />
          ) : (
            <MicOff className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      {/* Animated Waveform frequency bars */}
      <div className="flex items-center space-x-1 h-6 my-2">
        {Array.from({ length: 8 }).map((_, idx) => {
          // Dynamic random heights using transition
          const height = isListening ? 4 + Math.random() * 20 : 3;
          return (
            <div
              key={idx}
              style={{
                height: `${height}px`,
                transition: 'height 0.15s ease',
              }}
              className="w-1 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-full"
            />
          );
        })}
      </div>

      {/* Output transcription bubble */}
      <div className="w-full bg-slate-900/60 border border-slate-800/80 p-2.5 rounded text-center font-mono text-[10px] text-slate-300 min-h-[55px] flex items-center justify-center select-text">
        "{responseText}"
      </div>

      {/* Quick Vocal Presets */}
      <div className="w-full flex flex-col space-y-1.5 mt-2">
        <span className="font-mono text-[8px] text-slate-500 block uppercase">Quick presets:</span>
        <div className="grid grid-cols-1 gap-1">
          {presets
            .filter((p) => p.lang === selectedLanguage)
            .map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetClick(p)}
                className="w-full text-left p-1.5 rounded bg-slate-900/40 border border-slate-800/60 hover:border-cyan-500/30 text-slate-400 hover:text-white font-mono text-[8.5px] truncate transition-colors"
              >
                ▶ "{p.queryText}"
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceAI;
