import React, { useState, useEffect } from 'react';
import { UploadCloud, Sparkles, Cpu, CheckCircle, Droplets, Sun, Activity, ShoppingCart, Info, AlertTriangle } from 'lucide-react';
import aiService from '../services/aiService';
import plantService from '../services/plantService';
import { useCart } from '../context/CartContext';

export const AiDetect = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStage, setScanStage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [catalogMatch, setCatalogMatch] = useState(null);
  const [cartAdding, setCartAdding] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const { addToCart } = useCart();

  const scanStages = [
    'Initializing Neural Engine...',
    'Uploading botanical sample...',
    'Deconstructing cellular structure...',
    'Matching taxonomy database signatures...',
    'Analyzing chlorophyll density...',
    'Compiling healthcare diagnostics...'
  ];

  // Run a high-tech progressive simulated loader while backend AI scanner runs
  useEffect(() => {
    let interval;
    if (scanning) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const next = prev + Math.floor(Math.random() * 15) + 5;
          const stageIndex = Math.min(
            Math.floor((next / 100) * scanStages.length),
            scanStages.length - 1
          );
          setScanStage(scanStages[stageIndex]);
          return Math.min(next, 100);
        });
      }, 350);
    } else {
      setScanProgress(0);
      setScanStage('');
    }
    return () => clearInterval(interval);
  }, [scanning]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setCatalogMatch(null);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setCatalogMatch(null);
      setError('');
    }
  };

  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop an image file first.');
      return;
    }

    setScanning(true);
    setResult(null);
    setCatalogMatch(null);
    setError('');

    try {
      // Trigger the backend API identify call
      const data = await aiService.detectPlant(file);
      
      // Delay slightly if the simulator is extremely fast to let the user enjoy the premium scanning animation
      await new Promise(resolve => setTimeout(resolve, 3000));

      setResult(data);

      // Attempt to check if this plant exists in our store catalog so the user can purchase it immediately!
      try {
        const storePlants = await plantService.getAllPlants();
        const matched = storePlants.find(
          (p) => p.name.toLowerCase().includes(data.name.toLowerCase()) || 
                 data.name.toLowerCase().includes(p.name.toLowerCase())
        );
        if (matched) {
          setCatalogMatch(matched);
        }
      } catch (catErr) {
        console.error("Could not cross-reference catalog", catErr);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Botanical identification failed. Please try a different photo.');
    } finally {
      setScanning(false);
    }
  };

  const handleAddToCart = async () => {
    if (!catalogMatch) return;
    setCartAdding(true);
    setCartSuccess(false);
    try {
      await addToCart(catalogMatch.id, 1);
      setCartSuccess(true);
      setTimeout(() => setCartSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to add the sapling to your cart.');
    } finally {
      setCartAdding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-nature-500/10 border border-nature-500/20 px-3.5 py-1 rounded-full text-xs font-semibold text-nature-400">
          <Cpu className="h-4 w-4" />
          <span>AI Neural Engine v3.5</span>
        </div>
        <h1 className="font-outfit font-extrabold text-4xl text-slate-100">
          Instant Botanical Diagnostic Center
        </h1>
        <p className="text-slate-400 text-sm">
          Snap a photo of any houseplant or garden crop. Our algorithms will resolve taxonomy details, care instructions, and organic medicinal applications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Upload Portal */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 border border-slate-900 bg-slate-900/10">
            <h2 className="font-outfit font-bold text-lg text-slate-200 mb-4 flex items-center space-x-2">
              <UploadCloud className="h-5 w-5 text-nature-500" />
              <span>Upload Sample</span>
            </h2>

            <form onSubmit={handleScanSubmit} className="space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
                  previewUrl
                    ? 'border-nature-500/40 bg-nature-500/5'
                    : 'border-slate-800 hover:border-nature-500/20 hover:bg-slate-900/30'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer space-y-3 block">
                  {previewUrl ? (
                    <div className="relative group rounded-xl overflow-hidden max-h-64 mx-auto w-fit">
                      <img
                        src={previewUrl}
                        alt="Foliage preview"
                        className="object-cover max-h-60 rounded-xl"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <span className="text-xs font-bold text-slate-100 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
                          Replace Photo
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 py-6">
                      <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center mx-auto text-slate-500 group-hover:text-nature-400">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-300">Drag & Drop Image Here</p>
                        <p className="text-xs text-slate-500 mt-1">or click to browse local files</p>
                      </div>
                      <p className="text-[10px] text-slate-650">Supports JPG, PNG or WEBP (Max 10MB)</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Submit Scan Button */}
              <button
                type="submit"
                disabled={!file || scanning}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-nature-600 hover:brightness-110 active:scale-98 disabled:brightness-50 text-slate-950 font-bold font-outfit text-sm rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 shadow-glass"
              >
                <Sparkles className="h-4.5 w-4.5" />
                <span>{scanning ? 'Analyzing Foliage...' : 'Execute Neural Scan'}</span>
              </button>
            </form>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2 mt-4">
                <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Scanning or Results Workspace */}
        <div className="lg:col-span-7">
          {scanning && (
            // Scanning Status
            <div className="glass-panel p-12 border border-slate-900 bg-slate-900/10 text-center flex flex-col items-center justify-center space-y-8 min-h-[400px]">
              {/* Radar glowing ring animation */}
              <div className="relative h-28 w-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-nature-500/40 animate-ping"></div>
                <div className="absolute inset-2 rounded-full border border-emerald-400/20 animate-pulse-glow"></div>
                <div className="h-16 w-16 rounded-full bg-slate-950 border border-nature-500/30 flex items-center justify-center z-10">
                  <Cpu className="h-8 w-8 text-nature-500 animate-spin" style={{ animationDuration: '3s' }} />
                </div>
              </div>

              <div className="space-y-3 max-w-sm">
                <h3 className="font-outfit font-bold text-xl text-slate-200 tracking-wide">
                  Scanning Botanical Specimen
                </h3>
                <p className="text-xs text-nature-400 font-semibold h-4 transition-all duration-300">
                  {scanStage}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-md bg-slate-950 border border-slate-850 rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-glass"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {!scanning && !result && (
            // Idle Blank State
            <div className="glass-panel p-12 border border-slate-900 bg-slate-900/10 text-center flex flex-col items-center justify-center space-y-5 min-h-[400px]">
              <div className="h-16 w-16 rounded-2xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500">
                <Cpu className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-outfit font-bold text-xl text-slate-300">Diagnostics Desk Idle</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Upload a clear image of a plant leaf or bloom on the left and submit it to display diagnostic findings.
                </p>
              </div>
            </div>
          )}

          {!scanning && result && (
            // Results Display Card
            <div className="glass-panel p-8 border border-slate-900 bg-slate-900/10 space-y-8 animate-fade-in-up">
              {/* Result Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900">
                <div className="space-y-1">
                  <div className="inline-flex items-center bg-slate-950 border border-slate-850 text-xs px-2.5 py-0.5 rounded-full text-slate-400 font-medium mb-1">
                    {result.category}
                  </div>
                  <h2 className="font-outfit font-extrabold text-3xl text-slate-200">
                    {result.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-400 italic">
                    {result.scientificName}
                  </p>
                </div>

                <div className="bg-nature-500/10 border border-nature-500/20 px-4 py-3 rounded-2xl text-center sm:text-right w-fit">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 leading-none block mb-1">
                    Match Confidence
                  </span>
                  <span className="font-outfit text-2xl font-extrabold text-nature-400 leading-none">
                    {result.confidence}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Info className="h-4 w-4 text-nature-500" />
                  <span>Taxonomic Profile</span>
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 border border-slate-900 rounded-2xl">
                  {result.description}
                </p>
              </div>

              {/* 2-Column Details: Benefits vs Care Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Benefits */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span>Biological Benefits</span>
                  </h3>
                  <ul className="space-y-3">
                    {result.benefits?.map((benefit, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-350 leading-normal">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Care Tips */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Droplets className="h-4 w-4 text-teal-400" />
                    <span>Recommended Care Routines</span>
                  </h3>
                  <ul className="space-y-3">
                    {result.careTips?.map((tip, idx) => (
                      <li key={idx} className="flex items-start text-xs text-slate-350 leading-normal">
                        <div className="bg-slate-950 border border-slate-850 p-1.5 rounded-lg mr-2.5 mt-0.5 flex-shrink-0">
                          {idx === 0 ? (
                            <Droplets className="h-3 w-3 text-teal-400" />
                          ) : idx === 1 ? (
                            <Sun className="h-3 w-3 text-amber-400" />
                          ) : (
                            <Info className="h-3 w-3 text-nature-400" />
                          )}
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* E-Commerce Shortcut Cross-reference Banner */}
              {catalogMatch && (
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                  <div className="space-y-1">
                    <h4 className="font-outfit font-bold text-slate-200 text-base">
                      Available in our Greenhouse!
                    </h4>
                    <p className="text-xs text-slate-400">
                      We have healthy sprouts of {catalogMatch.name} ready for shipping.
                    </p>
                    <span className="text-xs font-black text-nature-400 block pt-1">
                      ${catalogMatch.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={cartAdding || cartSuccess}
                    className={`px-5 py-3 rounded-xl font-bold font-outfit text-xs flex items-center justify-center space-x-2 transition-all duration-300 ${
                      cartSuccess
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-nature-500 text-slate-950 hover:brightness-110 active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      {cartAdding
                        ? 'Adding...'
                        : cartSuccess
                        ? 'Added Successfully!'
                        : 'Add to Cart Now'}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiDetect;
