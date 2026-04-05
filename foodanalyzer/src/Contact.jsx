import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Technical Support',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for contacting us!');
    setFormData({ name: '', email: '', topic: 'Technical Support', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-[95vw] mx-auto w-full">
        {/* Hero Section */}
        <section className="mb-20 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1 space-y-6 md:pr-10">
              <span className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase">Support &amp; Feedback</span>
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-on-surface tracking-tighter leading-[1.1]">
                Get in <span className="text-primary italic">Touch</span>
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
                Have questions about your nutritional scan or suggestions for our platform? We're cultivating a better experience for you. Reach out today.
              </p>
            </div>
            <div className="relative flex-1 w-full max-w-md">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-fixed rounded-full blur-3xl opacity-30"></div>
              <div className="relative rounded-xl overflow-hidden aspect-square shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)]">
                <img className="w-full h-full object-cover" alt="minimalist close-up of fresh green organic vegetables" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAAa7ZMepXN0zJO3hDss7_mh4a4FCbhkL-ERdcXfuxl8z3tIBMNutMwv4cIxbpM1OVHXN4y2ikYvwt4nOcF3AeEtNaDatURHQeE1ZAIvdg9JFYQWjnoe9TZNKX8McG_nVoRZ5I_2HsL2gjFTlz2k4dh8OkTs0eKMsPfUO0JMYIvP5bYbExXO62XvugLBKNk6Kt6_KeHG46D1x3VV9COBuMnDkfq7KvfWhNkEI5l9U2_IQtOPyLM7VQhm5j8mDoH-lx-5zMB0G605Uy" />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-surface-container-lowest p-6 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)] border border-outline-variant/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">local_florist</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-on-surface">98% Satisfaction</p>
                    <p className="text-xs text-on-surface-variant font-medium">From our community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area: Bento Grid Layout */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Form Card */}
          <div className="md:col-span-7 bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-[0_24px_48px_-12px_rgba(26,28,26,0.06)] border border-outline-variant/10">
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant px-1">Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-[1rem] p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface font-medium placeholder:text-outline/40" placeholder="Jane Doe" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant px-1">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-[1rem] p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface font-medium placeholder:text-outline/40" placeholder="jane@example.com" type="email" />
                </div>
              </div>
              <div className="space-y-2 relative">
                <label className="block text-sm font-semibold text-on-surface-variant px-1">How can we help?</label>
                <select name="topic" value={formData.topic} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-[1rem] p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface font-medium appearance-none">
                  <option value="Technical Support">Technical Support</option>
                  <option value="Nutrition Consultation">Nutrition Consultation</option>
                  <option value="Partnership Inquiry">Partnership Inquiry</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
                <div className="absolute right-4 top-[38px] pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined">expand_more</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-on-surface-variant px-1">Your Message</label>
                <textarea required name="message" value={formData.message} onChange={handleChange} className="w-full bg-surface-container-low border-none rounded-[1rem] p-4 focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-highest transition-all outline-none text-on-surface font-medium resize-none placeholder:text-outline/40" placeholder="Tell us what's on your mind..." rows="6"></textarea>
              </div>
              <button type="submit" className="w-full md:w-auto bg-primary text-on-primary px-12 py-4 rounded-full font-heading font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_24px_48px_-12px_rgba(26,28,26,0.1)]">
                Send Message
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>

          {/* Contact Info Column */}
          <div className="md:col-span-5 space-y-8">
            {/* Info Card 1 */}
            <div className="bg-surface-container p-8 rounded-xl space-y-6">
              <h3 className="text-2xl font-heading font-bold text-primary">Office Location</h3>
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary">location_on</span>
                <p className="text-on-surface-variant leading-relaxed">
                  124 Botanical Drive, Greenhouse District<br />
                  San Francisco, CA 94107
                </p>
              </div>
              <div className="rounded-xl overflow-hidden h-48 w-full grayscale contrast-125 opacity-80 border-2 border-surface-container-highest">
                <img className="w-full h-full object-cover" alt="map view of city" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjmM1TnTLmhNKjBE1Bcsfp7HbBhx2N9QYX2Y9dr2BJaY6U5njbZYqU8OhkHu9_Sc2y6_AgH_-jgYBf98VPbhlfUWGe4NIPb3ipohNay3WD4wLb93LvBF9bYdNA5UxB79RiK_srvicV4gJmkCSxe6OKcWu8-xQwmWxwyXTHvVyIKEy3XB5WdJmFmOheo3mLti1mRNgsJvxQGIWTuFQ_2ax1k4BE33ZxOV5JwjJWGFH9soQCcRrkvrxaTZFV73VxcmCJd_5J98VmBcY3" />
              </div>
            </div>

            {/* Info Card 2 */}
            <div className="bg-secondary-container p-8 rounded-xl">
              <h3 className="text-2xl font-heading font-bold text-on-secondary-container mb-6">Quick Contact</h3>
              <div className="space-y-4">
                <a className="flex items-center gap-4 group" href="mailto:hello@nutriscan.com">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary">mail</span>
                  </div>
                  <span className="font-bold text-on-secondary-container">hello@nutriscan.com</span>
                </a>
                <a className="flex items-center gap-4 group" href="tel:+1234567890">
                  <div className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary">call</span>
                  </div>
                  <span className="font-bold text-on-secondary-container">+1 (555) 000-0000</span>
                </a>
              </div>
            </div>

            {/* Social Proof / CTA */}
            <div className="bg-tertiary-fixed p-8 rounded-xl text-on-tertiary-fixed">
              <p className="font-heading font-bold text-lg mb-2">Join our newsletter</p>
              <p className="text-sm opacity-80 mb-4 font-medium">Weekly nutritional insights and product updates delivered to your inbox.</p>
              <div className="flex gap-2">
                <input className="flex-1 bg-surface-container-lowest/50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-tertiary/20 outline-none font-bold placeholder:text-on-tertiary-fixed/50" placeholder="Email" type="email" />
                <button className="bg-on-tertiary-fixed text-tertiary-fixed px-5 py-2 hover:opacity-80 rounded-lg font-bold text-sm transition-opacity">Join</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
