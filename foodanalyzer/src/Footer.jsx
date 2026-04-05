import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#edeeea] w-full rounded-t-[3rem] mt-20 font-body">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 w-full text-center md:text-left max-w-[95vw] mx-auto">
        <div className="space-y-6">
          <div className="text-lg font-black text-[#154212] font-heading uppercase">NutriScan</div>
          <p className="text-[#42493e] text-sm leading-relaxed max-w-xs mx-auto md:mx-0">Your ultimate guide to understanding what you eat. Scan, analyze, and optimize your nutrition.</p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary hover:scale-110 transition-transform" href="#">
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-xs font-black uppercase tracking-widest text-[#154212] mb-8">Platform</h4>
          <ul className="space-y-4 font-body font-semibold text-xs uppercase tracking-widest text-[#42493e]">
            <li><a className="hover:opacity-70 transition-opacity" href="#">Help Center</a></li>
            <li><a className="hover:opacity-70 transition-opacity" href="#">Privacy Policy</a></li>
            <li><a className="hover:opacity-70 transition-opacity" href="#">Terms of Service</a></li>
            <li><a className="hover:opacity-70 transition-opacity" href="#">Shipping</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading text-xs font-black uppercase tracking-widest text-[#154212] mb-8">Newsletter</h4>
          <p className="text-[#42493e] text-xs uppercase tracking-widest mb-6">Weekly health tips in your inbox.</p>
          <div className="flex bg-surface rounded-full p-1 border border-outline-variant/20 mx-auto md:mx-0 max-w-xs">
            <input className="bg-transparent border-none focus:ring-0 w-full px-4 text-[10px] font-black tracking-widest" placeholder="EMAIL ADDRESS" type="email"/>
            <button className="bg-primary text-on-primary px-4 py-2 rounded-full text-[10px] font-black uppercase">Join</button>
          </div>
        </div>
      </div>
      <div className="border-t border-outline-variant/10 px-12 py-8 text-center">
        <p className="font-body text-xs uppercase tracking-widest text-[#42493e] opacity-60">© 2024 NutriScan. Crafted for a healthier life.</p>
      </div>
    </footer>
  );
};

export default Footer;
