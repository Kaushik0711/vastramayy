import React, { useState, useEffect } from 'react';
import { settingsService, StoreSettings } from '../../services/settingsService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../context/ToastContext';
import { Database, RefreshCw, Save, AlertTriangle } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Vastramay Atelier',
    tagline: 'Contemporary Indian Festive & Bridal Couture',
    supportEmail: 'concierge@vastramay.com',
    supportPhone: '+91 (0) 22 4589 1920',
    freeShippingThreshold: 3000,
    standardShippingFee: 250,
    expressShippingSurcharge: 450,
    codMaxLimit: 25000,
    enableCod: true,
    enableGiftWrapping: true,
    announcementText: 'Complimentary Express Shipping Across India on All Orders Above ₹3,000',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    async function load() {
      try {
        const s = await settingsService.getSettings();
        setSettings(s);
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    }
    load();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await settingsService.saveSettings(settings);
      showToast('Store settings saved and applied to storefront.', 'success');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetAllData = async () => {
    setIsResetting(true);
    try {
      await settingsService.resetAllDemoData();
      showToast('Entire Vastramay demo data ecosystem reset to factory defaults.', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 900);
    } catch (err) {
      showToast('Failed to reset demo data.', 'error');
    } finally {
      setIsResetting(false);
      setShowResetConfirm(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl animate-fade-in">
      <div className="border-b border-brand-espresso/10 pb-5">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">
          Configuration & Policies
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-espresso">
          Atelier System Settings
        </h1>
        <p className="text-xs text-brand-espresso/60 mt-0.5">
          Configure financial thresholds, logistics fees, customer care, and demo data state
        </p>
      </div>

      {/* Persistence Architecture Card */}
      <div className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-gold/15 text-brand-gold">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-brand-espresso">
              StorageAdapter Architecture & Local Persistence
            </h2>
            <p className="text-xs text-brand-espresso/60">
              Decoupled client persistence adapter with simulated async I/O
            </p>
          </div>
        </div>

        <p className="text-xs text-brand-espresso/70 leading-relaxed">
          Vastramay stores products, orders, returns, and inventory logs client-side in browser LocalStorage under the prefix{' '}
          <code className="bg-brand-ivory px-1.5 py-0.5 rounded font-mono text-brand-espresso font-semibold">
            vastramay_v1_*
          </code>{' '}
          with async simulation. Storefront updates made in this admin panel take immediate effect.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResetConfirm(true)}
            leftIcon={<RefreshCw className="w-4 h-4 text-brand-gold" />}
          >
            Reset All Demo Data to Factory State
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="p-4 bg-rose-50 border border-rose-300 rounded-xl space-y-3 animate-fade-in text-xs">
          <div className="flex items-start gap-2 text-rose-950">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Confirm Full Demo Data Reset</h4>
              <p className="text-rose-800 mt-0.5 leading-relaxed">
                This action will restore the initial catalog of 16 products, factory orders, clear
                custom returns, and reset inventory stock levels to default.
              </p>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetConfirm(false)}
              disabled={isResetting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleResetAllData}
              isLoading={isResetting}
            >
              Confirm Factory Reset
            </Button>
          </div>
        </div>
      )}

      {/* Store Parameters Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-brand-espresso/10 p-6 shadow-sm space-y-6 text-xs">
        <h3 className="font-serif text-lg font-bold text-brand-espresso border-b border-brand-espresso/10 pb-3">
          Storefront Logistics & Thresholds
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Store Display Name"
            value={settings.storeName}
            onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))}
            required
          />
          <Input
            label="Brand Tagline"
            value={settings.tagline}
            onChange={(e) => setSettings((prev) => ({ ...prev, tagline: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Concierge Email"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
            required
          />
          <Input
            label="Concierge Phone"
            value={settings.supportPhone}
            onChange={(e) => setSettings((prev) => ({ ...prev, supportPhone: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Free Shipping Spend Threshold (INR)"
            type="number"
            value={settings.freeShippingThreshold}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                freeShippingThreshold: parseInt(e.target.value, 10) || 0,
              }))
            }
            required
          />

          <Input
            label="Standard Courier Fee (INR)"
            type="number"
            value={settings.standardShippingFee}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                standardShippingFee: parseInt(e.target.value, 10) || 0,
              }))
            }
            required
          />

          <Input
            label="White-Glove Express Surcharge (INR)"
            type="number"
            value={settings.expressShippingSurcharge}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                expressShippingSurcharge: parseInt(e.target.value, 10) || 0,
              }))
            }
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Max Cash on Delivery (COD) Limit (INR)"
            type="number"
            value={settings.codMaxLimit}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                codMaxLimit: parseInt(e.target.value, 10) || 0,
              }))
            }
            required
          />

          <Input
            label="Announcement Banner Text"
            value={settings.announcementText}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, announcementText: e.target.value }))
            }
            required
          />
        </div>

        <div className="flex gap-4 pt-2 border-t border-brand-espresso/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableCod}
              onChange={(e) => setSettings((prev) => ({ ...prev, enableCod: e.target.checked }))}
              className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
            />
            <span className="font-semibold text-brand-espresso">Enable Cash on Delivery option</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableGiftWrapping}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, enableGiftWrapping: e.target.checked }))
              }
              className="rounded border-brand-espresso/30 text-brand-gold focus:ring-brand-gold"
            />
            <span className="font-semibold text-brand-espresso">Offer complimentary keepsake muslin wrapping</span>
          </label>
        </div>

        <div className="flex justify-end pt-3">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Store Settings
          </Button>
        </div>
      </form>
    </div>
  );
};
