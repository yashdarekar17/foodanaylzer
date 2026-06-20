import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const Chatbot = () => {
    return (
        <div className="min-h-screen bg-surface flex flex-col font-body">
            <Navbar />
            
            <main className="flex-grow pt-32 pb-20 px-6 container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/30 text-secondary font-black text-[10px] uppercase tracking-widest mb-6">
                        <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                        AI Health Assistant
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-black text-on-surface mb-4 tracking-tight">
                        NutriScan <span className="text-secondary">Companion</span>
                    </h1>
                    <p className="text-on-surface-variant max-w-2xl mx-auto font-bold text-sm md:text-base leading-relaxed">
                        Got questions about your diet, food allergies, or nutritional goals? 
                        Our AI assistant is here to help you 24/7.
                    </p>
                </div>

                {/* Chat Container */}
                <div className="bg-surface-container-lowest rounded-[3rem] p-4 md:p-8 border border-outline-variant/30 shadow-bloom overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="relative aspect-[4/3] md:aspect-auto md:h-[700px] w-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-surface-container-low border border-outline-variant/20 shadow-inner">
                        <iframe
                            src="https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2025/08/03/16/20250803165730-FFDU497E.json"
                            title="AI Chatbot"
                            className="w-full h-full border-none"
                            allow="microphone"
                        ></iframe>
                    </div>
                </div>

                {/* Quick Help Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {[
                        { icon: 'nutrition', label: 'Dietary Advice' },
                        { icon: 'info', label: 'Food Facts' },
                        { icon: 'history', label: 'Analysis History' }
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 bg-surface-container-low/50 px-6 py-4 rounded-3xl border border-outline-variant/10">
                            <span className="material-symbols-outlined text-secondary opacity-60">{item.icon}</span>
                            <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{item.label}</span>
                        </div>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Chatbot;
