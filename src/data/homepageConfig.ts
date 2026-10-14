/**
 * Vastramay Homepage Content & Editorial Configuration
 * Central source of truth for homepage copy, campaigns, storytelling categories,
 * collections, styled looks, craft pillars, and customer reviews.
 */

export interface HomepageCategoryItem {
  id: string;
  name: string;
  slug: string;
  gender: 'men' | 'women';
  itemCount: number;
  image: string;
  description: string;
  tagline?: string;
}

export interface HomepageCollectionItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  tag: string;
  highlightText: string;
}

export interface OutfitLookItem {
  id: string;
  lookTitle: string;
  occasion: string;
  tagline: string;
  heroImage: string;
  story: string;
  ensembleItems: {
    productId: string;
    productName: string;
    productSlug: string;
    price: number;
    role: string;
    image: string;
  }[];
}

export interface VerifiedReviewItem {
  id: string;
  author: string;
  location: string;
  rating: number;
  occasion: string;
  productName: string;
  quote: string;
  verifiedPurchase: boolean;
  date: string;
}

export const HOMEPAGE_CONFIG = {
  announcement: {
    enabled: true,
    text: 'Complimentary Express Shipping Across India on Orders Over ₹3,000 · Global Atelier Delivery Available',
    highlight: 'FESTIVE ATELIER 2026',
    link: '/policies',
  },

  hero: {
    badge: 'The Festive Atelier 2026',
    headline: 'Where Royal Heritage',
    cursiveAccent: 'Meets Bespoke Luxury',
    statement:
      'Hand-woven Varanasi silks, antique gold zardozi tailoring, and timeless silhouettes crafted with generous 2-inch fit margins for life’s grandest celebrations.',
    primaryCta: {
      label: "Explore Men's Suite",
      link: '/products?gender=men',
    },
    secondaryCta: {
      label: "Discover Women's Couture",
      link: '/products?gender=women',
    },
    campaignCta: {
      label: 'The Royal Banaras Edit',
      link: '/products?category=kurtas',
    },
    heroImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=2000&q=85',
    secondaryHeroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    stats: [
      { value: '100%', label: 'Silk Mark Certified' },
      { value: '2-Inch', label: 'Internal Fit Margins' },
      { value: '48h', label: 'Express Dispatch' },
      { value: '14+', label: 'Heritage Weave Clusters' },
    ],
  },

  categoryStorytelling: {
    men: [
      {
        id: 'cat-m-ethnic',
        name: 'Ethnic Wear & Kurtas',
        slug: 'kurtas',
        gender: 'men' as const,
        itemCount: 42,
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        description: 'Chanderi, Lucknowi Chikankari, and Banarasi Silk Kurtas for grand festivities.',
        tagline: 'Timeless Royal Silhouettes',
      },
      {
        id: 'cat-m-jackets',
        name: 'Nehru & Bundi Jackets',
        slug: 'nehru-jackets',
        gender: 'men' as const,
        itemCount: 24,
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
        description: 'Structured raw silk vests adorned with hand-cast brass filigree buttons.',
        tagline: 'Artisanal Layering',
      },
      {
        id: 'cat-m-coord',
        name: 'Co-ord Sets',
        slug: 'co-ord-sets',
        gender: 'men' as const,
        itemCount: 16,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
        description: 'Contemporary Angrakha wrap tunics paired with pleated dhoti bottoms.',
        tagline: 'Modern Sartorial Grace',
      },
      {
        id: 'cat-m-shirts',
        name: 'Artisanal Shirts',
        slug: 'shirts',
        gender: 'men' as const,
        itemCount: 18,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
        description: 'Mulberry silk and Belgian linen shirts hand-printed with Bagru wooden blocks.',
        tagline: 'Breathable Casual Luxury',
      },
      {
        id: 'cat-m-trousers',
        name: 'Tailored Trousers',
        slug: 'trousers',
        gender: 'men' as const,
        itemCount: 15,
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        description: 'High-rise Gurkha trousers and tailored pleated pants in fine gabardine.',
        tagline: 'Precision Tailoring',
      },
      {
        id: 'cat-m-tshirts',
        name: 'Luxe T-Shirts',
        slug: 't-shirts',
        gender: 'men' as const,
        itemCount: 12,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        description: 'Extra-long staple Supima cotton tees with silk Mercerized luster.',
        tagline: 'Elevated Daily Essentials',
      },
      {
        id: 'cat-m-jeans',
        name: 'Selvedge Denims',
        slug: 'jeans',
        gender: 'men' as const,
        itemCount: 10,
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
        description: 'Authentic shuttle-loomed selvedge denim woven with pure natural indigo.',
        tagline: 'Heirloom Indigo Craft',
      },
    ],
    women: [
      {
        id: 'cat-w-lehengas',
        name: 'Festive Lehengas',
        slug: 'lehengas',
        gender: 'women' as const,
        itemCount: 38,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        description: 'Voluminous micro-velvet and organza kalidar lehengas with authentic gota patti.',
        tagline: 'Bridal & Celebration Flairs',
      },
      {
        id: 'cat-w-sarees',
        name: 'Handcrafted Sarees',
        slug: 'sarees',
        gender: 'women' as const,
        itemCount: 46,
        image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
        description: 'Kanjivaram Korvai heirlooms and pure Banarasi Katan silk brocades.',
        tagline: 'Six Yards of Pure Royalty',
      },
      {
        id: 'cat-w-kurtis',
        name: 'Designer Kurtis',
        slug: 'kurtis',
        gender: 'women' as const,
        itemCount: 34,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        description: 'Chanderi silk-cotton kalidar kurtis detailed with Khari gold leaf work.',
        tagline: 'Festive Everyday Grace',
      },
      {
        id: 'cat-w-coord',
        name: 'Silk Co-ord Sets',
        slug: 'co-ord-sets',
        gender: 'women' as const,
        itemCount: 25,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
        description: 'Wild Tussar wrap silhouettes with wide-leg palazzo trousers and tassel sashes.',
        tagline: 'Effortless Contemporary Soirée',
      },
      {
        id: 'cat-w-dresses',
        name: 'Couture Dresses',
        slug: 'dresses',
        gender: 'women' as const,
        itemCount: 22,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
        description: 'Western fit-and-flare gowns sculpted in Varanasi gold katan brocade silk.',
        tagline: 'East-Meets-West Elegance',
      },
      {
        id: 'cat-w-anarkalis',
        name: 'Anarkalis & Shararas',
        slug: 'anarkalis',
        gender: 'women' as const,
        itemCount: 31,
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        description: 'Hand-embroidered Lucknowi Chikankari georgettes with delicate silver mukesh.',
        tagline: 'Floor-Sweeping Royal Silhouette',
      },
      {
        id: 'cat-w-bottoms',
        name: 'Bottom Wear',
        slug: 'bottom-wear',
        gender: 'women' as const,
        itemCount: 14,
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
        description: 'Raw silk cigarette trousers, flared palazzos, and scalloped dhoti pants.',
        tagline: 'Flawless Complements',
      },
      {
        id: 'cat-w-dupattas',
        name: 'Artisan Dupattas',
        slug: 'dupattas',
        gender: 'women' as const,
        itemCount: 28,
        image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
        description: 'Organza jaal drapes, Bandhani silk veils, and zardozi scalloped borders.',
        tagline: 'The Crowning Accent',
      },
    ],
  },

  featuredCollections: [
    {
      id: 'coll-banaras',
      title: 'The Royal Banaras Edit',
      subtitle: 'Kadwa Weaves in 24kt-Dipped Zari',
      description:
        'Centuries-old handloom techniques revived for modern wedding celebrations. Heavy silks with architectural bootis and rich drape.',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80',
      link: '/products?category=sherwanis',
      tag: 'Couture Capsule',
      highlightText: 'Varanasi Master Looms',
    },
    {
      id: 'coll-chanderi',
      title: 'Chanderi Sunrises',
      subtitle: 'Airy Gold Zari & Sheer Silk-Cotton',
      description:
        'Featherlight weaves kissed with morning light. Perfect for daytime Haldi ceremonies, festive poojas, and garden soirées.',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
      link: '/products?category=kurtas',
      tag: 'Handloom Classic',
      highlightText: 'Madhya Pradesh Weaves',
    },
    {
      id: 'coll-noor',
      title: 'Noor Wedding Suite',
      subtitle: 'Bespoke Groom & Bridal Masterpieces',
      description:
        'Coordinated matrimonial ensembles curated for couples seeking royal harmony in crimson, deep ivory, and midnight navy.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      link: '/products?category=lehengas',
      tag: 'Matrimonial Atelier',
      highlightText: 'Custom Fit Guaranteed',
    },
    {
      id: 'coll-tussar',
      title: 'The Wild Tussar Narrative',
      subtitle: 'Organic Golden Silks with Modern Tailoring',
      description:
        'Natural raw wild silk from Bhagalpur crafted into architectural co-ord suits and wrap tunics for conscious luxury connoisseurs.',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      link: '/products?category=co-ord-sets',
      tag: 'Sustainable Silk',
      highlightText: '100% Biodegradable',
    },
  ],

  seasonalCampaign: {
    badge: 'Autumn/Winter Royale',
    headline: 'The Golden Hour of Varanasi',
    cursiveAccent: 'Silk Route Symphony',
    description:
      'As twilight blankets the ghats of the Ganges, our master artisans weave pure silver and gold zari into deep jewel-toned fabrics. An opulent collection designed for high-winter weddings and gala evenings.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1600&q=85',
    ctaText: 'Explore The Festive Royale',
    ctaLink: '/products?sale=true',
    atelierConsultationNote: 'Complimentary bespoke sizing and styling consultation included on all orders.',
  },

  outfitInspirations: [
    {
      id: 'look-royal-groom',
      lookTitle: 'The Imperial Groom Ensemble',
      occasion: 'Royal Wedding & Phera Ceremony',
      tagline: 'Midnight Navy Kadwa Brocade paired with Raw Silk Accents',
      heroImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=80',
      story:
        'Crafted for the groom who commands royal poise. The Varanasi Royal Brocade Sherwani is paired with an embroidered Bundi jacket and tailored Gurkha trousers for seamless transitions between formal pheras and cocktail celebrations.',
      ensembleItems: [
        {
          productId: 'prod-002',
          productName: 'Varanasi Royal Brocade Sherwani',
          productSlug: 'varanasi-royal-brocade-sherwani',
          price: 34500,
          role: 'Primary Outerwear',
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
        },
        {
          productId: 'prod-005',
          productName: 'Raw Silk Bundi Jacket with Brass Filigree',
          productSlug: 'raw-silk-bundi-jacket-brass-filigree',
          price: 5299,
          role: 'Mid-Layer Vest',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80',
        },
        {
          productId: 'prod-008',
          productName: 'Pleated Heritage Gurkha Trouser in Warm Sand',
          productSlug: 'pleated-heritage-gurkha-trouser-warm-sand',
          price: 3999,
          role: 'Tailored Bottom',
          image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
    {
      id: 'look-sangeet-gala',
      lookTitle: 'The Sangeet Night Royale',
      occasion: 'Sangeet Soirée & Festive Cocktail',
      tagline: 'Crimson Jaipur Gota Patti with Hand-Spun Wild Tussar Accents',
      heroImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      story:
        'Rich micro-velvet kalis meet beaten gold gota patti and delicate pearl tassels, allowing breathtaking fluid movement on the dance floor without sacrificing regal structure.',
      ensembleItems: [
        {
          productId: 'prod-003',
          productName: 'Gota Patti Gulab Velvet Lehenga Ensemble',
          productSlug: 'gota-patti-gulab-velvet-lehenga-ensemble',
          price: 48999,
          role: 'Celebration Lehenga',
          image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80',
        },
        {
          productId: 'prod-010',
          productName: 'Chanderi Gold Leaf Pleated Kurti',
          productSlug: 'chanderi-gold-leaf-pleated-kurti',
          price: 5899,
          role: 'Cocktail Tunic Alternative',
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
        },
      ],
    },
  ],

  brandStory: {
    kicker: 'The Vastramay Legacy',
    title: 'Woven for Centuries,',
    cursiveAccent: 'Tailored for Life',
    storyParagraphs: [
      'At Vastramay, clothing is neither ephemeral nor mass-manufactured. Every garment begins in historic weaver settlements across Varanasi, Chanderi, Kanchipuram, and Jaipur — where fifth-generation artisan families operate rhythmic wooden pit looms.',
      'We combine these authentic handloom textiles with contemporary anatomical pattern drafting. Each silhouette is constructed with generous 2-inch internal seam allowances, allowing personal alterations that guarantee a lifetime of impeccable wear.',
    ],
    loomImage: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80',
    artisanQuote:
      '“A genuine handloom thread carries the heartbeat of the weaver. It breathes with you in summer, warms you in winter, and matures with time like fine wine.”',
    artisanAuthor: 'Pandit Radheshyam Mishra, Master Weaver, Varanasi Atelier',
    pillars: [
      {
        title: 'Authentic Handloom Silks',
        description: 'Silk Mark certified Mulberry, Chanderi, and Tussar weaves free from synthetic substitutes.',
      },
      {
        title: '2-Inch Bespoke Margins',
        description: 'Built-in seam allowances engineered for easy bespoke adjustments as your body evolves.',
      },
      {
        title: 'Fair Artisan Compensation',
        description: 'Direct partnerships with artisan clusters ensuring sustainable generational livelihoods.',
      },
      {
        title: 'Heirloom Longevity',
        description: 'Double-reinforced french seams and pure metal hardware crafted to be handed down.',
      },
    ],
  },

  reviews: [
    {
      id: 'rev-01',
      author: 'Vikramaditya Singhania',
      location: 'South Mumbai',
      rating: 5,
      occasion: 'Brother’s Wedding Reception',
      productName: 'Varanasi Royal Brocade Sherwani',
      quote:
        'The depth of the gold zari brocade is simply unparalleled. It commands true presence without feeling heavy or stiff. The 2-inch margin allowed my personal tailor to take in the waist effortlessly.',
      verifiedPurchase: true,
      date: 'September 2026',
    },
    {
      id: 'rev-02',
      author: 'Ananya Mehra-Kapoor',
      location: 'New Delhi & London',
      rating: 5,
      occasion: 'Bridal Sangeet Gala',
      productName: 'Gota Patti Gulab Velvet Lehenga',
      quote:
        'I wore this for our Sangeet in Udaipur. The micro-velvet caught the palace chandeliers magically. Customer concierge helped verify my exact blouse measurements over video call. Perfection.',
      verifiedPurchase: true,
      date: 'October 2026',
    },
    {
      id: 'rev-03',
      author: 'Devendra Kothari',
      location: 'Bengaluru',
      rating: 5,
      occasion: 'Diwali Royal Soirée',
      productName: 'Imperial Emerald Chanderi Kurta Set',
      quote:
        'The breathable mulmul lining makes an enormous difference during long evening events. Beautiful hand-stitched zardozi detailing around the collar that stands out immediately.',
      verifiedPurchase: true,
      date: 'October 2026',
    },
  ],

  finalCta: {
    kicker: 'The Atelier Invitation',
    title: 'Begin Your Celebration With',
    cursiveAccent: 'Vastramay Couture',
    subtext:
      'Explore handloom masterworks crafted for life’s grandest milestones. Complimentary express shipping, custom tailoring options, and dedicated styling consultations.',
    menLink: '/products?gender=men',
    womenLink: '/products?gender=women',
    appointmentLink: '/account',
  },
};
