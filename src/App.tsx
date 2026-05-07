/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TimerProps {
  label: string;
  accentColor: string;
}

const TimerCard = ({ label, accentColor }: TimerProps) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isRunning) {
      intervalId = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Update every 10ms for smoothness
      }, 10);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden"
    >
      {/* Accent Background Decoration */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 blur-[60px] opacity-10 rounded-full"
        style={{ backgroundColor: accentColor }}
      />
      
      <div className="flex items-center gap-2 mb-6 self-start">
        <div 
          className="w-2.5 h-2.5 rounded-full" 
          style={{ 
            backgroundColor: isRunning ? '#22c55e' : '#cbd5e1',
            boxShadow: isRunning ? '0 0 10px #22c55e' : 'none'
          }}
        />
        <span className="text-slate-400 font-mono text-xl tracking-widest uppercase font-bold">{label}</span>
      </div>

      <div className="relative mb-8">
        <div 
          className="font-mono text-7xl md:text-8xl font-bold tracking-tighter tabular-nums text-slate-800"
        >
          {formatTime(time)}
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          id={`start-${label.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handleStart}
          disabled={isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${
            isRunning 
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-200' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
          }`}
        >
          <Play size={20} fill="currentColor" />
          開始
        </button>

        <button
          id={`pause-${label.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handlePause}
          disabled={!isRunning}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all active:scale-95 ${
            !isRunning 
              ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-200' 
              : 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-200'
          }`}
        >
          <Pause size={20} fill="currentColor" />
          暫停
        </button>
        
        <button
          id={`reset-${label.toLowerCase().replace(/\s+/g, '-')}`}
          onClick={handleReset}
          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 border border-transparent transition-all active:scale-95 font-bold"
        >
          <RotateCcw size={20} />
          重設
        </button>
      </div>
    </motion.div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 selection:bg-blue-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="text-yellow-500" size={28} />
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">競賽計時器</h1>
            </div>
            <p className="text-slate-500 text-lg font-bold max-w-md">
              雙通道獨立計時器，專為班級競賽、體育活動設計。
            </p>
          </div>
          
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-2">快速操作說明</h2>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>• 點擊 <Play size={10} className="inline" /> <b>開始</b> 進行計時</li>
              <li>• 點擊 <Pause size={10} className="inline" /> <b>暫停</b> 停止目前的計時</li>
              <li>• 點擊 <RotateCcw size={10} className="inline" /> <b>重設</b> 將時間歸零</li>
            </ul>
          </div>
        </header>

        {/* Main Timer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <TimerCard label="CLASS A / 第一組" accentColor="#3b82f6" />
          <TimerCard label="CLASS B / 第二組" accentColor="#ef4444" />
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 flex justify-center text-slate-400">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em]">
            <TimerIcon size={14} />
            Professional Competition Grade
          </div>
        </footer>
      </div>
    </div>
  );
}
