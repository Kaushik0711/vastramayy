import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { CustomerSummary } from '../../types';
import { formatINR } from '../../utils/pricing';
import { formatDate } from '../../utils/formatters';
import { Mail, Phone, Search, Crown } from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const list = await customerService.getAllCustomers();
      setCustomers(list);
    }
    load();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Clientele Directory
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Registered Patrons
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Patron lifetime value, order frequency, and contact records
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patron by name, email, or phone..."
            className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
          />
        </div>
        <span className="text-brand-espresso/50 font-medium">
          {filteredCustomers.length} Patrons
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Patron Name</th>
                <th className="py-3 px-4">Contact Details</th>
                <th className="py-3 px-4">Total Orders</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Last Order</th>
                <th className="py-3 px-4 text-right">Patron Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-brand-espresso font-serif">{c.name}</p>
                    <span className="text-[10px] text-brand-espresso/50 font-mono">ID: {c.id}</span>
                  </td>
                  <td className="py-3.5 px-4 text-brand-espresso/70 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-brand-gold" />
                      <span>{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-brand-gold" />
                      <span>{c.phone}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-brand-espresso">
                    {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-brand-espresso font-serif">
                    {formatINR(c.lifetimeValue)}
                  </td>
                  <td className="py-3.5 px-4 text-brand-espresso/60">
                    {formatDate(c.lastOrderDate)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-gold/15 text-brand-espresso border border-brand-gold/40">
                      <Crown className="w-3 h-3 text-brand-gold" /> Patron Royale
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-brand-espresso/10 p-3 space-y-3">
          {filteredCustomers.length === 0 ? (
            <p className="text-center text-xs text-brand-espresso/60 py-4">No matching patrons found.</p>
          ) : (
            filteredCustomers.map((c) => (
              <div key={c.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-brand-espresso font-serif text-sm">{c.name}</p>
                    <span className="text-[10px] text-brand-espresso/50 font-mono">ID: {c.id}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-brand-gold/15 text-brand-espresso border border-brand-gold/40">
                    <Crown className="w-2.5 h-2.5 text-brand-gold" /> Patron Royale
                  </span>
                </div>

                <div className="text-xs text-brand-espresso/70 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-brand-gold shrink-0" />
                    <span className="truncate">{c.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-brand-gold shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-brand-espresso/5 text-xs">
                  <span className="text-brand-espresso/60">
                    {c.totalOrders} {c.totalOrders === 1 ? 'order' : 'orders'} • Last: {formatDate(c.lastOrderDate)}
                  </span>
                  <span className="font-bold text-brand-espresso font-serif">
                    {formatINR(c.lifetimeValue)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
