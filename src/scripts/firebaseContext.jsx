import { useEffect, useState, createContext, useContext } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const [shops, setShops] = useState([]);
    const [products, setProducts] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async (collectionName, setState) => {
        setLoading(true);
        const q = collection(db, collectionName);
        try {
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setState(data);
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
        } finally {
            setLoading(false);
        }
    };
    const findRole = async (uid) => { 
        const q = query(collection(db, 'users'), where('uid', '==', uid));
        try {
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            if (users.length > 0) {
                return users[0].role;
            } else {
                throw new Error("User not found");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    const refreshCategories = () => fetchData('categories', setCategories);
    const refreshShops = () => fetchData('shops', setShops);
    const refreshProducts = () => fetchData('products', setProducts);
    const refreshOffers = () => fetchData('offers', setOffers);

    useEffect(() => {
        fetchData('categories', setCategories);
        fetchData('shops', setShops);
        fetchData('products', setProducts);
        fetchData('offers', setOffers);
    }, []);

    
    return (
        <FirebaseContext.Provider value={{ categories, shops, products, offers, loading, refreshCategories, refreshOffers, refreshProducts, refreshShops, findRole }}>
            {children}
        </FirebaseContext.Provider>
    );
}

export const useFirebase = () => useContext(FirebaseContext);
