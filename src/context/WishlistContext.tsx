import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistItem } from '../types';
import { storage } from '../services/storageAdapter';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  toggleWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => boolean;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const stored = await storage.getItem<WishlistItem[]>(WISHLIST_STORAGE_KEY, []);
        setWishlistItems(stored);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadWishlist();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    storage.setItem(WISHLIST_STORAGE_KEY, wishlistItems);
  }, [wishlistItems, isLoaded]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const toggleWishlist = (item: Omit<WishlistItem, 'id' | 'addedAt'>): boolean => {
    const exists = isInWishlist(item.productId);
    if (exists) {
      setWishlistItems((prev) => prev.filter((i) => i.productId !== item.productId));
      return false; // Removed
    } else {
      const newItem: WishlistItem = {
        ...item,
        id: `w-${Date.now()}`,
        addedAt: new Date().toISOString(),
      };
      setWishlistItems((prev) => [newItem, ...prev]);
      return true; // Added
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
};
