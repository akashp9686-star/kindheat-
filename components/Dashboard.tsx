
import React, { useState, useMemo } from 'react';
import { ChildProfile, Orphanage } from '../types';

interface DashboardProps {
  orphanages: Orphanage[];
  children: ChildProfile[];
}

const Dashboard: React.FC<DashboardProps> = ({ orphanages, children }) => {
  const [selectedOrphanage, setSelectedOrphanage] = useState<Orphanage | null>(null);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [childFilter, setChildFilter] = useState<'All' | 'Boy' | 'Girl'>('All');

  const childrenInOrphanage = useMemo(() => {
    if (!selectedOrphanage) return [];
    return children.filter(child => 
      child.location === selectedOrphanage.name && 
      (childFilter === 'All' || child.gender === childFilter)
    );
  }, [selectedOrphanage, childFilter, children]);

  const handleBackToOrphanages = () => {
    setSelectedOrphanage(null);
    setChildFilter('All');
  };

  if (selectedOrphanage) {
    return (
      <div className="container mx-auto py-8 px-4 animate-slide-in">
        <div className="mb-8">
          <button 
            onClick={handleBackToOrphanages}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:underline mb-6 group"
          >
            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            Back to Orphanages
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                <img src={selectedOrphanage.image} className="w-full h-full object-cover" alt={selectedOrphanage.name} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-900">{selectedOrphanage.name}</h1>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <i className="fas fa-map-marker-alt text-indigo-500"></i>
                  {selectedOrphanage.location}
                </p>
              </div>
            </div>
            
            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
              {(['All', 'Boy', 'Girl'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setChildFilter(f)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${childFilter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {childrenInOrphanage.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {childrenInOrphanage.map(child => (
              <div 
                key={child.id} 
                className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedChild(child)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={child.image} alt={child.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-black text-indigo-600 shadow-sm">
                    {child.age} Years
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${child.gender === 'Boy' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                      {child.gender}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-800">{child.name}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {child.bio}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {child.interests.slice(0, 2).map(i => (
                      <span key={i} className="text-[10px] font-bold bg-indigo-50 text-indigo-500 px-3 py-1 rounded-lg uppercase">#{i}</span>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl group-hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-100 group-hover:shadow-indigo-100">
                    Meet {child.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
              <i className="fas fa-child"></i>
            </div>
            <h3 className="text-xl font-bold text-slate-800">No children match this criteria</h3>
            <p className="text-slate-500 mt-2">Try changing your filter or check back later.</p>
          </div>
        )}

        {/* Child Detail Modal */}
        {selectedChild && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
            <div className="bg-white w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-2xl animate-slide-in relative">
              <button 
                onClick={() => setSelectedChild(null)}
                className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/30"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 h-[400px] lg:h-[600px]">
                  <img src={selectedChild.image} className="w-full h-full object-cover" alt={selectedChild.name} />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-14 space-y-8 flex flex-col justify-center">
                  <div>
                    <span className="text-indigo-600 font-black tracking-widest uppercase text-xs mb-2 block">Available for Adoption</span>
                    <h2 className="text-5xl font-black text-slate-900">{selectedChild.name}</h2>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-bold text-sm">
                        <i className="fas fa-birthday-cake"></i>
                        <span>{selectedChild.age} Years</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 text-slate-500 rounded-lg font-bold text-sm">
                        <i className="fas fa-home"></i>
                        <span>{selectedChild.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                    <p>{selectedChild.bio}</p>
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-4 items-start">
                      <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <p className="text-sm text-amber-800">Interested in learning more about {selectedChild.name}'s journey? You can start an inquiry process which includes home visits and legal counseling.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Favorite Things</h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedChild.interests.map(i => (
                        <span key={i} className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-2xl text-sm font-bold border border-slate-200">
                          {i}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button className="flex-1 bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 flex items-center justify-center gap-3">
                      Start Adoption Inquiry
                      <i className="fas fa-heart"></i>
                    </button>
                    <button className="w-20 h-20 border-2 border-slate-100 text-slate-300 rounded-3xl hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all flex items-center justify-center">
                      <i className="far fa-bookmark text-2xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 animate-slide-in">
      <div className="max-w-4xl mb-12">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">Partner <span className="text-indigo-600">Orphanages</span></h1>
        <p className="text-xl text-slate-500 mt-4 leading-relaxed">Explore the loving environments where our children are cared for. Select an orphanage to meet the wonderful children waiting for their forever homes.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {orphanages.map(orphanage => (
          <div 
            key={orphanage.id}
            onClick={() => setSelectedOrphanage(orphanage)}
            className="group bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all cursor-pointer transform hover:-translate-y-2"
          >
            <div className="relative h-72 overflow-hidden">
              <img src={orphanage.image} alt={orphanage.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black shadow-xl">
                  View Children
                </button>
              </div>
              <div className="absolute top-6 left-6">
                <div className="px-4 py-2 bg-indigo-600/90 backdrop-blur-sm text-white rounded-xl text-xs font-black tracking-widest uppercase">
                  Active Partner
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-black text-slate-800">{orphanage.name}</h3>
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                  <i className="fas fa-chevron-right"></i>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-sm mb-4">
                <i className="fas fa-map-marker-alt text-indigo-400"></i>
                {orphanage.location}
              </div>
              <p className="text-slate-500 leading-relaxed line-clamp-2">
                {orphanage.description}
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {children.filter(c => c.location === orphanage.name).slice(0, 3).map((child, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-4 border-white overflow-hidden shadow-sm">
                      <img src={child.image} className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">
                    +{children.filter(c => c.location === orphanage.name).length}
                  </div>
                </div>
                <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">See Profiles</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
