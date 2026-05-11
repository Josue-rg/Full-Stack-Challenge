import React, { useState } from 'react';
import { wordService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'select' | 'single' | 'multiple';

const AddWord: React.FC = () => {
  const [mode, setMode] = useState<Mode>('select');
  const [word, setWord] = useState('');
  const [words, setWords] = useState<string[]>(['']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (word.length !== 5) {
      setMessage('La palabra debe tener exactamente 5 letras');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      await wordService.addWord(word.toUpperCase());
      setMessage('¡Palabra agregada exitosamente!');
      setIsError(false);
      setWord('');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error al agregar la palabra');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMultipleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validWords = words.filter(w => w.trim().length === 5);
    
    if (validWords.length === 0) {
      setMessage('Debes agregar al menos una palabra válida de 5 letras');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const results = await Promise.allSettled(
        validWords.map(w => wordService.addWord(w.toUpperCase()))
      );
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (failed === 0) {
        setMessage(`¡${successful} palabra(s) agregada(s) exitosamente!`);
        setIsError(false);
        setWords(['']);
      } else {
        setMessage(`${successful} palabra(s) agregada(s), ${failed} fallaron`);
        setIsError(true);
      }
    } catch (error: any) {
      setMessage('Error al agregar las palabras');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const addWordField = () => {
    if (words.length < 20) {
      setWords([...words, '']);
    }
  };

  const removeWordField = (index: number) => {
    setWords(words.filter((_, i) => i !== index));
  };

  const updateWord = (index: number, value: string) => {
    const newWords = [...words];
    newWords[index] = value.toUpperCase();
    setWords(newWords);
  };

  if (mode === 'select') {
    return (
      <motion.div 
        className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Scanning line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
        
        {/* Header */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
            Agregar Palabras
          </h2>
        </div>

        <p className="relative text-purple-300/60 mb-6 text-sm">Selecciona una opción:</p>
        
        <div className="relative space-y-3">
          <motion.button
            onClick={() => setMode('single')}
            className="relative group w-full overflow-hidden rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative bg-transparent text-white font-semibold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Agregar una palabra</span>
            </div>
          </motion.button>
          
          <motion.button
            onClick={() => setMode('multiple')}
            className="relative group w-full overflow-hidden rounded-xl"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative bg-transparent text-white font-semibold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>Agregar varias palabras (máx. 20)</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (mode === 'single') {
    return (
      <motion.div 
        className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 shadow-2xl max-w-md w-full overflow-hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        {/* Scanning line */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent animate-scan"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
              Agregar Palabra
            </h2>
          </div>
          <motion.button
            onClick={() => {
              setMode('select');
              setWord('');
              setMessage('');
            }}
            className="text-purple-300/60 hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-1"
            whileHover={{ x: -3 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </motion.button>
        </div>
        
        <form onSubmit={handleSingleSubmit} className="relative space-y-4">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-purple-300/60 mb-2">
              Palabra (5 letras)
            </label>
            <div className="relative transition-transform duration-300 focus-within:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-xl blur opacity-30 group-focus-within:opacity-60 transition-opacity duration-500 animate-gradient-xy"></div>
              <input
                type="text"
                id="word"
                value={word}
                onChange={(e) => setWord(e.target.value.toUpperCase())}
                maxLength={5}
                className="relative w-full bg-[#1a1a2e]/90 backdrop-blur-md border border-purple-500/30 text-white placeholder-purple-300/30 rounded-xl px-4 py-3 uppercase text-center text-2xl font-black focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="ABRIR"
                disabled={isLoading}
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || word.length !== 5}
            className="relative group w-full overflow-hidden rounded-xl"
            whileHover={{ scale: isLoading || word.length !== 5 ? 1 : 1.02 }}
            whileTap={{ scale: isLoading || word.length !== 5 ? 1 : 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative bg-transparent text-white font-black py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Agregando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Agregar Palabra</span>
                </>
              )}
            </div>
          </motion.button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`relative mt-4 p-3 rounded-xl border ${
                isError
                  ? 'bg-red-900/30 text-red-300 border-red-500/30'
                  : 'bg-green-900/30 text-green-300 border-green-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {isError ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="relative bg-[#0f0f1a]/90 backdrop-blur-xl rounded-2xl p-6 border border-pink-500/20 shadow-2xl max-w-2xl w-full overflow-hidden"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Scanning line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-500/5 to-transparent animate-scan"></div>
      
      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white" style={{ textShadow: '0 0 20px rgba(236,72,153,0.5)' }}>
            Agregar Varias Palabras
          </h2>
        </div>
        <motion.button
          onClick={() => {
            setMode('select');
            setWords(['']);
            setMessage('');
          }}
          className="text-pink-300/60 hover:text-pink-300 text-sm font-medium transition-colors flex items-center gap-1"
          whileHover={{ x: -3 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </motion.button>
      </div>
      
      <form onSubmit={handleMultipleSubmit} className="relative space-y-4">
        <div className="max-h-80 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          <AnimatePresence>
            {words.map((w, index) => (
              <motion.div 
                key={index} 
                className="flex gap-2 items-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
              >
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={w}
                    onChange={(e) => updateWord(index, e.target.value)}
                    maxLength={5}
                    className="w-full bg-[#1a1a2e]/90 backdrop-blur-md border border-pink-500/30 text-white placeholder-pink-300/30 rounded-xl px-4 py-2 uppercase text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder={`#${index + 1}`}
                    disabled={isLoading}
                  />
                </div>
                {words.length > 1 && (
                  <motion.button
                    type="button"
                    onClick={() => removeWordField(index)}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold hover:scale-110 transition-transform disabled:opacity-50"
                    disabled={isLoading}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 relative">
          <motion.button
            type="button"
            onClick={addWordField}
            disabled={words.length >= 20 || isLoading}
            className="relative group flex-1 overflow-hidden rounded-xl"
            whileHover={{ scale: words.length >= 20 || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: words.length >= 20 || isLoading ? 1 : 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative bg-transparent text-white font-semibold py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Agregar campo ({words.length}/20)</span>
            </div>
          </motion.button>
          
          <motion.button
            type="submit"
            disabled={isLoading}
            className="relative group flex-1 overflow-hidden rounded-xl"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy"></div>
            <div className="relative bg-transparent text-white font-black py-3 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-2 disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Agregando...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Agregar Todas</span>
                </>
              )}
            </div>
          </motion.button>
        </div>
      </form>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`relative mt-4 p-3 rounded-xl border ${
              isError
                ? 'bg-red-900/30 text-red-300 border-red-500/30'
                : 'bg-green-900/30 text-green-300 border-green-500/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {isError ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm font-medium">{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236,72,153,0.3);
          border-radius: 4px;
        }
      `}</style>
    </motion.div>
  );
};

export default AddWord;