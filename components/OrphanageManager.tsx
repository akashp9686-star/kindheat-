
import React, { useState, useRef } from 'react';
import { Orphanage, ChildProfile } from '../types';

interface OrphanageManagerProps {
  orphanages: Orphanage[];
  children: ChildProfile[];
  onUpdateOrphanage: (orphanage: Orphanage) => void;
  onAddChild: (child: ChildProfile) => void;
  onUpdateChild: (child: ChildProfile) => void;
}

const OrphanageManager: React.FC<OrphanageManagerProps> = ({ 
  orphanages, 
  children, 
  onUpdateOrphanage, 
  onAddChild, 
  onUpdateChild 
}) => {
  // Use the first mock orphanage as our current managed one for this demo
  const [currentOrphanage, setCurrentOrphanage] = useState<Orphanage>(orphanages[0]);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [newChild, setNewChild] = useState<Partial<ChildProfile>>({
    name: '',
    age: 0,
    gender: 'Boy',
    bio: '',
    interests: [],
    location: currentOrphanage.name
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const childFileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateOrphanage(currentOrphanage);
    alert("Profile saved! Families will now see your updated information.");
  };

  const handleCameraClick = (type: 'orphanage' | 'child') => {
    if (type === 'orphanage') fileInputRef.current?.click();
    else childFileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'orphanage' | 'child') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'orphanage') {
          setCurrentOrphanage({ ...currentOrphanage, image: base64 });
        } else {
          setNewChild({ ...newChild, image: base64 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddChild = () => {
    if (!newChild.name || !newChild.image) {
      alert("Please provide at least a name and a photo.");
      return;
    }
    const childToAdd: ChildProfile = {
      ...newChild as ChildProfile,
      id: Date.now().toString(),
      location: currentOrphanage.name,
      interests: newChild.interests || []
    };
    onAddChild(childToAdd);
    setIsAddingChild(false);
    setNewChild({ name: '', age: 0, gender: 'Boy', bio: '', interests: [], location: currentOrphanage.name });
  };

  const orphanageChildren = children.filter(c => c.location === currentOrphanage.name);

  return (
    <div className="container mx-auto py-12 px-4 animate-slide-in">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col md:row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div>
            <span className="text-indigo-600 font-black uppercase tracking-widest text-[10px] bg-indigo-50 px-3 py-1 rounded-full">Admin Dashboard</span>
            <h1 className="text-4xl font-black text-slate-900 mt-2">Welcome, <span className="text-indigo-600">{currentOrphanage.name}</span></h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">Keep your profile updated so families can discover your sanctuary and children.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-bold transition-all border flex items-center justify-center gap-2 ${viewMode === 'preview' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
            >
              <i className={`fas ${viewMode === 'preview' ? 'fa-pen' : 'fa-eye'}`}></i>
              {viewMode === 'preview' ? 'Exit Preview' : 'View Public Profile'}
            </button>
            <button 
              onClick={() => setIsAddingChild(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-100 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-plus"></i>
              Add Child
            </button>
          </div>
        </header>

        {viewMode === 'preview' ? (
          /* PREVIEW MODE: Showing how families see this orphanage */
          <div className="animate-slide-in space-y-8">
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100">
              <div className="h-80 w-full relative">
                <img src={currentOrphanage.image} className="w-full h-full object-cover" alt="Banner" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-10">
                  <h2 className="text-4xl font-black text-white">{currentOrphanage.name}</h2>
                  <p className="text-indigo-200 font-bold flex items-center gap-2 mt-2">
                    <i className="fas fa-map-marker-alt"></i>
                    {currentOrphanage.location}
                  </p>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-xl font-bold text-slate-800 mb-4">About Us</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{currentOrphanage.description}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900">Children Waiting for Families ({orphanageChildren.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {orphanageChildren.map(child => (
                  <div key={child.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-50">
                    <img src={child.image} className="w-full h-48 object-cover rounded-2xl mb-4" />
                    <h4 className="text-xl font-bold text-slate-800">{child.name}</h4>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{child.age} Years • {child.gender}</p>
                    <button className="w-full mt-4 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100">Profile Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                  <i className="fas fa-camera-retro text-indigo-500"></i>
                  Orphanage Branding
                </h3>
                
                <div className="relative group mb-8">
                  <div className="w-full aspect-square rounded-[2rem] overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                    <img src={currentOrphanage.image} className="w-full h-full object-cover" alt="Orphanage preview" />
                  </div>
                  <button 
                    onClick={() => handleCameraClick('orphanage')}
                    className="absolute bottom-4 right-4 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-4 border-white"
                    title="Change Photo"
                  >
                    <i className="fas fa-camera text-xl"></i>
                  </button>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'orphanage')} />
                  <p className="text-center mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tap camera to upload sanctuary photo</p>
                </div>

                <form onSubmit={handleUpdateInfo} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Orphanage Name</label>
                    <input 
                      type="text" 
                      value={currentOrphanage.name} 
                      onChange={e => setCurrentOrphanage({...currentOrphanage, name: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Sanctuary Location</label>
                    <input 
                      type="text" 
                      value={currentOrphanage.location} 
                      onChange={e => setCurrentOrphanage({...currentOrphanage, location: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-semibold text-slate-700"
                      placeholder="e.g. Mumbai, Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Mission Description</label>
                    <textarea 
                      rows={4}
                      value={currentOrphanage.description} 
                      onChange={e => setCurrentOrphanage({...currentOrphanage, description: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-slate-600 leading-relaxed"
                    />
                  </div>
                  <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                    <i className="fas fa-save"></i>
                    Publish Updates
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <i className="fas fa-child text-indigo-500"></i>
                  Children Directory ({orphanageChildren.length})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orphanageChildren.map(child => (
                  <div key={child.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-lg flex gap-6 items-center hover:border-indigo-100 transition-all group relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 shadow-md">
                      <img src={child.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-800">{child.name}</h4>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter mb-2">{child.age} yrs • {child.gender}</p>
                      <div className="flex gap-3">
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                          <i className="fas fa-edit"></i> Edit
                        </button>
                        <button className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:underline flex items-center gap-1">
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setIsAddingChild(true)}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all hover:bg-indigo-50"
                >
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <i className="fas fa-plus text-xl"></i>
                  </div>
                  <span className="font-bold text-sm">Add New Child Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {isAddingChild && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-slide-in">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900">Add New Child</h2>
                <button onClick={() => setIsAddingChild(false)} className="w-10 h-10 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:text-red-500 transition-colors">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group cursor-pointer" onClick={() => handleCameraClick('child')}>
                    {newChild.image ? (
                      <img src={newChild.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <i className="fas fa-camera text-3xl text-slate-300 mb-2"></i>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Tap to Shoot</p>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center leading-tight">Camera access required</p>
                  <input type="file" ref={childFileInputRef} hidden accept="image/*" onChange={(e) => handleFileChange(e, 'child')} />
                </div>

                <div className="md:w-2/3 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Full Name</label>
                      <input 
                        placeholder="e.g. Leo Smith" 
                        value={newChild.name}
                        onChange={e => setNewChild({...newChild, name: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Age</label>
                      <input 
                        type="number" 
                        placeholder="Age" 
                        value={newChild.age || ''}
                        onChange={e => setNewChild({...newChild, age: parseInt(e.target.value) || 0})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Gender</label>
                      <select 
                        value={newChild.gender}
                        onChange={e => setNewChild({...newChild, gender: e.target.value as any})}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                      >
                        <option value="Boy">Boy</option>
                        <option value="Girl">Girl</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block ml-2">Biography</label>
                    <textarea 
                      placeholder="Describe personality, likes, and dreams..." 
                      rows={4}
                      value={newChild.bio}
                      onChange={e => setNewChild({...newChild, bio: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsAddingChild(false)}
                  className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[2rem] font-black text-lg hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddChild}
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  Publish Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrphanageManager;
