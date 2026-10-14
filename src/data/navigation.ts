export interface NavItem {
  label: string;
  href: string;
  badge?: string;
  description?: string;
}

export interface MegaMenuColumn {
  title: string;
  items: NavItem[];
}

export interface MegaMenuData {
  featuredCampaign: {
    title: string;
    subtitle: string;
    image: string;
    href: string;
    ctaText: string;
    annotation?: string;
  };
  columns: MegaMenuColumn[];
}

export const MEN_MEGA_MENU: MegaMenuData = {
  featuredCampaign: {
    title: 'The Groom & Royal Suite',
    subtitle: 'Pure Varanasi zari achkans and tailored raw silk bundis.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    href: '/products?category=sherwanis',
    ctaText: 'Explore Groom Collection',
    annotation: 'Royal Rajputana',
  },
  columns: [
    {
      title: 'Ready-To-Wear Silhouettes',
      items: [
        { label: 'Silk Kurtas & Sets', href: '/products?category=kurtas', description: 'Chanderi, Raw Silk & Mulmul' },
        { label: 'Bespoke Groom Sherwanis', href: '/products?category=sherwanis', badge: 'Artisanal' },
        { label: 'Nehru & Bundi Jackets', href: '/products?category=nehru-jackets', description: 'Structured vests in raw silk' },
        { label: 'Indo-Western Bandhgalas', href: '/men', badge: 'New' },
        { label: 'Tailored Churidar & Breeches', href: '/men' },
      ],
    },
    {
      title: 'Artisan Loom Weaves',
      items: [
        { label: 'Pure Chanderi Silk Blend', href: '/products?search=chanderi' },
        { label: 'Lucknowi Hand Chikankari', href: '/products?search=chikankari', badge: 'Heritage' },
        { label: 'Textured Raw Tussar Silk', href: '/products?search=raw-silk' },
        { label: 'Gold Zari Kadwa Brocade', href: '/products?search=zari' },
        { label: 'Micro-Velvet Embroidered', href: '/products?search=velvet' },
      ],
    },
    {
      title: 'Occasion Edits',
      items: [
        { label: 'Festive & Poojas', href: '/products?category=kurtas' },
        { label: 'Mehendi & Haldi Attire', href: '/products?category=nehru-jackets' },
        { label: 'Wedding Guest Luxury', href: '/men' },
        { label: 'Cocktail & Evening Soirée', href: '/men' },
      ],
    },
  ],
};

export const WOMEN_MEGA_MENU: MegaMenuData = {
  featuredCampaign: {
    title: 'The Bridal Atelier 2026',
    subtitle: 'Jaipur gota patti velvet and pure Katan silk sarees.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    href: '/products?category=lehengas',
    ctaText: 'Discover Bridal Ensembles',
    annotation: 'Jaipur Gota Patti',
  },
  columns: [
    {
      title: 'Couture Ensembles',
      items: [
        { label: 'Bridal & Festive Lehengas', href: '/products?category=lehengas', badge: 'Bestseller' },
        { label: 'Handcrafted Silk Sarees', href: '/products?category=sarees', description: 'Banarasi & Kanjivaram' },
        { label: 'Floor-Sweeping Anarkalis', href: '/products?category=anarkalis' },
        { label: 'Contemporary Pre-Draped Sarees', href: '/women', badge: 'Modern' },
        { label: 'Sharara Ensembles & Suits', href: '/women' },
      ],
    },
    {
      title: 'Heritage Craft Techniques',
      items: [
        { label: 'Authentic Jaipur Gota Patti', href: '/products?search=gota-patti', badge: 'Handcrafted' },
        { label: 'Varanasi Kadwa Weaving', href: '/products?search=varanasi' },
        { label: 'Kanchipuram Silver Zari', href: '/products?search=kanjivaram' },
        { label: 'Awadhi Chikankari Mukesh', href: '/products?search=chikankari' },
        { label: 'Tissue & Pastel Organza', href: '/products?search=organza' },
      ],
    },
    {
      title: 'Celebration Ensembles',
      items: [
        { label: 'The Pheras Bridal Suite', href: '/products?category=lehengas' },
        { label: 'Sangeet & Dance Outfits', href: '/products?category=lehengas' },
        { label: 'Temple & Festival Silks', href: '/products?category=sarees' },
        { label: 'Intimate Home Festivities', href: '/products?category=anarkalis' },
      ],
    },
  ],
};
