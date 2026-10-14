import React, { useEffect, useState } from 'react';
import { reviewService, CustomerReviewRecord } from '../../services/reviewService';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import { Star, CheckCircle2, EyeOff, Trash2, Search } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<CustomerReviewRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const list = await reviewService.getAllReviews();
        setReviews(list);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: CustomerReviewRecord['status']) => {
    const updated = await reviewService.updateReviewStatus(id, newStatus);
    setReviews((prev) => prev.map((r) => (r.id === id ? updated : r)));
    showToast(`Review is now ${newStatus}.`, 'success');
  };

  const handleDelete = async (id: string) => {
    await reviewService.deleteReview(id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review deleted from records.', 'info');
  };

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-espresso/10 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
            Patron Feedback & Reputation
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-espresso">
            Review Moderation
          </h1>
          <p className="text-xs text-brand-espresso/60 mt-0.5">
            Audit verified buyer feedback, ratings, and customer couture testimonials
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-brand-espresso/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-espresso/40" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by garment, patron, or keyword..."
            className="w-full pl-9 pr-3 py-2 bg-brand-ivory/40 rounded-lg border border-brand-espresso/15 text-xs text-brand-espresso focus:outline-none focus:border-brand-gold"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-brand-espresso/60 font-semibold">Status:</span>
          {(['all', 'approved', 'hidden'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2.5 py-1 rounded capitalize text-xs font-semibold transition-all ${
                statusFilter === s
                  ? 'bg-brand-espresso text-brand-ivory'
                  : 'bg-white border border-brand-espresso/15 text-brand-espresso/70'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-brand-espresso/10 text-brand-espresso/70 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Garment</th>
                <th className="py-3 px-4">Patron & Date</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Review Content</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-espresso/5">
              {filteredReviews.map((rev) => (
                <tr key={rev.id} className="hover:bg-brand-ivory/30 transition-colors">
                  <td className="py-3.5 px-4 font-serif font-bold text-brand-espresso max-w-xs truncate">
                    {rev.productName}
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-brand-espresso">{rev.customerName}</p>
                    <p className="text-[10px] text-brand-espresso/50">{formatDate(rev.createdAt)}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <p className="font-semibold text-brand-espresso text-xs font-serif">
                      "{rev.title}"
                    </p>
                    <p className="text-[11px] text-brand-espresso/70 leading-relaxed line-clamp-2 mt-0.5">
                      {rev.comment}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                        rev.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-brand-espresso/10 text-brand-espresso/50'
                      }`}
                    >
                      {rev.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {rev.status === 'hidden' ? (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'approved')}
                          className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-1"
                          title="Approve for Storefront"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(rev.id, 'hidden')}
                          className="p-1.5 rounded hover:bg-brand-espresso/5 text-brand-espresso/50 hover:text-brand-espresso"
                          title="Hide from Storefront"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1.5 rounded hover:bg-rose-50 text-brand-espresso/50 hover:text-brand-terracotta"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
