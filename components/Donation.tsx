
import React, { useState } from 'react';
import { Orphanage } from '../types';
import { findNearbyOrphanages } from '../services/geminiService';

interface ReceiptDetails {
  transactionId: string;
  amount: number;
  date: string;
  orphanage: string;
  donorName: string;
}

interface DonationProps {
  orphanages: Orphanage[];
}

const Donation: React.FC<DonationProps> = ({ orphanages }) => {
  const [amount, setAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [selectedOrphanageId, setSelectedOrphanageId] = useState<string>('all');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFindingNearby, setIsFindingNearby] = useState(false);
  const [nearbyResults, setNearbyResults] = useState<{name: string, location: string}[]>([]);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  // Receipt data
  const [receiptDetails, setReceiptDetails] = useState<ReceiptDetails | null>(null);

  const presets = [500, 1000, 2000, 5000, 10000];

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalAmount = amount !== null ? amount : parseFloat(customAmount);

    if (isNaN(finalAmount) || finalAmount < 100) {
      setError('Minimum donation amount is ₹100');
      return;
    }

    const orphanageName = selectedOrphanageId === 'all' 
      ? 'KindHeart General Fund' 
      : orphanages.find(o => o.id === selectedOrphanageId)?.name || selectedOrphanageId;

    const details: ReceiptDetails = {
      transactionId: 'KH-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      amount: finalAmount,
      date: new Date().toLocaleString(),
      orphanage: orphanageName,
      donorName: `${firstName} ${lastName}`
    };

    setReceiptDetails(details);
    setIsSuccess(true);
  };

  const downloadReceipt = () => {
    if (!receiptDetails) return;

    const receiptContent = `
=========================================
      KINDHEART DONATION RECEIPT
=========================================

Transaction ID: ${receiptDetails.transactionId}
Date:           ${receiptDetails.date}

DONOR INFORMATION:
Name:           ${receiptDetails.donorName}
Email:          ${email}

DONATION DETAILS:
Amount:         ₹${receiptDetails.amount.toLocaleString('en-IN')}
Frequency:      ${frequency === 'one-time' ? 'One-time Donation' : 'Monthly Contribution'}
Destination:    ${receiptDetails.orphanage}

KindHeart is a registered non-profit organization.
This receipt serves as a confirmation of your contribution.
Donations are eligible for tax benefits under Section 80G.

Thank you for your kindness!
KindHeart Platform Team
=========================================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `KindHeart_Receipt_${receiptDetails.transactionId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFindNearby = () => {
    setIsFindingNearby(true);
    setNearbyResults([]);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsFindingNearby(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const result = await findNearbyOrphanages(latitude, longitude);
          
          // Extract URLs from groundingChunks as required by Gemini API guidelines.
          const mapsResults = (result.sources as any[])
            .filter(chunk => chunk.maps)
            .map(chunk => ({
              name: chunk.maps.title || "Nearby Sanctuary",
              location: chunk.maps.uri || "#"
            }));

          if (mapsResults.length > 0) {
            setNearbyResults(mapsResults);
          } else {
            setError("No specific orphanages identified nearby via Maps grounding.");
          }
        } catch (err) {
          console.error(err);
          setError("Could not complete nearby search. Please try again.");
        } finally {
          setIsFindingNearby(false);
        }
      },
      () => {
        setError("Location access denied. Please enable location to find nearby orphanages.");
        setIsFindingNearby(false);
      }
    );
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/2 space-y-8 lg:sticky lg:top-24">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 leading-tight">
            Your support changes <span className="text-indigo-600 underline decoration-indigo-200">lives.</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            KindHeart funds orphanages directly. Your contribution provides quality education, healthcare, and nutritious meals to children in need across the region.
          </p>
          
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-video md:aspect-[4/3] lg:aspect-video group">
            <img 
              src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800&auto=format&fit=crop" 
              alt="Happy children together" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
              <p className="text-white font-medium italic text-lg leading-snug">"The support we received from KindHeart changed my students' lives completely."</p>
              <p className="text-white/80 text-sm mt-3 font-bold tracking-wide uppercase">— Maria, Head of Hope Orphanage</p>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 w-full">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 opacity-50"></div>
            
            {isSuccess ? (
              <div className="text-center py-12 animate-fade-in space-y-8">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-lg shadow-emerald-50">
                  <i className="fas fa-check"></i>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-slate-800">Donation Successful!</h3>
                  <p className="text-slate-500 mt-4 text-lg">Thank you, {receiptDetails?.donorName}. Your gift of ₹{receiptDetails?.amount.toLocaleString('en-IN')} will make a huge difference.</p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Transaction ID</span>
                    <span className="text-slate-900 font-mono font-bold">{receiptDetails?.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Destination</span>
                    <span className="text-slate-900 font-bold">{receiptDetails?.orphanage}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={downloadReceipt}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-3"
                  >
                    <i className="fas fa-file-download"></i>
                    Download Receipt
                  </button>
                  <button 
                    onClick={() => {
                      setIsSuccess(false);
                      setFirstName('');
                      setLastName('');
                      setEmail('');
                      setCustomAmount('');
                      setAmount(500);
                    }}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl"
                  >
                    Make another donation
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-8">
                {/* Orphanage Selection */}
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Select Destination</h3>
                    <button 
                      type="button" 
                      onClick={handleFindNearby}
                      disabled={isFindingNearby}
                      className="text-indigo-600 text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-70 disabled:opacity-50"
                    >
                      {isFindingNearby ? (
                        <i className="fas fa-circle-notch animate-spin"></i>
                      ) : (
                        <i className="fas fa-location-crosshairs"></i>
                      )}
                      Find Near Me
                    </button>
                  </div>

                  <div className="space-y-3">
                    <select 
                      value={selectedOrphanageId} 
                      onChange={(e) => setSelectedOrphanageId(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">KindHeart General Fund (Shared by all)</option>
                      {orphanages.map(org => (
                        <option key={org.id} value={org.id}>{org.name} - {org.location}</option>
                      ))}
                    </select>
                    
                    {nearbyResults.length > 0 && (
                      <div className="bg-indigo-50 p-4 rounded-2xl animate-slide-in border border-indigo-100">
                        <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2">Nearby Sanctuary Suggestions</p>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                          {nearbyResults.map((res, idx) => (
                            <div 
                              key={idx}
                              className="whitespace-nowrap bg-white px-4 py-3 rounded-xl shadow-sm border border-indigo-100 flex flex-col gap-1 min-w-[140px]"
                            >
                              <button 
                                type="button"
                                onClick={() => setSelectedOrphanageId(res.name)}
                                className="text-left"
                              >
                                <div className="text-indigo-600 font-bold text-xs hover:underline decoration-indigo-200">{res.name}</div>
                              </button>
                              <a 
                                href={res.location} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[9px] text-slate-400 hover:text-indigo-500 transition-colors flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <i className="fas fa-external-link-alt text-[8px]"></i>
                                View on Maps
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Amount Selection */}
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Choose Amount</h3>
                  <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                    <button 
                      type="button"
                      onClick={() => setFrequency('one-time')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${frequency === 'one-time' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Give Once
                    </button>
                    <button 
                      type="button"
                      onClick={() => setFrequency('monthly')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${frequency === 'monthly' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Monthly Gift
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      {presets.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => { setAmount(p); setCustomAmount(''); setError(null); }}
                          className={`py-4 border-2 rounded-2xl text-lg font-extrabold transition-all ${amount === p ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md' : 'border-slate-100 hover:border-indigo-200 text-slate-500 bg-white'}`}
                        >
                          ₹{p}
                        </button>
                      ))}
                    </div>

                    <div className="w-full md:w-48 flex flex-col">
                      <div className={`relative flex-1 group rounded-2xl border-2 transition-all p-4 bg-slate-50 ${customAmount ? 'border-indigo-600 bg-white shadow-md' : 'border-slate-100 focus-within:border-indigo-400'}`}>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Custom Amount</label>
                        <div className="relative flex items-center">
                          <span className={`text-xl font-bold mr-1 ${customAmount ? 'text-indigo-600' : 'text-slate-400'}`}>₹</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            min="100"
                            value={customAmount}
                            onChange={(e) => { 
                              setCustomAmount(e.target.value); 
                              setAmount(null); 
                              setError(null);
                            }}
                            className="w-full bg-transparent focus:outline-none text-xl font-extrabold text-slate-800 placeholder:text-slate-300"
                          />
                        </div>
                        <div className="absolute bottom-2 right-4">
                           <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Min. ₹100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm font-semibold animate-slide-in">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        required 
                      />
                    </div>
                    <div className="space-y-1">
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                        required 
                      />
                    </div>
                  </div>
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    required 
                  />
                  
                  <div className="pt-6">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Secure Payment</h4>
                    <div className="flex flex-col sm:flex-row gap-4 mb-4">
                      <button type="button" className="flex-1 py-4 border-2 border-indigo-600 rounded-2xl flex items-center justify-center gap-3 text-indigo-600 font-bold bg-indigo-50/50 hover:bg-indigo-50 transition-all">
                        <i className="far fa-credit-card"></i> UPI / Card
                      </button>
                      <button type="button" className="flex-1 py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all">
                        <i className="fas fa-university"></i> Net Banking
                      </button>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-indigo-600 text-white font-extrabold rounded-3xl hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 text-xl flex items-center justify-center gap-3 group">
                  <span>Donate Now</span>
                  <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
