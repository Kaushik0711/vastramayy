import React, { useState, useEffect } from 'react';
import { SectionHeading } from '../../components/common/SectionHeading';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Checkbox } from '../../components/common/Checkbox';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { EditorialFrame } from '../../components/common/EditorialFrame';
import { ProductCard } from '../../components/storefront/ProductCard';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const DesignSystemShowcasePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'typography' | 'buttons' | 'forms' | 'editorial'>('tokens');
  const [demoInput, setDemoInput] = useState('Varanasi Pure Brocade');
  const [demoCheck, setDemoCheck] = useState(true);
  const [demoSelect, setDemoSelect] = useState('chanderi');
  const [sampleProduct, setSampleProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      const prods = await productService.getAllProducts();
      if (prods.length > 0) setSampleProduct(prods[0]);
    }
    load();
  }, []);

  const paletteColors = [
    { name: 'Espresso', hex: '#38231F', role: 'Primary deep luxury base, dark campaign cards & buttons', textDark: false },
    { name: 'Deep Plum', hex: '#3D1838', role: 'Jewel campaign surface, festive evening accents', textDark: false },
    { name: 'Terracotta', hex: '#873E36', role: 'Warm earthen contrast, discount tags, alerts & warm CTAs', textDark: false },
    { name: 'Antique Gold', hex: '#B99B69', role: 'Primary metallic brand accent, active borders, key CTAs', textDark: true },
    { name: 'Warm Ivory', hex: '#F5EFE6', role: 'Default page canvas, soft tactile backdrop, breathable space', textDark: true },
    { name: 'Sage', hex: '#65715A', role: 'Natural muted botanical, sustainable craft markers, verified badges', textDark: false },
    { name: 'Ink', hex: '#201C1B', role: 'High-contrast typography, crisp line art, borders', textDark: false },
    { name: 'White', hex: '#FFFFFF', role: 'Crisp card surfaces, form inputs, dialog canvases', textDark: true },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Editorial Header */}
      <div className="border-b border-brand-espresso/15 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/15 border border-brand-gold/40 text-[10px] uppercase font-semibold tracking-widest text-brand-gold-700">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold-600" />
          <span>Vastramay Atelier Design System · Phase 02</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-brand-ink">
          Visual Identity & Component System
        </h1>
        <p className="text-sm text-brand-ink/70 max-w-2xl font-light leading-relaxed">
          Contemporary Indian fashion identity combining editorial art direction, curated earthen hues, antique gold metallic finishes, 3D architectural silhouettes, and restrained typography.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 pt-4">
          {[
            { id: 'tokens', label: '1. Color Palette' },
            { id: 'typography', label: '2. Typography System' },
            { id: 'buttons', label: '3. Buttons & Badges' },
            { id: 'forms', label: '4. Form Controls' },
            { id: 'editorial', label: '5. 3D Frames & Cards' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-espresso text-brand-ivory shadow-subtle'
                  : 'bg-white border border-brand-espresso/15 text-brand-ink hover:border-brand-gold'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: COLOR PALETTE */}
      {activeTab === 'tokens' && (
        <section className="space-y-8 animate-fade-in">
          <SectionHeading
            kicker="Curated Brand Tones"
            title="The Royal Atelier"
            cursiveAccent="Palette"
            subtitle="Carefully balanced between earthen Indian clays, antique gold zari, deep espresso woods, and breathable warm ivory."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paletteColors.map((c) => (
              <div
                key={c.name}
                className="bg-white rounded-xl border border-brand-espresso/15 overflow-hidden shadow-subtle p-4 flex flex-col justify-between"
              >
                <div>
                  <div
                    className="h-28 rounded-lg border border-black/5 shadow-inner flex items-end p-3"
                    style={{ backgroundColor: c.hex }}
                  >
                    <span
                      className={`text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded ${
                        c.textDark ? 'bg-black/20 text-black' : 'bg-white/20 text-white'
                      }`}
                    >
                      {c.hex}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-brand-ink mt-3">{c.name}</h3>
                </div>
                <p className="text-xs text-brand-ink/70 font-light mt-1.5 leading-relaxed">{c.role}</p>
              </div>
            ))}
          </div>

          {/* Semantic Role Mapping Showcase */}
          <div className="bg-white rounded-xl border border-brand-espresso/15 p-6 shadow-subtle space-y-4">
            <h3 className="font-serif text-xl font-bold text-brand-ink">Semantic Mapping Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-brand-ivory rounded border border-brand-espresso/10">
                <span className="font-bold text-brand-ink block mb-1 font-sans">Page Canvas</span>
                <code>--color-bg-page: #F5EFE6</code>
              </div>
              <div className="p-3 bg-brand-espresso text-brand-ivory rounded border border-brand-gold/30">
                <span className="font-bold block mb-1 font-sans text-brand-gold">Dark Surface</span>
                <code>--color-surface-dark: #38231F</code>
              </div>
              <div className="p-3 bg-brand-plum text-brand-ivory rounded border border-brand-gold/30">
                <span className="font-bold block mb-1 font-sans text-brand-gold">Jewel Surface</span>
                <code>--color-surface-plum: #3D1838</code>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: TYPOGRAPHY SYSTEM */}
      {activeTab === 'typography' && (
        <section className="space-y-10 animate-fade-in">
          <SectionHeading
            kicker="Harmonious Triad"
            title="Editorial Display &"
            cursiveAccent="Handwritten Accents"
            subtitle="Three distinct typographic roles: Display Serif for prestige headlines, Sans-serif for functional reading, and Cursive Script for intimate atelier annotations."
          />

          <div className="space-y-8 bg-white rounded-xl border border-brand-espresso/15 p-8 shadow-subtle">
            {/* Display Serif */}
            <div className="space-y-3 pb-8 border-b border-brand-espresso/10">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold-700">
                <span className="font-bold uppercase tracking-wider font-sans">1. Campaign Headline Display</span>
                <span>'Cormorant Garamond', serif</span>
              </div>
              <p className="font-serif text-5xl sm:text-6xl text-brand-ink font-normal leading-tight">
                Hand-Woven Royal Heirlooms
              </p>
              <p className="font-serif text-3xl sm:text-4xl text-brand-ink/80 font-normal italic">
                “Where timeless Indian weaving meets contemporary drape”
              </p>
            </div>

            {/* Handwritten Cursive Script Accent */}
            <div className="space-y-3 pb-8 border-b border-brand-espresso/10">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold-700">
                <span className="font-bold uppercase tracking-wider font-sans">2. Cursive Script Accent</span>
                <span>'Alex Brush', cursive</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-6 pt-2">
                <span className="font-cursive text-5xl text-brand-gold">Handcrafted in Varanasi</span>
                <span className="font-cursive text-4xl text-brand-terracotta">Loom Edition No. 12</span>
                <span className="font-cursive text-4xl text-brand-espresso">Pure Silk Weave</span>
              </div>
              <p className="text-xs text-brand-ink/60 font-light mt-1">
                Note: Cursive typography is strictly reserved for editorial annotations and decorative accents. It is never used on prices, buttons, or technical attributes.
              </p>
            </div>

            {/* Functional Sans */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-brand-gold-700">
                <span className="font-bold uppercase tracking-wider font-sans">3. Functional & Body Sans-Serif</span>
                <span>'Plus Jakarta Sans', sans-serif</span>
              </div>
              <div className="space-y-2 text-sm text-brand-ink/80 font-light leading-relaxed max-w-3xl">
                <p>
                  Impeccably tailored kurtas crafted in Chanderi, Raw Silk, and Lucknowi Chikankari. Our master couturiers build each silhouette with generous 2-inch internal margins for future alterations, providing comfort across generations of celebrations.
                </p>
                <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider pt-2 text-brand-ink">
                  <span>Regular 400</span>
                  <span className="font-medium">Medium 500</span>
                  <span className="font-bold">Bold 700</span>
                  <span className="font-extrabold tracking-widest">Extrabold 800</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: BUTTONS & BADGES */}
      {activeTab === 'buttons' && (
        <section className="space-y-10 animate-fade-in">
          <SectionHeading
            kicker="Interaction Primitives"
            title="Buttons, CTAs &"
            cursiveAccent="Editorial Badges"
            subtitle="Rigorous hover, active, focus, disabled, and loading states crafted for both light and dark luxury environments."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Variants */}
            <div className="bg-white rounded-xl border border-brand-espresso/15 p-6 shadow-subtle space-y-6">
              <h3 className="font-serif text-xl font-bold text-brand-ink border-b border-brand-espresso/10 pb-3">
                Button Palette Variants
              </h3>

              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary">Antique Gold Primary</Button>
                <Button variant="espresso">Espresso Luxury</Button>
                <Button variant="plum">Deep Plum</Button>
                <Button variant="terracotta">Terracotta Accent</Button>
                <Button variant="outline">Espresso Outline</Button>
                <Button variant="gold-outline">Gold Outline</Button>
                <Button variant="editorial">Editorial Underline</Button>
              </div>

              <h4 className="text-xs uppercase font-bold tracking-wider text-brand-ink/60 pt-4">States</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <Button variant="primary" isLoading>Loading State</Button>
                <Button variant="espresso" disabled>Disabled State</Button>
                <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>With Icon</Button>
              </div>
            </div>

            {/* Badge System */}
            <div className="bg-white rounded-xl border border-brand-espresso/15 p-6 shadow-subtle space-y-6">
              <h3 className="font-serif text-xl font-bold text-brand-ink border-b border-brand-espresso/10 pb-3">
                Badge & Tag Primitives
              </h3>

              <div className="flex flex-wrap gap-2.5 items-center">
                <Badge variant="gold">Antique Gold</Badge>
                <Badge variant="espresso">Espresso Heirloom</Badge>
                <Badge variant="plum">Deep Plum</Badge>
                <Badge variant="terracotta">Terracotta 25% Off</Badge>
                <Badge variant="sage">Silk Mark Certified</Badge>
                <Badge variant="ivory">Ivory Neutral</Badge>
                <Badge variant="arch">Architectural Arch</Badge>
                <Badge variant="outline">Gold Outline</Badge>
              </div>

              <h4 className="text-xs uppercase font-bold tracking-wider text-brand-ink/60 pt-4">
                Price Display Primitive
              </h4>
              <div className="space-y-3">
                <PriceDisplay price={8499} originalPrice={11999} size="lg" showTaxNotice />
                <PriceDisplay price={34500} size="md" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: FORM CONTROLS */}
      {activeTab === 'forms' && (
        <section className="space-y-10 animate-fade-in">
          <SectionHeading
            kicker="Inputs & Form Primitives"
            title="Form Controls &"
            cursiveAccent="Accessible States"
            subtitle="Built with semantic HTML, focus rings, clear error labels, and helper descriptions."
          />

          <div className="max-w-2xl bg-white rounded-xl border border-brand-espresso/15 p-8 shadow-subtle space-y-6">
            <Input
              label="Bespoke Fabric Selection"
              value={demoInput}
              onChange={(e) => setDemoInput(e.target.value)}
              helperText="Specify loom origin or special weave requirements"
              leftIcon={<Sparkles className="w-4 h-4" />}
            />

            <Input
              label="Measurement Verification"
              defaultValue="Invalid measure"
              error="Chest measurement must be between 32 and 54 inches."
            />

            <Select
              label="Weave Technique"
              value={demoSelect}
              onChange={(e) => setDemoSelect(e.target.value)}
              options={[
                { label: 'Chanderi Handloom Silk Blend', value: 'chanderi' },
                { label: 'Varanasi Pure Kadwa Brocade', value: 'varanasi' },
                { label: 'Jaipur Gota Patti Micro-Velvet', value: 'gota-patti' },
                { label: 'Kanchipuram 3-Ply Murukku Silk', value: 'kanchipuram' },
              ]}
              helperText="Determines drape rigidity and lining requirements"
            />

            <Checkbox
              label="Complimentary Atelier Alterations"
              description="Master couturier will calibrate 2-inch internal margins to your posture."
              checked={demoCheck}
              onChange={(e) => setDemoCheck(e.target.checked)}
            />
          </div>
        </section>
      )}

      {/* TAB 5: 3D FRAMES & EDITORIAL CARDS */}
      {activeTab === 'editorial' && (
        <section className="space-y-10 animate-fade-in">
          <SectionHeading
            kicker="Original Art Direction"
            title="Architectural Arches &"
            cursiveAccent="3D Dimensional Frames"
            subtitle="Moving beyond flat boxes with Indian Jharokha arch silhouettes, layered offset shadows, and handwritten loom annotations."
            align="split"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Frame 1: Jharokha Arch with 3D Offset & Cursive Note */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-brand-gold-700 block">Jharokha Arch Frame</span>
              <EditorialFrame
                imageSrc="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"
                imageAlt="Chanderi Kurta"
                shape="arch"
                kicker="Edition No. 04"
                annotation="Hand-spun Chanderi"
              />
            </div>

            {/* Frame 2: 3D Card with Tilt Hover & Price */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-brand-gold-700 block">Editorial Product Card</span>
              {sampleProduct && <ProductCard product={sampleProduct} variantShape="arch" />}
            </div>

            {/* Frame 3: Deep Plum Campaign Card */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-brand-gold-700 block">Jewel Campaign Surface</span>
              <div className="bg-brand-plum text-brand-ivory rounded-arch p-6 shadow-luxury border border-brand-gold/40 space-y-4 text-center">
                <span className="font-cursive text-3xl text-brand-gold block">Bespoke Suite</span>
                <h3 className="font-serif text-2xl font-bold">The Groom Atelier</h3>
                <p className="text-xs text-brand-ivory/80 font-light leading-relaxed">
                  Gold zari achkans and structured raw silk bundis tailored specifically for your special day.
                </p>
                <div className="pt-2">
                  <Button variant="primary" size="sm">
                    Book Consultation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
