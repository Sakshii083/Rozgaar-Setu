import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "general",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#0F9D8A]/10 px-4 py-1 text-xs font-bold text-[#0F9D8A] uppercase">
              Help & Support
            </span>
            <h1 className="mt-3 text-3xl font-black text-[#173B57] sm:text-4xl">
              Get in Touch with Rozgaar Setu
            </h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
              Have questions about worker registration, hiring skilled talent, or utilizing our AI assistants? We are here to help.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Contact Details Cards */}
            <div className="space-y-4 md:col-span-1">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#173B57] text-white">
                  ✉️
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#202938]">Email Support</h3>
                <p className="mt-1 text-xs text-slate-500">
                  support@rozgaarsetu.in
                </p>
                <p className="mt-2 text-[11px] text-slate-400">Response within 24 business hours.</p>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0F9D8A] text-white">
                  📞
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#202938]">Platform Helpline</h3>
                <p className="mt-1 text-xs text-slate-500">+91 1800-ROZGAAR</p>
                <p className="mt-2 text-[11px] text-slate-400">Monday to Saturday, 9 AM – 6 PM</p>
              </div>

              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-xs">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4B942] text-[#202938]">
                  💬
                </div>
                <h3 className="mt-3 text-sm font-bold text-[#202938]">Community Forum</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Connect with trade associations, unions, and local hiring collectives.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-sm md:col-span-2">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="text-4xl">✅</div>
                  <h3 className="mt-4 text-xl font-bold text-[#173B57]">
                    Thank You for Reaching Out!
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Your message has been received. Our team will review your inquiry and follow up shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", phone: "", topic: "general", message: "" });
                    }}
                    className="mt-6 rounded-xl bg-[#173B57] px-6 py-2.5 text-xs font-bold text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h2 className="text-lg font-bold text-[#173B57]">Send Us a Message</h2>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit number"
                        className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Inquiry Topic</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="worker">Worker Registration & Profile Help</option>
                      <option value="employer">Employer Hiring & Job Posting</option>
                      <option value="ai">AI Features (Rozgaar Saathi / Vaani)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can we assist you?"
                      className="mt-1 w-full rounded-xl border border-[#E2E8F0] bg-[#F7F9FC] p-3 text-sm outline-none focus:border-[#0F9D8A] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#173B57] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#0f2638]"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
