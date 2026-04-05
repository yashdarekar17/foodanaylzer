import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-[95vw] mx-auto px-8 mb-24 lg:mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-widest">Our Story</div>
              <h1 className="text-5xl lg:text-7xl font-heading font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1]">
                About <span className="text-primary italic">NutriScan</span>
              </h1>
              <p className="text-xl text-on-surface-variant leading-relaxed mb-10 max-w-xl">
                Welcome to NutriScan, your dedicated companion on the journey to optimal health and wellness. We understand that navigating the world of nutrition can be overwhelming, and that's why we're here to help you make healthier dietary choices with ease.
              </p>
            </div>
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-10"></div>
              <div className="rounded-xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-700">
                <img className="w-full h-[500px] object-cover" alt="overhead shot of a vibrant assortment of fresh vegetables" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6QZxRSbhGuPWNl1BrSCAuvfORc3ZrDLB7bp3DI9Gz8R1kLYPOmNAm01eIZrMaB9B771ltLqaUMobSR47cALIrcuu9bQb40v_pfJTl7IDmdzTgJaxhzdMNjXDGkauVZGBu1hQmVGJpVPPpI9Dr3Y-p7GeHrQIBnhpmSCw0ALHD0UcGVI-U5y08WtkfeCVILZrVwojEAPWdGaXfn3mwLVmYP_frjhcl0l7bPL0g8S806Vf5Tahf9zzgG2LXRSQNsMlJNmx5sTScKywN" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-surface-container-lowest p-6 rounded-lg shadow-xl max-w-xs border border-outline-variant/10">
                <p className="text-sm font-medium italic text-on-surface-variant">"Empowering millions to understand what's on their plate, one scan at a time."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Purpose */}
        <section className="bg-surface-container-low py-24 mb-24">
          <div className="max-w-[95vw] mx-auto px-8">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <span className="material-symbols-outlined text-3xl">restaurant</span>
              </div>
              <h2 className="text-4xl font-heading font-bold tracking-tight mb-6">Our Purpose</h2>
              <p className="max-w-2xl text-lg text-on-surface-variant">
                At NutriScan, our purpose is simple: to bridge the gap between food and informed decision-making. We believe that everyone deserves access to clear, accurate information about the nutritional content of the products they consume.
              </p>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section className="max-w-[95vw] mx-auto px-8 mb-32">
          <h2 className="text-3xl font-heading font-bold mb-12 text-center lg:text-left">Features at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search Card */}
            <div className="col-span-1 md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)] border border-outline-variant/5 hover:shadow-md transition-shadow group">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-secondary-container rounded-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-secondary-container">search</span>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold mb-3">Seamless Search</h3>
                  <p className="text-on-surface-variant">Access our extensive database of thousands of food items. Find detailed nutritional profiles instantly with just a few keystrokes.</p>
                </div>
              </div>
            </div>

            {/* Upload Card */}
            <div className="bg-primary text-on-primary p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)] relative overflow-hidden group">
              <div className="relative z-10">
                <div className="p-4 bg-primary-container rounded-lg inline-block mb-6 group-hover:rotate-12 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container">cloud_upload</span>
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">Instant Upload</h3>
                <p className="text-on-primary-container/80 text-sm">Snap a photo of your meal or scan a barcode to get real-time data on the go.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10">
                <span className="material-symbols-outlined text-[120px]">camera</span>
              </div>
            </div>

            {/* Breakdown Card */}
            <div className="bg-surface-container p-8 rounded-xl border border-outline-variant/5">
              <div className="p-4 bg-tertiary-fixed rounded-lg inline-block mb-6">
                <span className="material-symbols-outlined text-on-tertiary-fixed">bar_chart</span>
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">View Breakdowns</h3>
              <p className="text-on-surface-variant text-sm">Deep dive into macros, micros, and allergens with our beautiful visual analytics.</p>
            </div>

            {/* Track Card */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)] border border-outline-variant/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary-fixed rounded-lg">
                  <span className="material-symbols-outlined text-on-primary-fixed">calendar_today</span>
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold">Track Trends</h3>
                  <p className="text-sm text-on-surface-variant">Monitor your intake history over time.</p>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-[#e8f5e9] p-8 rounded-xl flex items-center gap-4">
              <span className="material-symbols-outlined text-[#2e7d32]">verified_user</span>
              <span className="font-semibold text-[#1b5e20]">All your data is secure &amp; encrypted.</span>
            </div>
          </div>
        </section>

        {/* Who Is It For? */}
        <section className="max-w-[95vw] mx-auto px-8 mb-32">
          <div className="bg-secondary p-12 lg:p-20 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 ">
              <img className="w-full h-full object-cover" alt="abstract soft focus of vibrant green leaves" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgx3HFMl4EHDnhF-nY9dSRhbWIxN4TtnzbzBHTwfpKfYk6IkHV7nTDm7hteZHyCZDmfm-GcuIPWmEguLUE89fXgjFSCGy8vyGkY1WCdFJodDo9DLITIK7iKjUrZfQopsypXCsXVoBHeis6zp9rpWu4tpoSXr1j7VxdDBC_XBSDcT7u6aQKwl_O8naOkhlWNvOfCtmSualc4xG3ADt4Sf9P5GpZrg61Ddaoj5Hb5Zy1u6yRkaR8FWLDg7aa4xPtn9wSdFuLjMsUwmr_" />
            </div>
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-heading font-bold text-white mb-8">Who is NutriScan for?</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xs text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Health-Conscious Individuals</p>
                      <p className="text-white/70">Those looking to optimize their daily nutrition intake.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xs text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Fitness Enthusiasts</p>
                      <p className="text-white/70">Athletes tracking precise macros for performance goals.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-xs text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">Dietitians &amp; Coaches</p>
                      <p className="text-white/70">Professionals needing reliable tools for client success.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
                <h4 className="text-white font-heading font-bold mb-4">Why users love us?</h4>
                <p className="text-white/80 italic mb-6">"NutriScan turned my guesswork into science. I finally feel in control of what I eat without the stress of complicated apps."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary"></div>
                  <div>
                    <p className="text-white text-sm font-bold">Sarah Jenkins</p>
                    <p className="text-white/50 text-xs">Wellness Blogger</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey & Vision */}
        <section className="max-w-4xl mx-auto px-8 mb-32 text-center">
          <h2 className="text-4xl font-heading font-bold mb-8">Our Journey &amp; Vision</h2>
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
            <p>
              What started as a passion project born out of a desire for better health has evolved into a comprehensive nutritional platform. Our team is dedicated to continuous improvement and innovation, striving to bring you the best features and the most accurate data available.
            </p>
            <p>
              We envision a future where everyone has the knowledge and resources to prioritize their health through better nutrition. We're committed to expanding our platform, fostering a supportive community, and empowering individuals to live their healthiest lives.
            </p>
          </div>
        </section>

        {/* Connect With Us */}
        <section className="max-w-[95vw] mx-auto px-8">
          <div className="bg-surface-container-high rounded-xl p-12 text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">Join our community</h2>
            <p className="text-on-surface-variant mb-10 max-w-xl mx-auto">Have questions or want to learn more? We'd love to hear from you. Get in touch with our team today.</p>
            <a className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg group" href="/Contact">
              Connect With Us
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;