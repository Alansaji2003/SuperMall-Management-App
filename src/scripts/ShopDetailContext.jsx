import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, getDocs, query, where, doc, getDoc, Timestamp, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [shopInfo, setShopInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchShopInfo = async (shopId) => {
    setLoading(true);
    try {
      const shopRef = doc(db, 'shops', shopId);
      const shopSnap = await getDoc(shopRef);
      if (shopSnap.exists()) {
        const shop = shopSnap.data();
        setShopInfo(shop);
        setLoading(false);
      } else {
        setError('Shop not found');
      }
    } catch (error) {
      setError('Error fetching shop');
      console.error('Error fetching shop:', error);
    }
  };

  const fetchProducts = async (shopId) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), where('shopId', '==', shopId));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(products);
      setLoading(false);
    } catch (error) {
      setError('Error fetching products');
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (shopId, productData) => {
    try {
      await addDoc(collection(db, 'products'), {
        ...productData,
        shopId,
        createdAt: Timestamp.now(),
      });
      fetchProducts(shopId); // Refresh products list
    } catch (error) {
      setError('Error adding product');
      console.error('Error adding product:', error);
    }
  };
  const fetchOffer = async (productId) => {
    setLoading(true);
    try {
      const q = query(collection(db, 'offers'), where('productId', '==', productId));
      const querySnapshot = await getDocs(q);
      const offer = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLoading(false);
      return offer;
    } catch (error) {
      setError('Error fetching offers');
      console.error('Error fetching offers:', error);
      return [];
    }
  };
  const addOffer = async (productId, offerData) => {
    try {
      await addDoc(collection(db, 'offers'), {
        ...offerData,
        createdAt: Timestamp.now(),
        description: offerData.description,
        discount: offerData.discount,
        productId: productId,
        shopId: offerData.shopId,
        title: offerData.title,
        validFrom: offerData.validFrom,
        validTo: offerData.validTo,
        
      });
      console.log(offerData.validFrom, offerData.validTo);
      fetchOffer(productId); // Refresh products list
    } catch (error) {
      setError('Error adding offer');
      console.error('Error adding offer:', error);
    }
  }
  

  return (
    <ShopContext.Provider value={{ shopInfo, products, offers, error,loading, fetchShopInfo, fetchProducts, addProduct, fetchOffer, addOffer }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  return useContext(ShopContext);
};
