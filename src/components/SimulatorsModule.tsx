import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Sliders, Info, Zap, Sparkles } from 'lucide-react';
import { Latex } from './Latex';
import { SimulatorTab } from '../types';

export const SimulatorsModule: React.FC = () => {
  const [activeSim, setActiveSim] = useState<SimulatorTab>('armonica');
  const [isPlaying, setIsPlaying] = useState(true);

  // ==========================================
  // ENTORNO A: Excitación Armónica
  // ==========================================
  const [mA, setMA] = useState<number>(5); // kg
  const [kA, setKA] = useState<number>(2000); // N/m
  const [cA, setCA] = useState<number>(15); // N·s/m
  const [f0A, setF0A] = useState<number>(50); // N
  const [omegaA, setOmegaA] = useState<number>(20); // rad/s

  // Cálculos A
  const omegaNA = Math.sqrt(kA / mA);
  const fnA = omegaNA / (2 * Math.PI);
  const ccA = 2 * Math.sqrt(kA * mA);
  const zetaA = cA / ccA;
  const rA = omegaA / omegaNA;
  const deltaStA = f0A / kA;
  const denomA = Math.sqrt(Math.pow(1 - rA * rA, 2) + Math.pow(2 * zetaA * rA, 2));
  const MA = 1 / denomA;
  const XA = deltaStA * MA; // m
  const phiA = Math.atan2(2 * zetaA * rA, 1 - rA * rA); // rad
  const phiDegA = (phiA * 180) / Math.PI;

  // Preset handlers A
  const setPresetA = (type: 'resonancia' | 'rigidez' | 'inercia' | 'critico') => {
    if (type === 'resonancia') {
      const targetW = Number(omegaNA.toFixed(1));
      setOmegaA(targetW);
      setCA(10);
    } else if (type === 'rigidez') {
      setOmegaA(Math.max(2, Number((omegaNA * 0.25).toFixed(1))));
    } else if (type === 'inercia') {
      setOmegaA(Number((omegaNA * 3.0).toFixed(1)));
    } else if (type === 'critico') {
      setCA(Number(ccA.toFixed(1)));
    }
  };

  // ==========================================
  // ENTORNO B: Desbalanceo Rotatorio
  // ==========================================
  const [mB, setMB] = useState<number>(50); // Masa total kg
  const [meB, setMeB] = useState<number>(0.8); // Masa excéntrica kg
  const [eB, setEB] = useState<number>(15); // Excentricidad mm
  const [zetaB, setZetaB] = useState<number>(0.08); // Razón amortiguamiento
  const [rpmB, setRpmB] = useState<number>(1200); // RPM
  const [kB, setKB] = useState<number>(80000); // Rigidez soporte N/m

  // Cálculos B
  const omegaB = (rpmB * 2 * Math.PI) / 60; // rad/s
  const omegaNB = Math.sqrt(kB / mB);
  const rpmCritB = (omegaNB * 60) / (2 * Math.PI);
  const rB = omegaB / omegaNB;
  const eMetersB = eB / 1000;
  const denomB = Math.sqrt(Math.pow(1 - rB * rB, 2) + Math.pow(2 * zetaB * rB, 2));
  const factorAdimB = (rB * rB) / denomB;
  const XB = ((meB * eMetersB) / mB) * factorAdimB; // m
  const XmmB = XB * 1000;
  const FcentrifugaB = meB * eMetersB * omegaB * omegaB; // N
  const cB = 2 * zetaB * Math.sqrt(kB * mB);
  const FT_B = XB * Math.sqrt(kB * kB + Math.pow(cB * omegaB, 2)); // Fuerza transmitida
  const phiB = Math.atan2(2 * zetaB * rB, 1 - rB * rB);
  const isNearCriticalB = rB >= 0.88 && rB <= 1.12;

  // Preset handlers B
  const setPresetB = (type: 'critico' | 'baja' | 'alta') => {
    if (type === 'critico') {
      setRpmB(Math.round(rpmCritB));
    } else if (type === 'baja') {
      setRpmB(Math.round(rpmCritB * 0.35));
    } else if (type === 'alta') {
      setRpmB(Math.min(5500, Math.round(rpmCritB * 2.8)));
    }
  };

  // ==========================================
  // ENTORNO C: Cabeceo de Flechas (Whirling)
  // ==========================================
  const [kC, setKC] = useState<number>(30000); // Rigidez flexión N/m
  const [mC, setMC] = useState<number>(8); // Masa rotor kg
  const [eC, setEC] = useState<number>(2.5); // Excentricidad mm
  const [rpmC, setRpmC] = useState<number>(1800); // RPM
  const [zetaC, setZetaC] = useState<number>(0.06); // Amortiguamiento

  // Cálculos C
  const omegaC = (rpmC * 2 * Math.PI) / 60; // rad/s
  const omegaCritC = Math.sqrt(kC / mC); // rad/s
  const rpmCritC = (omegaCritC * 60) / (2 * Math.PI);
  const rC = omegaC / omegaCritC;
  const eMetersC = eC / 1000;
  const denomC = Math.sqrt(Math.pow(1 - rC * rC, 2) + Math.pow(2 * zetaC * rC, 2));
  const rdMetersC = (eMetersC * rC * rC) / denomC; // Deflexión radial del eje
  const rdMmC = rdMetersC * 1000;
  const phiC = Math.atan2(2 * zetaC * rC, 1 - rC * rC);
  const phiDegC = (phiC * 180) / Math.PI;
  const isNearCriticalC = rC >= 0.88 && rC <= 1.12;

  // Presets C
  const setPresetC = (type: 'critico' | 'subcritico' | 'supercritico') => {
    if (type === 'critico') {
      setRpmC(Math.round(rpmCritC));
    } else if (type === 'subcritico') {
      setRpmC(Math.round(rpmCritC * 0.45));
    } else if (type === 'supercritico') {
      setRpmC(Math.min(4800, Math.round(rpmCritC * 2.4)));
    }
  };

  // ==========================================
  // ANIMATION REFS
  // ==========================================
  const canvasRefA = useRef<HTMLCanvasElement | null>(null);
  const canvasCurveRefA = useRef<HTMLCanvasElement | null>(null);
  const canvasRefB = useRef<HTMLCanvasElement | null>(null);
  const canvasRefC_Orbit = useRef<HTMLCanvasElement | null>(null);
  const canvasRefC_Shaft = useRef<HTMLCanvasElement | null>(null);

  const timeRef = useRef<number>(0);
  const historyRefA = useRef<Array<{ t: number; x: number; f: number }>>([]);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        timeRef.current += Math.min(dt, 0.05);
      }
      const t = timeRef.current;

      // ----------------------------------------
      // RENDER CANVAS A (Física Masa-Resorte & Traza x(t))
      // ----------------------------------------
      if (activeSim === 'armonica') {
        const xNow = XA * Math.cos(omegaA * t - phiA); // desplazamiento en m
        const fNow = f0A * Math.cos(omegaA * t);

        if (isPlaying) {
          historyRefA.current.push({ t, x: xNow, f: fNow });
          if (historyRefA.current.length > 250) {
            historyRefA.current.shift();
          }
        }

        const cvsA = canvasRefA.current;
        if (cvsA) {
          const ctx = cvsA.getContext('2d');
          if (ctx) {
            const w = cvsA.width;
            const h = cvsA.height;
            ctx.clearRect(0, 0, w, h);

            // Background subtle grid
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);

            // Draw Mechanical Model on Left (0 to w/3)
            const modelW = Math.min(220, w * 0.35);
            ctx.fillStyle = '#F8FAFC';
            ctx.fillRect(0, 0, modelW, h);
            ctx.strokeStyle = '#E2E8F0';
            ctx.strokeRect(0, 0, modelW, h);

            // Ceiling
            ctx.fillStyle = '#94A3B8';
            ctx.fillRect(20, 20, modelW - 40, 12);
            // Hatches
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = 1.5;
            for (let i = 25; i < modelW - 40; i += 10) {
              ctx.beginPath();
              ctx.moveTo(i, 20);
              ctx.lineTo(i + 8, 10);
              ctx.stroke();
            }

            // Mass position calculation (scaled)
            const maxDispH = 50;
            const normX = XA > 0 ? (xNow / Math.max(XA, 0.001)) : 0;
            const midY = 150;
            const massY = midY + normX * maxDispH;
            const massSize = Math.max(38, Math.min(65, 30 + mA * 1.5));

            // Spring (left side of mass)
            const springX = modelW * 0.35;
            const coils = 10;
            const springLen = massY - 32;
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(springX, 32);
            for (let c = 0; c <= coils; c++) {
              const cy = 32 + (springLen / coils) * c;
              const cx = c === 0 || c === coils ? springX : springX + (c % 2 === 0 ? 12 : -12);
              ctx.lineTo(cx, cy);
            }
            ctx.stroke();

            // Damper (right side of mass)
            const damperX = modelW * 0.68;
            ctx.strokeStyle = '#64748B';
            ctx.lineWidth = 2;
            // Rod down from ceiling
            ctx.beginPath();
            ctx.moveTo(damperX, 32);
            ctx.lineTo(damperX, 32 + springLen * 0.45);
            ctx.stroke();
            // Piston head
            ctx.fillStyle = '#475569';
            ctx.fillRect(damperX - 10, 32 + springLen * 0.45, 20, 4);
            // Cylinder casing from mass
            ctx.strokeRect(damperX - 12, 32 + springLen * 0.4, 24, springLen * 0.55);
            ctx.beginPath();
            ctx.moveTo(damperX, 32 + springLen * 0.95);
            ctx.lineTo(damperX, massY);
            ctx.stroke();

            // Mass Block
            ctx.fillStyle = '#2563EB';
            ctx.beginPath();
            ctx.roundRect(modelW * 0.5 - massSize / 2, massY, massSize, massSize * 0.7, 8);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${mA} kg`, modelW * 0.5, massY + massSize * 0.38);

            // External Force arrow F(t) on mass
            const arrowLen = (fNow / Math.max(f0A, 1)) * 35;
            if (Math.abs(arrowLen) > 2) {
              const arrowY = massY + massSize * 0.7;
              ctx.strokeStyle = '#EF4444';
              ctx.fillStyle = '#EF4444';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(modelW * 0.5, arrowY + 6);
              ctx.lineTo(modelW * 0.5, arrowY + 6 + arrowLen);
              ctx.stroke();
              // arrowhead
              ctx.beginPath();
              if (arrowLen > 0) {
                ctx.moveTo(modelW * 0.5, arrowY + 6 + arrowLen + 5);
                ctx.lineTo(modelW * 0.5 - 5, arrowY + 6 + arrowLen);
                ctx.lineTo(modelW * 0.5 + 5, arrowY + 6 + arrowLen);
              } else {
                ctx.moveTo(modelW * 0.5, arrowY + 6 + arrowLen - 5);
                ctx.lineTo(modelW * 0.5 - 5, arrowY + 6 + arrowLen);
                ctx.lineTo(modelW * 0.5 + 5, arrowY + 6 + arrowLen);
              }
              ctx.fill();
            }

            // Labels on Model
            ctx.fillStyle = '#1E293B';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`k = ${kA} N/m`, springX, 26);
            ctx.fillText(`c = ${cA} N·s/m`, damperX, 26);
            ctx.fillStyle = '#DC2626';
            ctx.fillText(`F(t) = ${(fNow).toFixed(1)} N`, modelW * 0.5, h - 12);

            // Draw Real-Time Waveform Graph on Right (modelW to w)
            const graphX = modelW + 15;
            const graphW = w - graphX - 15;
            const graphMidY = h * 0.5;

            // Zero line
            ctx.strokeStyle = '#E2E8F0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(graphX, graphMidY);
            ctx.lineTo(graphX + graphW, graphMidY);
            ctx.stroke();

            // Legend
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#2563EB';
            ctx.fillText(`— Desplazamiento x(t) [X = ${(XA * 1000).toFixed(2)} mm]`, graphX + 5, 20);
            ctx.fillStyle = '#EF4444';
            ctx.fillText(`— Fuerza F(t) [F₀ = ${f0A} N] | Desfase ϕ = ${phiDegA.toFixed(1)}°`, graphX + 5, 36);

            // Draw wave history
            const hist = historyRefA.current;
            if (hist.length > 1) {
              // Displacement wave (Blue)
              ctx.strokeStyle = '#2563EB';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              hist.forEach((pt, idx) => {
                const px = graphX + (idx / 250) * graphW;
                const normDisp = pt.x / (XA > 0 ? XA : 1);
                const py = graphMidY - normDisp * 55;
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              });
              ctx.stroke();

              // Force wave (Red dashed)
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
              ctx.lineWidth = 1.8;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              hist.forEach((pt, idx) => {
                const px = graphX + (idx / 250) * graphW;
                const normForce = pt.f / (f0A > 0 ? f0A : 1);
                const py = graphMidY - normForce * 40;
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
              });
              ctx.stroke();
              ctx.setLineDash([]);

              // Current Point indicator
              const lastPt = hist[hist.length - 1];
              const curPx = graphX + ((hist.length - 1) / 250) * graphW;
              const curPy = graphMidY - (lastPt.x / (XA > 0 ? XA : 1)) * 55;
              ctx.fillStyle = '#2563EB';
              ctx.beginPath();
              ctx.arc(curPx, curPy, 5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // ----------------------------------------
        // RENDER CURVA M(r) vs r
        // ----------------------------------------
        const cvsCurveA = canvasCurveRefA.current;
        if (cvsCurveA) {
          const ctxC = cvsCurveA.getContext('2d');
          if (ctxC) {
            const cw = cvsCurveA.width;
            const ch = cvsCurveA.height;
            ctxC.clearRect(0, 0, cw, ch);
            ctxC.fillStyle = '#FFFFFF';
            ctxC.fillRect(0, 0, cw, ch);

            const padL = 40;
            const padR = 20;
            const padB = 30;
            const padT = 20;
            const plotW = cw - padL - padR;
            const plotH = ch - padT - padB;

            // Axes
            ctxC.strokeStyle = '#CBD5E1';
            ctxC.lineWidth = 1.5;
            ctxC.beginPath();
            ctxC.moveTo(padL, padT);
            ctxC.lineTo(padL, ch - padB);
            ctxC.lineTo(cw - padR, ch - padB);
            ctxC.stroke();

            // Resonance vertical dashed line r = 1
            const rMax = 3.0;
            const rx1 = padL + (1.0 / rMax) * plotW;
            ctxC.strokeStyle = '#FCA5A5';
            ctxC.setLineDash([3, 3]);
            ctxC.beginPath();
            ctxC.moveTo(rx1, padT);
            ctxC.lineTo(rx1, ch - padB);
            ctxC.stroke();
            ctxC.setLineDash([]);

            ctxC.fillStyle = '#94A3B8';
            ctxC.font = '10px sans-serif';
            ctxC.textAlign = 'center';
            ctxC.fillText('r = 1 (Resonancia)', rx1, ch - padB + 16);
            ctxC.fillText('r = 2', padL + (2.0 / rMax) * plotW, ch - padB + 16);
            ctxC.fillText('r = 3', padL + (3.0 / rMax) * plotW, ch - padB + 16);
            ctxC.fillText('Relación de Frecuencias r = ω / ω_n', padL + plotW / 2, ch - 5);

            // Y labels (M)
            const mMaxDisplay = 6.0;
            ctxC.textAlign = 'right';
            ctxC.fillText('M = 1', padL - 5, ch - padB - (1 / mMaxDisplay) * plotH);
            ctxC.fillText('M = 3', padL - 5, ch - padB - (3 / mMaxDisplay) * plotH);
            ctxC.fillText('M = 5', padL - 5, ch - padB - (5 / mMaxDisplay) * plotH);

            // Draw M(r) curve
            ctxC.strokeStyle = '#2563EB';
            ctxC.lineWidth = 2.5;
            ctxC.beginPath();
            const steps = 150;
            for (let s = 0; s <= steps; s++) {
              const rVal = (s / steps) * rMax;
              const denomVal = Math.sqrt(Math.pow(1 - rVal * rVal, 2) + Math.pow(2 * zetaA * rVal, 2));
              const mVal = Math.min(1 / denomVal, mMaxDisplay);
              const px = padL + (rVal / rMax) * plotW;
              const py = ch - padB - (mVal / mMaxDisplay) * plotH;
              if (s === 0) ctxC.moveTo(px, py);
              else ctxC.lineTo(px, py);
            }
            ctxC.stroke();

            // Plot current operating point
            if (rA <= rMax) {
              const curPx = padL + (rA / rMax) * plotW;
              const curM = Math.min(MA, mMaxDisplay);
              const curPy = ch - padB - (curM / mMaxDisplay) * plotH;

              ctxC.fillStyle = '#EF4444';
              ctxC.beginPath();
              ctxC.arc(curPx, curPy, 6, 0, Math.PI * 2);
              ctxC.fill();
              ctxC.strokeStyle = '#FFFFFF';
              ctxC.lineWidth = 2;
              ctxC.stroke();

              ctxC.fillStyle = '#1E293B';
              ctxC.font = 'bold 11px sans-serif';
              ctxC.textAlign = 'left';
              ctxC.fillText(`Punto actual: r = ${rA.toFixed(2)}, M = ${MA.toFixed(2)}`, curPx + 8, curPy - 6);
            }
          }
        }
      }

      // ----------------------------------------
      // RENDER CANVAS B (Desbalanceo Rotatorio en Maquinaria)
      // ----------------------------------------
      if (activeSim === 'desbalanceo') {
        const cvsB = canvasRefB.current;
        if (cvsB) {
          const ctxB = cvsB.getContext('2d');
          if (ctxB) {
            const w = cvsB.width;
            const h = cvsB.height;
            ctxB.clearRect(0, 0, w, h);
            ctxB.fillStyle = '#FFFFFF';
            ctxB.fillRect(0, 0, w, h);

            // Left Panel: Motor & Rotating Unbalance Physical Model
            const halfW = w * 0.48;

            // Machine foundation vibration
            const maxVibPix = 28;
            const normDisplace = XB > 0 ? (XB * Math.sin(omegaB * t - phiB)) / XB : 0;
            const vibY = normDisplace * maxVibPix;

            // Rigid machine base block
            const baseW = 160;
            const baseH = 85;
            const baseX = halfW * 0.5 - baseW / 2;
            const baseY = 110 + vibY;

            // Flexible foundation springs & dampers under machine
            const springY0 = baseY + baseH;
            const groundY = h - 35;

            // Draw Ground
            ctxB.fillStyle = '#94A3B8';
            ctxB.fillRect(20, groundY, halfW - 40, 8);
            ctxB.strokeStyle = '#64748B';
            ctxB.lineWidth = 1;
            for (let i = 25; i < halfW - 40; i += 8) {
              ctxB.beginPath();
              ctxB.moveTo(i, groundY + 8);
              ctxB.lineTo(i - 6, groundY + 16);
              ctxB.stroke();
            }

            // Left and Right elastic mountings
            const mountPositions = [baseX + 25, baseX + baseW - 25];
            mountPositions.forEach((mx) => {
              // Spring
              ctxB.strokeStyle = '#0D9488';
              ctxB.lineWidth = 2;
              ctxB.beginPath();
              ctxB.moveTo(mx - 8, springY0);
              const mCoils = 6;
              const mH = groundY - springY0;
              for (let c = 0; c <= mCoils; c++) {
                const py = springY0 + (mH / mCoils) * c;
                const px = c === 0 || c === mCoils ? mx - 8 : mx - 8 + (c % 2 === 0 ? 6 : -6);
                ctxB.lineTo(px, py);
              }
              ctxB.stroke();

              // Damper next to it
              ctxB.strokeStyle = '#64748B';
              ctxB.lineWidth = 1.5;
              ctxB.strokeRect(mx + 4, springY0 + mH * 0.35, 12, mH * 0.45);
              ctxB.beginPath();
              ctxB.moveTo(mx + 10, springY0);
              ctxB.lineTo(mx + 10, springY0 + mH * 0.35);
              ctxB.moveTo(mx + 10, springY0 + mH * 0.8);
              ctxB.lineTo(mx + 10, groundY);
              ctxB.stroke();
            });

            // Machine Body
            ctxB.fillStyle = '#F1F5F9';
            ctxB.strokeStyle = '#CBD5E1';
            ctxB.lineWidth = 2;
            ctxB.beginPath();
            ctxB.roundRect(baseX, baseY, baseW, baseH, 10);
            ctxB.fill();
            ctxB.stroke();

            // Machine Label
            ctxB.fillStyle = '#334155';
            ctxB.font = 'bold 11px sans-serif';
            ctxB.textAlign = 'center';
            ctxB.fillText(`Máquina (m = ${mB} kg)`, baseX + baseW / 2, baseY + 18);

            // Rotor inside machine
            const rotorCenterX = baseX + baseW / 2;
            const rotorCenterY = baseY + 48;
            const rotorRadius = 26;

            // Rotor circle
            ctxB.fillStyle = '#E2E8F0';
            ctxB.strokeStyle = '#0D9488';
            ctxB.lineWidth = 2;
            ctxB.beginPath();
            ctxB.arc(rotorCenterX, rotorCenterY, rotorRadius, 0, Math.PI * 2);
            ctxB.fill();
            ctxB.stroke();

            // Rotating Angle theta = omega * t
            const theta = omegaB * t;
            // Eccentric Mass me
            const meDist = Math.min(rotorRadius - 4, 8 + (eB / 50) * 14);
            const meX = rotorCenterX + meDist * Math.cos(theta);
            const meY = rotorCenterY - meDist * Math.sin(theta);

            // Radial line
            ctxB.strokeStyle = '#0D9488';
            ctxB.lineWidth = 1.5;
            ctxB.beginPath();
            ctxB.moveTo(rotorCenterX, rotorCenterY);
            ctxB.lineTo(meX, meY);
            ctxB.stroke();

            // Eccentric Mass point
            ctxB.fillStyle = '#EF4444';
            ctxB.beginPath();
            ctxB.arc(meX, meY, 5.5, 0, Math.PI * 2);
            ctxB.fill();
            ctxB.strokeStyle = '#991B1B';
            ctxB.lineWidth = 1.5;
            ctxB.stroke();

            // Rotating arrow indicating RPM
            ctxB.fillStyle = '#0D9488';
            ctxB.font = 'bold 10px sans-serif';
            ctxB.fillText(`me = ${meB} kg @ ${rpmB} RPM`, rotorCenterX, baseY + baseH - 8);

            // Right Panel: Graph of Amplitud vs RPM & Fuerza Transmitida
            const gX = halfW + 20;
            const gW = w - gX - 20;
            const gH = h - 60;
            const gY = 30;

            // Background of graph
            ctxB.fillStyle = '#F8FAFC';
            ctxB.fillRect(gX, gY, gW, gH);
            ctxB.strokeStyle = '#E2E8F0';
            ctxB.strokeRect(gX, gY, gW, gH);

            // Header of graph
            ctxB.fillStyle = '#0F172A';
            ctxB.font = 'bold 11px sans-serif';
            ctxB.textAlign = 'left';
            ctxB.fillText('Respuesta Dinámica: Amplitud X vs Velocidad de Rotación', gX + 10, gY + 18);

            // Draw Curve X vs RPM (from 0 to 2.5 * rpmCritB)
            const maxRpmPlot = Math.max(rpmCritB * 2.5, 3000);
            const plotSteps = 120;
            const peakAdim = 1 / (2 * zetaB);
            const maxPlotYVal = Math.max(peakAdim * 1.15, 3.5);

            ctxB.strokeStyle = '#0D9488';
            ctxB.lineWidth = 2.5;
            ctxB.beginPath();
            for (let i = 0; i <= plotSteps; i++) {
              const curRpm = (i / plotSteps) * maxRpmPlot;
              const curW = (curRpm * 2 * Math.PI) / 60;
              const curR = curW / omegaNB;
              const curDenom = Math.sqrt(Math.pow(1 - curR * curR, 2) + Math.pow(2 * zetaB * curR, 2));
              const curAdim = (curR * curR) / curDenom;
              const px = gX + 10 + (i / plotSteps) * (gW - 20);
              const py = gY + gH - 20 - (Math.min(curAdim, maxPlotYVal) / maxPlotYVal) * (gH - 45);
              if (i === 0) ctxB.moveTo(px, py);
              else ctxB.lineTo(px, py);
            }
            ctxB.stroke();

            // Critical Speed Line
            const critPx = gX + 10 + (rpmCritB / maxRpmPlot) * (gW - 20);
            ctxB.strokeStyle = '#F87171';
            ctxB.setLineDash([3, 3]);
            ctxB.beginPath();
            ctxB.moveTo(critPx, gY + 25);
            ctxB.lineTo(critPx, gY + gH - 20);
            ctxB.stroke();
            ctxB.setLineDash([]);
            ctxB.fillStyle = '#DC2626';
            ctxB.font = '10px sans-serif';
            ctxB.textAlign = 'center';
            ctxB.fillText(`RPM Crítica (${Math.round(rpmCritB)})`, critPx, gY + 22);

            // Current RPM point marker
            const curPx = gX + 10 + (Math.min(rpmB, maxRpmPlot) / maxRpmPlot) * (gW - 20);
            const curPy = gY + gH - 20 - (Math.min(factorAdimB, maxPlotYVal) / maxPlotYVal) * (gH - 45);
            ctxB.fillStyle = isNearCriticalB ? '#EF4444' : '#0D9488';
            ctxB.beginPath();
            ctxB.arc(curPx, curPy, 6, 0, Math.PI * 2);
            ctxB.fill();
            ctxB.strokeStyle = '#FFFFFF';
            ctxB.lineWidth = 2;
            ctxB.stroke();

            // Graph bottom labels
            ctxB.fillStyle = '#64748B';
            ctxB.font = '10px sans-serif';
            ctxB.textAlign = 'left';
            ctxB.fillText('0 RPM', gX + 10, gY + gH - 5);
            ctxB.textAlign = 'right';
            ctxB.fillText(`${Math.round(maxRpmPlot)} RPM`, gX + gW - 10, gY + gH - 5);
          }
        }
      }

      // ----------------------------------------
      // RENDER CANVAS C (Cabeceo de Flechas - Whirling)
      // ----------------------------------------
      if (activeSim === 'cabeceo') {
        // C1: Representación 2D del eje y su perfil de deflexión
        const cvsShaft = canvasRefC_Shaft.current;
        if (cvsShaft) {
          const ctxS = cvsShaft.getContext('2d');
          if (ctxS) {
            const sw = cvsShaft.width;
            const sh = cvsShaft.height;
            ctxS.clearRect(0, 0, sw, sh);
            ctxS.fillStyle = '#FFFFFF';
            ctxS.fillRect(0, 0, sw, sh);

            const midY = sh * 0.5;
            const leftBearingX = 50;
            const rightBearingX = sw - 50;

            // Neutral axis (dashed line)
            ctxS.strokeStyle = '#CBD5E1';
            ctxS.setLineDash([4, 4]);
            ctxS.beginPath();
            ctxS.moveTo(leftBearingX - 20, midY);
            ctxS.lineTo(rightBearingX + 20, midY);
            ctxS.stroke();
            ctxS.setLineDash([]);

            // Deflection calculation in pixels
            const maxDefPix = 35;
            const defPix = Math.min(maxDefPix, rdMmC * 4);
            // Dynamic rotation phase
            const curPhiAngle = omegaC * t;
            const curDispY = defPix * Math.cos(curPhiAngle);

            // Draw Bearings at ends
            [leftBearingX, rightBearingX].forEach((bx) => {
              ctxS.fillStyle = '#64748B';
              ctxS.beginPath();
              ctxS.moveTo(bx, midY);
              ctxS.lineTo(bx - 12, midY + 22);
              ctxS.lineTo(bx + 12, midY + 22);
              ctxS.closePath();
              ctxS.fill();
              ctxS.fillRect(bx - 15, midY + 22, 30, 4);
            });

            // Draw Deflected Shaft (Curved)
            ctxS.strokeStyle = '#0284C7';
            ctxS.lineWidth = 5;
            ctxS.lineCap = 'round';
            ctxS.beginPath();
            ctxS.moveTo(leftBearingX, midY);
            ctxS.quadraticCurveTo(sw * 0.5, midY + curDispY * 1.8, rightBearingX, midY);
            ctxS.stroke();

            // Central Rotor / Disk
            const diskCenterX = sw * 0.5;
            const diskCenterY = midY + curDispY;
            const diskRadiusY = 32;
            const diskThickness = 14;

            ctxS.fillStyle = '#0284C7';
            ctxS.strokeStyle = '#0369A1';
            ctxS.lineWidth = 2;
            ctxS.beginPath();
            ctxS.ellipse(diskCenterX, diskCenterY, diskThickness, diskRadiusY, 0, 0, Math.PI * 2);
            ctxS.fill();
            ctxS.stroke();

            // Center of mass G offset on the disk
            const ePix = Math.min(15, (eC / 10) * 12);
            const gAngle = curPhiAngle - phiC;
            const gX = diskCenterX + ePix * Math.sin(gAngle) * 0.4;
            const gY = diskCenterY + ePix * Math.cos(gAngle);

            ctxS.fillStyle = '#EF4444';
            ctxS.beginPath();
            ctxS.arc(gX, gY, 4, 0, Math.PI * 2);
            ctxS.fill();

            // Annotations
            ctxS.font = '10px sans-serif';
            ctxS.fillStyle = '#475569';
            ctxS.textAlign = 'center';
            ctxS.fillText('Cojinete A (O)', leftBearingX, midY + 36);
            ctxS.fillText('Cojinete B (O)', rightBearingX, midY + 36);
            ctxS.fillText(`Deflexión central r_d = ${rdMmC.toFixed(2)} mm`, diskCenterX, sh - 10);
          }
        }

        // C2: Vista Axial de la Órbita y los 3 Centros (O, S, G)
        const cvsOrb = canvasRefC_Orbit.current;
        if (cvsOrb) {
          const ctxO = cvsOrb.getContext('2d');
          if (ctxO) {
            const ow = cvsOrb.width;
            const oh = cvsOrb.height;
            ctxO.clearRect(0, 0, ow, oh);
            ctxO.fillStyle = '#FFFFFF';
            ctxO.fillRect(0, 0, ow, oh);

            const oCenterX = ow * 0.5;
            const oCenterY = oh * 0.5;

            // Axes
            ctxO.strokeStyle = '#E2E8F0';
            ctxO.lineWidth = 1;
            ctxO.beginPath();
            ctxO.moveTo(oCenterX, 10);
            ctxO.lineTo(oCenterX, oh - 10);
            ctxO.moveTo(10, oCenterY);
            ctxO.lineTo(ow - 10, oCenterY);
            ctxO.stroke();

            // Whirling orbit radius (scaled)
            const orbitR = Math.min(ow * 0.35, Math.max(10, rdMmC * 6));

            // Whirling Orbit circle (path of S)
            ctxO.strokeStyle = '#BAE6FD';
            ctxO.lineWidth = 1.5;
            ctxO.setLineDash([3, 3]);
            ctxO.beginPath();
            ctxO.arc(oCenterX, oCenterY, orbitR, 0, Math.PI * 2);
            ctxO.stroke();
            ctxO.setLineDash([]);

            // Current angle of S (whirling)
            const thetaWhirl = omegaC * t;
            const sX = oCenterX + orbitR * Math.cos(thetaWhirl);
            const sY = oCenterY - orbitR * Math.sin(thetaWhirl);

            // Vector e (eccentricity from S to G)
            const eScale = Math.min(30, (eC / 10) * 22);
            // In synchronous whirl, G is at angle thetaWhirl - phiC
            const thetaG = thetaWhirl - phiC;
            const gX = sX + eScale * Math.cos(thetaG);
            const gY = sY - eScale * Math.sin(thetaG);

            // Line O -> S
            ctxO.strokeStyle = '#0284C7';
            ctxO.lineWidth = 2;
            ctxO.beginPath();
            ctxO.moveTo(oCenterX, oCenterY);
            ctxO.lineTo(sX, sY);
            ctxO.stroke();

            // Line S -> G
            ctxO.strokeStyle = '#EF4444';
            ctxO.lineWidth = 2;
            ctxO.beginPath();
            ctxO.moveTo(sX, sY);
            ctxO.lineTo(gX, gY);
            ctxO.stroke();

            // Center O (Bearing axis)
            ctxO.fillStyle = '#0F172A';
            ctxO.beginPath();
            ctxO.arc(oCenterX, oCenterY, 5, 0, Math.PI * 2);
            ctxO.fill();
            ctxO.font = 'bold 11px sans-serif';
            ctxO.fillText('O (Línea de cojinetes)', oCenterX + 8, oCenterY - 6);

            // Center S (Shaft geometric center)
            ctxO.fillStyle = '#0284C7';
            ctxO.beginPath();
            ctxO.arc(sX, sY, 5, 0, Math.PI * 2);
            ctxO.fill();
            ctxO.fillText('S (Centro de flecha)', sX + 8, sY - 6);

            // Center G (Center of mass)
            ctxO.fillStyle = '#DC2626';
            ctxO.beginPath();
            ctxO.arc(gX, gY, 6, 0, Math.PI * 2);
            ctxO.fill();
            ctxO.fillText('G (Centro de gravedad)', gX + 8, gY - 6);

            // Legend / Info
            ctxO.fillStyle = '#64748B';
            ctxO.font = '10px sans-serif';
            ctxO.textAlign = 'left';
            ctxO.fillText(`Órbita sincrónica | Desfase ϕ = ${phiDegC.toFixed(1)}°`, 12, oh - 10);
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [
    isPlaying,
    activeSim,
    mA, kA, cA, f0A, omegaA, XA, phiA, phiDegA, zetaA, rA,
    mB, meB, eB, zetaB, rpmB, kB, omegaB, omegaNB, rpmCritB, rB, factorAdimB, isNearCriticalB,
    kC, mC, eC, rpmC, zetaC, omegaC, omegaCritC, rpmCritC, rC, rdMmC, phiC, phiDegC
  ]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Simulator Navigation Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Subtabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSim('armonica')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSim === 'armonica'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Entorno A: Fuerza Armónica F₀·cos(ωt)</span>
          </button>
          <button
            onClick={() => setActiveSim('desbalanceo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSim === 'desbalanceo'
                ? 'bg-teal-600 text-white shadow-sm shadow-teal-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Entorno B: Desbalanceo Rotatorio</span>
          </button>
          <button
            onClick={() => setActiveSim('cabeceo')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeSim === 'cabeceo'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Entorno C: Cabeceo de Flechas (Whirling)</span>
          </button>
        </div>

        {/* Play / Pause toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Reanudar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ENTORNO A: FUERZA ARMÓNICA DIRECTA                           */}
      {/* ============================================================ */}
      {activeSim === 'armonica' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (4 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                Parámetros del Sistema (1 GDL)
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                Tema 3.1
              </span>
            </div>

            {/* Presets rápidos */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Configuraciones Rápidas de Estudio:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setPresetA('resonancia')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 text-left cursor-pointer"
                >
                  ⚡ Resonancia (r = 1)
                </button>
                <button
                  onClick={() => setPresetA('rigidez')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200 text-left cursor-pointer"
                >
                  🧱 Zona Rigidez (r &lt;&lt; 1)
                </button>
                <button
                  onClick={() => setPresetA('inercia')}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-semibold hover:bg-teal-100 text-left cursor-pointer"
                >
                  🛡️ Aislamiento (r &gt;&gt; 1)
                </button>
                <button
                  onClick={() => setPresetA('critico')}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold hover:bg-indigo-100 text-left cursor-pointer"
                >
                  🎯 Amort. Crítico (ζ = 1)
                </button>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 text-xs">
              {/* Masa */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Masa (<Latex math="m" />):</span>
                  <span className="font-bold text-blue-600">{mA} kg</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={mA}
                  onChange={(e) => setMA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Rigidez */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Rigidez (<Latex math="k" />):</span>
                  <span className="font-bold text-blue-600">{kA} N/m</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="10000"
                  step="100"
                  value={kA}
                  onChange={(e) => setKA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Amortiguamiento */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Amortiguamiento (<Latex math="c" />):</span>
                  <span className="font-bold text-blue-600">{cA} N·s/m</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  step="1"
                  value={cA}
                  onChange={(e) => setCA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Fuerza F0 */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Fuerza Armónica (<Latex math="F_0" />):</span>
                  <span className="font-bold text-rose-600">{f0A} N</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="300"
                  step="5"
                  value={f0A}
                  onChange={(e) => setF0A(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Frecuencia de excitación omega */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Frecuencia Excitadora (<Latex math="\omega" />):</span>
                  <span className="font-bold text-blue-600">{omegaA} rad/s ({((omegaA * 60) / (2 * Math.PI)).toFixed(0)} RPM)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="80"
                  step="0.5"
                  value={omegaA}
                  onChange={(e) => setOmegaA(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Panel de Métricas Calculadas */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Resultados Dinámicos Calculados:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Frec. Natural <Latex math="\omega_n" />:</span>
                  <p className="font-bold text-slate-900">{omegaNA.toFixed(2)} rad/s ({fnA.toFixed(2)} Hz)</p>
                </div>
                <div>
                  <span className="text-slate-500">Relación <Latex math="r = \omega/\omega_n" />:</span>
                  <p className={`font-bold ${rA >= 0.9 && rA <= 1.1 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {rA.toFixed(3)} {rA >= 0.9 && rA <= 1.1 ? '⚠️ (Pico)' : ''}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Razón <Latex math="\zeta" />:</span>
                  <p className="font-bold text-slate-900">{zetaA.toFixed(3)} ({zetaA < 1 ? 'Subamortiguado' : 'Sobreamortiguado'})</p>
                </div>
                <div>
                  <span className="text-slate-500">Factor Dinámico <Latex math="M" />:</span>
                  <p className="font-bold text-blue-700">{MA.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-slate-500">Amplitud Máx <Latex math="X" />:</span>
                  <p className="font-bold text-blue-700">{(XA * 1000).toFixed(2)} mm</p>
                </div>
                <div>
                  <span className="text-slate-500">Ángulo de Desfase <Latex math="\phi" />:</span>
                  <p className="font-bold text-slate-900">{phiDegA.toFixed(1)}°</p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphical Visualizations (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Real-time mechanical & waveform canvas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                  Simulación Física y Respuesta Temporal <Latex math="x(t)" /> vs <Latex math="F(t)" />
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  Amplitud: {(XA * 1000).toFixed(2)} mm | Desfase: {phiDegA.toFixed(1)}°
                </span>
              </div>
              <canvas
                ref={canvasRefA}
                width={650}
                height={260}
                className="w-full h-64 border border-slate-100 rounded-xl bg-white"
              />
            </div>

            {/* Amplification Factor M(r) vs r Curve */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Curva del Factor de Amplificación Dinámica <Latex math="M(r, \zeta)" />
                </span>
                <span className="text-[11px] font-semibold text-blue-700">
                  Punto de operación: r = {rA.toFixed(2)}, M = {MA.toFixed(2)}
                </span>
              </div>
              <canvas
                ref={canvasCurveRefA}
                width={650}
                height={190}
                className="w-full h-48 border border-slate-100 rounded-xl bg-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ENTORNO B: DESBALANCEO ROTATORIO EN MAQUINARIA               */}
      {/* ============================================================ */}
      {activeSim === 'desbalanceo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-teal-600" />
                Parámetros de Desbalanceo Rotatorio
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                Tema 3.2
              </span>
            </div>

            {/* Alerta de Velocidad Crítica */}
            {isNearCriticalB ? (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-rose-900">¡SISTEMA OPERANDO EN VELOCIDAD CRÍTICA!</p>
                  <p className="text-rose-700">
                    RPM actuales ({rpmB}) muy cercanas a las RPM Críticas ({Math.round(rpmCritB)}). Alto riesgo de daño mecánico.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-teal-900">Operación Estable Fuera de Resonancia</p>
                  <p className="text-teal-700">
                    Relación de velocidades: r = {rB.toFixed(2)} ({rB < 1 ? 'Régimen subcrítico' : 'Régimen supercrítico'}).
                  </p>
                </div>
              </div>
            )}

            {/* Presets B */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Casos Típicos de Máquinas:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setPresetB('critico')}
                  className="px-2 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 text-center cursor-pointer"
                >
                  ⚠️ En Resonancia
                </button>
                <button
                  onClick={() => setPresetB('baja')}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200 text-center cursor-pointer"
                >
                  🐢 Subcrítico
                </button>
                <button
                  onClick={() => setPresetB('alta')}
                  className="px-2 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 font-semibold hover:bg-teal-100 text-center cursor-pointer"
                >
                  🚀 Supercrítico
                </button>
              </div>
            </div>

            {/* Sliders B */}
            <div className="space-y-4 text-xs">
              {/* RPM del motor */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Velocidad de Rotación:</span>
                  <span className={`font-bold ${isNearCriticalB ? 'text-rose-600' : 'text-teal-700'}`}>
                    {rpmB} RPM ({omegaB.toFixed(1)} rad/s)
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="4500"
                  step="25"
                  value={rpmB}
                  onChange={(e) => setRpmB(parseInt(e.target.value, 10))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Masa total m */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Masa Total Máquina (<Latex math="m" />):</span>
                  <span className="font-bold text-slate-800">{mB} kg</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={mB}
                  onChange={(e) => setMB(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Masa desbalanceada me */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Masa Desbalanceada (<Latex math="m_e" />):</span>
                  <span className="font-bold text-rose-600">{meB} kg</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="3.0"
                  step="0.05"
                  value={meB}
                  onChange={(e) => setMeB(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>

              {/* Excentricidad e */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Excentricidad (<Latex math="e" />):</span>
                  <span className="font-bold text-slate-800">{eB} mm</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={eB}
                  onChange={(e) => setEB(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Razón de amortiguamiento zeta */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Amortiguamiento (<Latex math="\zeta" />):</span>
                  <span className="font-bold text-slate-800">{zetaB}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.40"
                  step="0.01"
                  value={zetaB}
                  onChange={(e) => setZetaB(parseFloat(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Métricas B */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Diagnóstico de Desbalanceo:
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Velocidad Crítica:</span>
                  <p className="font-bold text-slate-900">{Math.round(rpmCritB)} RPM</p>
                </div>
                <div>
                  <span className="text-slate-500">Fuerza Centrífuga:</span>
                  <p className="font-bold text-rose-600">{FcentrifugaB.toFixed(1)} N</p>
                </div>
                <div>
                  <span className="text-slate-500">Amplitud de Vibración <Latex math="X" />:</span>
                  <p className="font-bold text-teal-700">{XmmB.toFixed(3)} mm ({Math.round(XmmB * 1000)} µm)</p>
                </div>
                <div>
                  <span className="text-slate-500">Fuerza Transmitida <Latex math="F_T" />:</span>
                  <p className="font-bold text-slate-900">{FT_B.toFixed(1)} N</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Límite asintótico a muy alta velocidad (<Latex math="r \to \infty" />):</span>
                  <p className="font-bold text-slate-800">
                    <Latex math="\frac{m_e \cdot e}{m}" /> = {(((meB * eB) / mB)).toFixed(3)} mm
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphics B (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                Simulador Visual de Rotor con Desbalanceo y Curva de Amplitud
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isNearCriticalB ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-800'}`}>
                {isNearCriticalB ? 'ZONA DE PELIGRO: RESONANCIA' : 'ZONA SEGURA'}
              </span>
            </div>
            <canvas
              ref={canvasRefB}
              width={650}
              height={440}
              className="w-full h-[440px] border border-slate-100 rounded-xl bg-white"
            />
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ENTORNO C: CABECEO DE FLECHAS (WHIRLING OF SHAFTS)           */}
      {/* ============================================================ */}
      {activeSim === 'cabeceo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Cabeceo de Flechas y Ejes Rotatorios
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                Tema 3.2.B
              </span>
            </div>

            {/* Presets C */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Regímenes de Giro de Flechas:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setPresetC('subcritico')}
                  className="px-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-semibold hover:bg-slate-200 text-center cursor-pointer"
                >
                  Subcrítico (r &lt; 1)
                </button>
                <button
                  onClick={() => setPresetC('critico')}
                  className="px-2 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 text-center cursor-pointer"
                >
                  ⚡ Crítico (r = 1)
                </button>
                <button
                  onClick={() => setPresetC('supercritico')}
                  className="px-2 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-semibold hover:bg-sky-100 text-center cursor-pointer"
                >
                  🔄 Supercrítico (Laval)
                </button>
              </div>
            </div>

            {/* Sliders C */}
            <div className="space-y-4 text-xs">
              {/* RPM de rotación */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Velocidad de Giro del Eje:</span>
                  <span className={`font-bold ${isNearCriticalC ? 'text-rose-600' : 'text-sky-700'}`}>
                    {rpmC} RPM ({omegaC.toFixed(1)} rad/s)
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="4500"
                  step="25"
                  value={rpmC}
                  onChange={(e) => setRpmC(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Rigidez flexional k */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Rigidez a Flexión del Eje (<Latex math="k" />):</span>
                  <span className="font-bold text-slate-800">{kC} N/m</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={kC}
                  onChange={(e) => setKC(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Masa del disco m */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Masa del Disco Rotor (<Latex math="m" />):</span>
                  <span className="font-bold text-slate-800">{mC} kg</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={mC}
                  onChange={(e) => setMC(parseFloat(e.target.value))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
              </div>

              {/* Excentricidad e */}
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Excentricidad del Disco (<Latex math="e" />):</span>
                  <span className="font-bold text-rose-600">{eC} mm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="8.0"
                  step="0.2"
                  value={eC}
                  onChange={(e) => setEC(parseFloat(e.target.value))}
                  className="w-full accent-rose-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Métricas C */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Diagnóstico de Cabeceo (Whirling):
              </span>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Velocidad Crítica <Latex math="\omega_c" />:</span>
                  <p className="font-bold text-slate-900">{Math.round(rpmCritC)} RPM ({omegaCritC.toFixed(1)} rad/s)</p>
                </div>
                <div>
                  <span className="text-slate-500">Relación <Latex math="r = \omega / \omega_c" />:</span>
                  <p className={`font-bold ${isNearCriticalC ? 'text-rose-600' : 'text-slate-900'}`}>
                    {rC.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Deflexión Radial del Eje <Latex math="r_d" />:</span>
                  <p className="font-bold text-sky-700">{rdMmC.toFixed(2)} mm</p>
                </div>
                <div>
                  <span className="text-slate-500">Ángulo de Fase <Latex math="\phi" />:</span>
                  <p className="font-bold text-slate-900">{phiDegC.toFixed(1)}°</p>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Comportamiento dinámico:</span>
                  <p className="text-slate-800 font-medium">
                    {rC < 0.9 && 'Subcrítico: Centro de masa G gira por fuera del centro elástico S.'}
                    {rC >= 0.9 && rC <= 1.1 && '¡CRÍTICO! Máxima deflexión y fuerza sobre cojinetes.'}
                    {rC > 1.1 && 'Supercrítico (Auto-centrado): El centro de gravedad G busca la línea de centros O.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Graphics C (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* C1: Representación 2D de la deformación elástica de la flecha */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  1. Perfil Longitudinal de Deflexión Elástica de la Flecha entre Cojinetes
                </span>
                <span className="text-[11px] font-semibold text-sky-700">
                  Deflexión central: {rdMmC.toFixed(2)} mm
                </span>
              </div>
              <canvas
                ref={canvasRefC_Shaft}
                width={650}
                height={190}
                className="w-full h-48 border border-slate-100 rounded-xl bg-white"
              />
            </div>

            {/* C2: Vista Axial de la Órbita y los 3 Centros O, S, G */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  2. Vista Axial Transversal: Órbita de Cabeceo y Centros O (Cojinete), S (Eje) y G (Masa)
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {rC > 1.1 ? '✨ Régimen Supercrítico: Auto-centrado activo' : 'Órbita Sincrónica'}
                </span>
              </div>
              <canvas
                ref={canvasRefC_Orbit}
                width={650}
                height={220}
                className="w-full h-56 border border-slate-100 rounded-xl bg-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
