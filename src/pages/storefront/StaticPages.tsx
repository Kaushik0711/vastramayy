import React, { useState } from 'react';
import { MOCK_FAQS } from '../../data/faqs';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { ChevronDown, Mail, Phone, MapPin, Send } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3 border-b border-vastra-sand-border pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-vastra-gold-600">The Vastramay Legacy</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-vastra-navy-900">
          Where Heritage Woven Dreams Meet Modern Royalty
        </h1>
        <p className="text-sm text-vastra-charcoal-600 max-w-2xl mx-auto font-light leading-relaxed">
          Founded with an obsessive dedication to Indian craftsmanship, Vastramay revives historic weaving traditions from Varanasi, Kanchipuram, Chanderi, and Jaipur for the modern discerning individual.
        </p>
      </div>

      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-vastra-sand-border shadow-luxury">
        <img
          src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1600&q=80"
          alt="Artisan Loom Weaving"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-vastra-charcoal-700 leading-relaxed font-light">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-vastra-navy-900">Authentic Handloom Weaves</h2>
          <p>
            Each thread of our pure silk sarees, kurtas, and sherwanis is hand-spun by generational artisan families. We work directly with over 120 weaver clusters across India, eliminating middlemen and certifying every piece with authentic Silk Mark authenticity.
          </p>
        </div>
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-vastra-navy-900">Bespoke Atelier Tailoring</h2>
          <p>
            Clothing is an extension of your presence. Our master couturiers craft each silhouette with custom ease, incorporating 2-inch generous hidden margins so each garment adapts seamlessly with life's milestones and journeys.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Your message has been delivered to the Vastramay Atelier Concierge.', 'success');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-2 border-b border-vastra-sand-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-vastra-gold-600">Client Concierge</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vastra-navy-900">Connect with Our Atelier</h1>
        <p className="text-xs text-vastra-charcoal-600">Dedicated styling assistance, bespoke measurements & order enquiries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-vastra-gold-100 flex items-center justify-center text-vastra-gold-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-vastra-navy-900 text-sm">Flagship Atelier</h4>
              <p className="text-vastra-charcoal-600 mt-1">Level 4, The Grand Heritage Pavilion, Colaba Causeway, Mumbai - 400001</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-vastra-gold-100 flex items-center justify-center text-vastra-gold-700 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-vastra-navy-900 text-sm">Concierge Hotline</h4>
              <p className="text-vastra-charcoal-600 mt-1">+91 (022) 8800-4400 (Mon–Sat, 10:00 AM – 7:00 PM IST)</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-vastra-gold-100 flex items-center justify-center text-vastra-gold-700 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <h4 className="font-bold text-vastra-navy-900 text-sm">Client Care Email</h4>
              <p className="text-vastra-charcoal-600 mt-1">concierge@vastramay.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-vastra-sand-border shadow-xs space-y-4">
          <Input label="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Subject / Enquiry Type" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold uppercase tracking-wider text-vastra-charcoal-700">Message</label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white text-vastra-charcoal-900 text-sm rounded-md border border-vastra-sand-border p-3 focus:outline-none focus:border-vastra-gold-400"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="md" className="w-full" rightIcon={<Send className="w-4 h-4" />}>
            Transmit Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export const FAQPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2 border-b border-vastra-sand-border pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-vastra-gold-600">Client Knowledge Base</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-vastra-navy-900">Frequently Asked Questions</h1>
        <p className="text-xs text-vastra-charcoal-600">All details regarding bespoke tailoring, delivery, returns, and silk care</p>
      </div>

      <div className="space-y-3">
        {MOCK_FAQS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="bg-white rounded-lg border border-vastra-sand-border overflow-hidden">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-vastra-sand-50 transition-colors"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-vastra-gold-700 tracking-wider block mb-0.5">
                    {item.category}
                  </span>
                  <span className="font-serif text-base font-semibold text-vastra-navy-900">{item.question}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-vastra-charcoal-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-vastra-charcoal-600 leading-relaxed border-t border-vastra-sand-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PolicyPage: React.FC<{ type: 'shipping' | 'returns' | 'privacy' }> = ({ type }) => {
  const titles = {
    shipping: 'Global Shipping & Delivery Timelines',
    returns: '10-Day Complimentary Doorstep Returns & Alterations',
    privacy: 'Privacy Policy & Terms of Atelier Engagement',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 text-xs text-vastra-charcoal-700 leading-relaxed">
      <div className="border-b border-vastra-sand-border pb-6">
        <h1 className="font-serif text-3xl font-bold text-vastra-navy-900">{titles[type]}</h1>
        <p className="text-[11px] text-vastra-charcoal-500 mt-1">Last Updated: October 2026</p>
      </div>

      <p>
        At Vastramay, every item is treated as an heirloom. We ensure all deliveries are executed via insured express courier partners (BlueDart Luxury Express and Delhivery Special Cargo) with real-time tracking checkpoints.
      </p>

      <h3 className="font-serif text-base font-bold text-vastra-navy-900 pt-2">Doorstep Quality Handover</h3>
      <p>
        Should you require any alteration adjustments, our dedicated concierge arranges complimentary return pickups from your doorstep across 18,000+ pincodes in India within 10 days of receipt.
      </p>
    </div>
  );
};
