'use client';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function CalculadoraNeuronal() {
  const [modelSuma, setModelSuma] = useState<tf.LayersModel | null>(null);
  const [modelResta, setModelResta] = useState<tf.LayersModel | null>(null);
  
  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);
  const [modo, setModo] = useState<'suma' | 'resta'>('suma');
  const [estadoCarga, setEstadoCarga] = useState('Iniciando sistema...');
  const [calculando, setCalculando] = useState(false);

  useEffect(() => {
    async function cargarModelos() {
      try {
        const v = Date.now();
        console.log("Cargando cerebro suma...");
        const mSuma = await tf.loadLayersModel(`/suma/model.json?v=${v}`);
        console.log("Cargando cerebro resta...");
        const mResta = await tf.loadLayersModel(`/resta/model.json?v=${v}`);

        setModelSuma(mSuma);
        setModelResta(mResta);
        setEstadoCarga('Sistema en línea');
      } catch (error) {
        console.error("Error:", error);
        setEstadoCarga('Error de conexión neuronal');
      }
    }
    cargarModelos();
  }, []);

  const calcular = async () => {
    const modeloActivo = modo === 'suma' ? modelSuma : modelResta;

    if (modeloActivo && valA !== '' && valB !== '') {
      setCalculando(true);
      setResultado(null);
      await new Promise(r => setTimeout(r, 400)); // Efecto de procesando

      const a = parseFloat(valA);
      const b = parseFloat(valB);
      const inputTensor = tf.tensor2d([[a, b]], [1, 2]);
      const prediccion = modeloActivo.predict(inputTensor) as tf.Tensor;
      const valor = prediccion.dataSync()[0];

      setResultado(valor.toFixed(2));
      inputTensor.dispose();
      prediccion.dispose();
      setCalculando(false);
    }
  };

  const colorTema = modo === 'suma' ? '#00f2ff' : '#ff0055'; 
  const colorFondo = modo === 'suma' 
    ? 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' 
    : 'linear-gradient(135deg, #2b0515 0%, #4a0e23 50%, #5e1329 100%)';

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400;700&display=swap');
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes glow { 0% { text-shadow: 0 0 5px ${colorTema}; } 50% { text-shadow: 0 0 20px ${colorTema}, 0 0 30px ${colorTema}; } 100% { text-shadow: 0 0 5px ${colorTema}; } }
        .glass-panel {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        input::placeholder { color: rgba(255, 255, 255, 0.3); }
        input:focus { border-color: ${colorTema} !important; box-shadow: 0 0 15px ${colorTema}40; }
      `}</style>

      <main style={{ 
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
        background: colorFondo, fontFamily: "'Roboto', sans-serif", color: 'white', transition: 'background 0.5s ease'
      }}>
        
        <div className="glass-panel" style={{ 
          padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '500px', 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', animation: 'float 6s ease-in-out infinite'
        }}>
          
          {/* HEADER CORREGIDO: Usamos text-shadow en lugar de gradiente para estabilidad */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ 
              display: 'inline-block', padding: '5px 15px', borderRadius: '20px', 
              background: modelSuma && modelResta ? 'rgba(0, 255, 128, 0.2)' : 'rgba(255, 0, 0, 0.2)',
              border: `1px solid ${modelSuma && modelResta ? '#00ff80' : '#ff0000'}`,
              fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '15px',
              color: modelSuma && modelResta ? '#00ff80' : '#ff0000'
            }}>
              ● {estadoCarga.toUpperCase()}
            </div>
            
            <h1 style={{ 
              fontFamily: "'Orbitron', sans-serif", 
              fontSize: '2.5rem', 
              margin: '0',
              color: '#ffffff', // Color base sólido
              textShadow: `0 0 10px ${colorTema}, 0 0 20px ${colorTema}`, // El brillo cambia, no el texto
              transition: 'text-shadow 0.3s ease' // Transición suave del color
            }}>
              Calculadora Neuronal
            </h1>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '5px' }}>Powered by Estudiantes de Sistemas</p>
          </div>

          {/* SELECTOR */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '5px', marginBottom: '30px' }}>
            <button
              onClick={() => { setModo('suma'); setResultado(null); }}
              style={{
                flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: modo === 'suma' ? '#00f2ff' : 'transparent',
                color: modo === 'suma' ? '#000' : '#fff',
                fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', transition: 'all 0.3s'
              }}
            >
              SUMA (+)
            </button>
            <button
              onClick={() => { setModo('resta'); setResultado(null); }}
              style={{
                flex: 1, padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: modo === 'resta' ? '#ff0055' : 'transparent',
                color: modo === 'resta' ? '#fff' : '#fff',
                fontWeight: 'bold', fontFamily: "'Orbitron', sans-serif", letterSpacing: '1px', transition: 'all 0.3s'
              }}
            >
              RESTA (-)
            </button>
          </div>

          {/* INPUTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>ENTRADA A</label>
              <input type="number" value={valA} onChange={(e) => setValA(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: "'Orbitron', sans-serif", transition: 'all 0.3s' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', opacity: 0.7, marginBottom: '5px' }}>ENTRADA B</label>
              <input type="number" value={valB} onChange={(e) => setValB(e.target.value)} placeholder="0.00"
                style={{ width: '100%', padding: '15px', fontSize: '18px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none', fontFamily: "'Orbitron', sans-serif", transition: 'all 0.3s' }} />
            </div>
          </div>

          {/* BOTÓN */}
          <button onClick={calcular} disabled={!modelSuma || !modelResta || calculando}
            style={{
              width: '100%', padding: '18px', fontSize: '16px', fontWeight: 'bold', color: 'white',
              background: calculando ? '#555' : colorTema, border: 'none', borderRadius: '12px',
              cursor: calculando ? 'wait' : 'pointer', textTransform: 'uppercase', letterSpacing: '2px',
              fontFamily: "'Orbitron', sans-serif", boxShadow: calculando ? 'none' : `0 0 20px ${colorTema}60`,
              transform: 'scale(1)', transition: 'all 0.2s', opacity: (!modelSuma || !modelResta) ? 0.5 : 1
            }}
          >
            {calculando ? 'PROCESANDO...' : 'EJECUTAR NEURONA'}
          </button>

          {/* RESULTADO */}
          <div style={{ marginTop: '30px', padding: '25px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: `1px solid ${resultado ? colorTema : 'rgba(255,255,255,0.1)'}`, textAlign: 'center', position: 'relative', overflow: 'hidden', transition: 'all 0.5s' }}>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px', marginBottom: '5px' }}>SALIDA DE PREDICCIÓN</div>
            {resultado ? (
              <div style={{ fontSize: '48px', fontFamily: "'Orbitron', sans-serif", fontWeight: 'bold', color: colorTema, animation: 'glow 2s infinite ease-in-out' }}>{resultado}</div>
            ) : (
              <div style={{ fontSize: '24px', opacity: 0.2, fontFamily: "'Orbitron', sans-serif" }}>--.--</div>
            )}
            <div style={{ position: 'absolute', bottom: '0', left: '0', height: '2px', width: '100%', background: colorTema, opacity: 0.5 }}></div>
          </div>

        </div>
      </main>
    </>
  );
}