import React from "react";
import { Link } from "react-router-dom";
import { 
  Map, 
  ShieldAlert, 
  Activity, 
  Vote, 
  Brain, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Globe 
} from "lucide-react";

const LandingPage = () => {
  // Stats telemetry (measuring things from a distance) tracking simulation
  const stats = [
    { label: "Active Incidents Tracked", value: "24/7", icon: <Activity className="text-indigo-600" size={20} /> },
    { label: "Community Validations", value: "100%", icon: <Vote className="text-emerald-600" size={20} /> },
    { label: "Rule Validation Layers", value: "3-Tier", icon: <Brain className="text-blue-600" size={20} /> },
  ];

  const features = [
    {
      icon: <Map className="text-indigo-600" size={24} />,
      title: "Geospatial Intelligence Map",
      description: "Interactive dark-canvas custom mapping engine that lets operators pan, filter, and dynamically zoom straight to localized crisis perimeters."
    },
    {
      icon: <Brain className="text-blue-600" size={24} />,
      title: "Rule-Based Validation Engine",
      description: "Under-the-hood algorithmic filters process incoming field reports against strict programmatic validation rules, verifying data affinity across strict consistency parameters."
    },
    {
      icon: <Layers className="text-emerald-600" size={24} />,
      title: "Multi-Source Cross-Checking",
      description: "Every crisis ticket submitted undergoes automated cross-checking against localized weather metrics, community consensus voting arrays, and social validation."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      
      {/* 1. STICKY NAVIGATION BAR */}
      <nav className="sticky top-0 z-[1000] bg-white/80 backdrop-blur-md border-b border-gray-200 navbar-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <ShieldAlert size={20} />
            </div>
            <span className="font-black text-xl tracking-tight text-gray-900">
              FAEAS
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-md hover:shadow-indigo-100"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="relative overflow-hidden bg-white border-b border-gray-100 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Context Branding */}
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 uppercase tracking-wide">
              <Globe size={12} className="animate-pulse" /> Resilient Disaster Infrastructure
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Next-Gen Geospatial <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                Emergency Response
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A comprehensive tracking framework utilizing automated 3-tier reporting verification. Connect crowdsourced community validation loops with high-speed analytical mapping to deploy precision response channels during critical flood and earthquake crises.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/map"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-xl hover:shadow-indigo-200 gap-2 group text-sm"
              >
                Launch Active Coverage Map
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition text-sm border border-gray-200"
              >
                Report an Incident
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup Container */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-3 aspect-[4/3] flex flex-col overflow-hidden group">
              {/* Fake Application Window Header */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-800 bg-slate-950 rounded-t-xl">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">FAEAS-LIVE-AREA-COVERAGE</span>
                <span className="w-8"></span>
              </div>
              
              {/* Fake Map Content Canvas Area */}
              <div className="flex-1 bg-slate-950 relative flex items-center justify-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                <div className="absolute top-4 left-4 bg-slate-900/90 border border-slate-700/50 p-2.5 rounded-xl text-white space-y-1 shadow-2xl">
                  <span className="text-[8px] uppercase tracking-wider text-indigo-400 font-black block">System Telemetry</span>
                  <span className="text-xs font-black block">Dynamic Viewport Mounted</span>
                </div>
                
                {/* Simulated Map Marker Pins */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce bg-rose-500 p-2 rounded-full text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-white/20">
                  <ShieldAlert size={18} />
                </div>
                <div className="absolute bottom-1/4 right-1/4 bg-blue-500 p-1.5 rounded-full text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-white/20">
                  <Activity size={12} />
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. TELEMETRY STATS BAR */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center division-y md:divide-y-0 md:divide-x divide-gray-200">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-center gap-4 px-6 py-2">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                  <p className="text-xs font-semibold text-gray-500 tracking-tight uppercase">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SYSTEM FEATURES CORE SHOWCASE */}
      <section className="py-20 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="text-xs font-bold text-indigo-600 tracking-widest uppercase">System Pillars</h2>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Engineered for Stability & Velocity
          </h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            Architectural blueprints developed to eliminate reporting pipelines lag during environmental catastrophes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
            >
              <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl w-fit mb-5">
                {feat.icon}
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                {feat.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. VERIFICATION TIMELINE FLUID MAP LAYER */}
      <section className="bg-white border-y border-gray-200 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Timeline Documentation Copy */}
            <div className="space-y-6">
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Rigorous Report Processing Flow
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To prevent false alarms or malicious reports from cluttering dispatcher queues, every record submitted travels through a strict automated filtering workflow.
              </p>
              
              <div className="space-y-4 pt-2">
                {[
                  { step: "01", name: "Meteorological API Context Validation", desc: "Cross-checks earthquake reports against live seismic inputs or atmospheric telemetry instantly." },
                  { step: "02", name: "Democratic Community Voting Mechanics", desc: "Allows verified adjacent civilian nodes to validate the crisis ticket via real-time voting weights." },
                  { step: "03", name: "Rule-Based Trust Assessment", desc: "A built-in algorithmic parser inspects structural metadata parameters to enforce system data standards before dispatch integration." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="font-mono font-black text-indigo-600 text-sm bg-indigo-50 px-2 py-1 rounded-md">{item.step}</span>
                    <div>
                      <h5 className="font-bold text-sm text-gray-900">{item.name}</h5>
                      <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Flow Representation Showcase */}
            <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl space-y-4 shadow-sm">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Real-time Verification Status Pipeline</span>
              
              <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></div>
                  <span className="text-xs font-bold text-gray-800">Raw Incident Log Filed</span>
                </div>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-500">PENDING</span>
              </div>

              <div className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  
                   {/* Affinity: closeness */}
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-xs font-bold    text-gray-800">Weather API Sensor Affinity Match</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold">PASSED</span>
              </div>

              <div className="bg-white border border-indigo-200 p-4 rounded-xl flex items-center justify-between shadow-md ring-1 ring-indigo-100">
                <div className="flex items-center gap-3">
                  <Brain size={16} className="text-indigo-600" />
                  <span className="text-xs font-bold text-gray-900">Rule-Based Trust Verified</span>
                </div>
                <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded font-black text-white">CONFIRMED</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CONTEXT FOOTER ACADEMIC CITATION */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="text-sm font-bold text-white tracking-tight">
              Flood and Earthquake Alert System (FAEAS)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Developed as an integrated software engineering framework for smart disaster resilience.
            </p>
          </div>
          <div className="text-xs text-gray-500 border-t md:border-t-0 border-gray-800 pt-4 md:pt-0">
            &copy; {new Date().getFullYear()} FAEAS Application Network Core. Built with React & Tailwind CSS.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;