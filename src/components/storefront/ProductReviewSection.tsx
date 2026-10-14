import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquarePlus, X } from 'lucide-react';
import { Button } from '../common/Button';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  occasion: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

interface ProductReviewSectionProps {
  productName: string;
  ratingAverage: number;
  reviewCount: number;
}

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-01',
    author: 'Raghavendra Singhania',
    rating: 5,
    date: '10 Oct 2026',
    occasion: 'Royal Wedding Reception',
    title: 'Exquisite craftsmanship and unmatched drape',
    comment:
      'The zari work is incredibly subtle and radiant under chandeliers. The mulmul inner lining kept me completely comfortable throughout a 6-hour evening event. Highly recommend using the bespoke margin option.',
    verified: true,
    helpfulCount: 14,
  },
  {
    id: 'rev-02',
    author: 'Priyanka Sen-Gupta',
    rating: 5,
    date: '28 Sep 2026',
    occasion: 'Diwali Gala Evening',
    title: 'Heirloom quality fabric that commands respect',
    comment:
      'I was hesitant about ordering haute couture online, but the atelier concierge team video-called to confirm my measurements. Arrived packed in a breathable muslin cover with pure brass buttons.',
    verified: true,
    helpfulCount: 9,
  },
  {
    id: 'rev-03',
    author: 'Karanvir Rathore',
    rating: 4,
    date: '15 Sep 2026',
    occasion: 'Sangeet Night',
    title: 'Superb fitting, arrived 1 day ahead of schedule',
    comment:
      'The shoulder and chest fit was spot on. Minor adjustment was needed on the sleeve length which my tailor did easily due to the generous 2-inch inner margin.',
    verified: true,
    helpfulCount: 6,
  },
];

export const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({
  productName,
  ratingAverage,
  reviewCount,
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newAuthor, setNewAuthor] = useState('');
  const [newOccasion, setNewOccasion] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleHelpfulClick = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Just now',
      occasion: newOccasion.trim() || 'Festive Celebration',
      title: newTitle.trim() || 'Exceptional Atelier Piece',
      comment: newComment.trim(),
      verified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setIsWriteModalOpen(false);
      setSubmitted(false);
      setNewAuthor('');
      setNewOccasion('');
      setNewTitle('');
      setNewComment('');
    }, 1200);
  };

  // Star breakdown bars
  const distribution = [
    { stars: 5, pct: 85 },
    { stars: 4, pct: 12 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 0 },
    { stars: 1, pct: 0 },
  ];

  return (
    <section className="pt-12 border-t border-brand-espresso/12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold-600 block mb-1">
            Client Atelier Feedback
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-brand-espresso">
            Patron Reviews & Experiences
          </h2>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={() => setIsWriteModalOpen(true)}
          leftIcon={<MessageSquarePlus className="w-4 h-4" />}
          className="border-brand-espresso/25 text-brand-espresso hover:bg-brand-espresso hover:text-brand-gold"
        >
          Write a Review
        </Button>
      </div>

      {/* Rating Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl bg-brand-ivory-100/60 border border-brand-espresso/10">
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-brand-espresso/15 pb-6 md:pb-0 md:pr-6">
          <div className="font-serif text-5xl sm:text-6xl font-bold text-brand-espresso leading-none">
            {ratingAverage.toFixed(1)}
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-amber-500 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
          <p className="text-xs text-brand-ink/60 font-light">
            Based on {reviewCount} verified client purchases
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-8 space-y-2">
          {distribution.map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-brand-ink/70 font-medium">{bar.stars} Stars</span>
              <div className="flex-1 h-2 bg-brand-espresso/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gold rounded-full transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-brand-ink/60">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-white border border-brand-espresso/10 shadow-2xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif text-base font-semibold text-brand-espresso">
                  {rev.title}
                </h4>
              </div>

              <span className="text-[11px] text-brand-ink/50">{rev.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-brand-ink/80 font-light leading-relaxed">
              "{rev.comment}"
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-brand-espresso/8">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-brand-espresso">{rev.author}</span>
                <span className="text-brand-ink/40">·</span>
                <span className="text-brand-ink/60">{rev.occasion}</span>
                {rev.verified && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>Verified Buyer</span>
                  </span>
                )}
              </div>

              <button
                onClick={() => handleHelpfulClick(rev.id)}
                className="inline-flex items-center gap-1.5 text-[11px] text-brand-ink/60 hover:text-brand-espresso transition-colors font-medium"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-brand-espresso/70 backdrop-blur-xs"
            onClick={() => setIsWriteModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-brand-espresso/15 z-10 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-brand-espresso/10 pb-3">
              <h3 className="font-serif text-xl font-semibold text-brand-espresso">
                Review: {productName}
              </h3>
              <button
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-brand-espresso/10 text-brand-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-xl font-semibold text-brand-espresso">
                  Review Received!
                </h4>
                <p className="text-xs text-brand-ink/70">
                  Thank you for contributing to the Vastramay client atelier archive.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Star rating selector */}
                <div>
                  <label className="font-bold text-brand-espresso uppercase block mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1.5 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setNewRating(s)}
                        className="p-1 hover:scale-115 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= newRating ? 'fill-current' : 'text-brand-ink/20'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-brand-espresso uppercase block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="e.g. Aditya V."
                      className="w-full bg-white border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-brand-espresso uppercase block mb-1">
                      Occasion Worn
                    </label>
                    <input
                      type="text"
                      value={newOccasion}
                      onChange={(e) => setNewOccasion(e.target.value)}
                      placeholder="e.g. Wedding Reception"
                      className="w-full bg-white border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-brand-espresso uppercase block mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Royal presence, impeccable zari finish"
                    className="w-full bg-white border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso"
                  />
                </div>

                <div>
                  <label className="font-bold text-brand-espresso uppercase block mb-1">
                    Your Experience & Fit *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share how the fabric felt, drape, sizing, and styling notes..."
                    className="w-full bg-white border border-brand-espresso/20 rounded-lg p-2.5 text-xs text-brand-espresso"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full bg-brand-espresso hover:bg-brand-espresso/90 text-brand-gold font-semibold py-3"
                >
                  Submit Atelier Review
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
