import React, { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { HeroBanner } from '../../components/storefront/HeroBanner';
import { AtelierTrustPillars } from '../../components/storefront/AtelierTrustPillars';
import { NewArrivalsRail } from '../../components/storefront/NewArrivalsRail';
import { CategoryStorytellingSection } from '../../components/storefront/CategoryStorytellingSection';
import { MensEditorialSplit } from '../../components/storefront/MensEditorialSplit';
import { WomensEditorialCollage } from '../../components/storefront/WomensEditorialCollage';
import { FeaturedCollectionsSection } from '../../components/storefront/FeaturedCollectionsSection';
import { BestsellersSection } from '../../components/storefront/BestsellersSection';
import { SeasonalCampaignBanner } from '../../components/storefront/SeasonalCampaignBanner';
import { CuratedOutfitInspiration } from '../../components/storefront/CuratedOutfitInspiration';
import { BrandStorySection } from '../../components/storefront/BrandStorySection';
import { CustomerReviewsSection } from '../../components/storefront/CustomerReviewsSection';
import { HomepageNewsletter } from '../../components/storefront/HomepageNewsletter';
import { FinalShoppingCta } from '../../components/storefront/FinalShoppingCta';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const all = await productService.getAllProducts();
        if (isMounted) {
          setProducts(all);
        }
      } catch (err) {
        console.error('Failed to load catalog for homepage:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 pb-12 overflow-x-hidden">
      {/* 1. Announcement & Hero Section (Has its own staggered entrance) */}
      <HeroBanner />

      {/* 2. Atelier Trust Pillars */}
      <ScrollReveal variant="fade-up">
        <AtelierTrustPillars />
      </ScrollReveal>

      {/* 3. New Arrivals (Horizontal Rail with Smooth Scroll) */}
      <ScrollReveal variant="fade-up">
        <NewArrivalsRail products={products} loading={loading} />
      </ScrollReveal>

      {/* 4. Shop by Category (Category Storytelling with Arch Cards & Gender Tabs) */}
      <ScrollReveal variant="fade-up">
        <CategoryStorytellingSection />
      </ScrollReveal>

      {/* 5. Men's Edit (Asymmetric Magazine Split Layout) */}
      <ScrollReveal variant="fade-up">
        <MensEditorialSplit products={products} />
      </ScrollReveal>

      {/* 6. Women's Edit (Editorial Collage with Couture Spotlight) */}
      <ScrollReveal variant="fade-up">
        <WomensEditorialCollage products={products} />
      </ScrollReveal>

      {/* 7. Featured Collections (4 Luxury Capsule Archives) */}
      <ScrollReveal variant="fade-up">
        <FeaturedCollectionsSection />
      </ScrollReveal>

      {/* 8. Best Sellers (Ranked Icons with Quick Filter Tabs) */}
      <ScrollReveal variant="fade-up">
        <BestsellersSection products={products} />
      </ScrollReveal>

      {/* 9. Seasonal Campaign (Autumn/Winter Royale Cinematic Banner) */}
      <ScrollReveal variant="scale">
        <SeasonalCampaignBanner />
      </ScrollReveal>

      {/* 10. Curated Outfit Inspiration (Shop The Look with Ensemble Breakdown) */}
      <ScrollReveal variant="fade-up">
        <CuratedOutfitInspiration />
      </ScrollReveal>

      {/* 11. Brand Story (Varanasi Looms, Master Weaver Quote, 4 Craft Pillars) */}
      <ScrollReveal variant="fade-up">
        <BrandStorySection />
      </ScrollReveal>

      {/* 12. Customer Reviews (Verified Atelier Testimonials & Star Ratings) */}
      <ScrollReveal variant="fade-up">
        <CustomerReviewsSection />
      </ScrollReveal>

      {/* 13. Newsletter Signup (Atelier Circle VIP Access with Live Validation) */}
      <ScrollReveal variant="fade-up">
        <HomepageNewsletter />
      </ScrollReveal>

      {/* 14. Final Shopping CTA (Dual Doors & Bespoke Styling Consultation) */}
      <ScrollReveal variant="fade-up">
        <FinalShoppingCta />
      </ScrollReveal>
    </div>
  );
};
