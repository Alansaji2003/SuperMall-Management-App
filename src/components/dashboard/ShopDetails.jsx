import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
  
} from '@mui/material';

import { useShop } from '../../scripts/ShopDetailContext';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../scripts/firebaseConfig';
import Loading from '../common/Loading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from '../common/Menu';
import { useLocation } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { useFirebase } from '../../scripts/firebaseContext';
import { useAuth } from '../../hooks/useAuth';
import AlertDialog from '../common/AlertDialog';
import FilterBar from '../common/FilterBar';
import SimplePopup from '../common/PopUp';



function ShopDetails() {
  const { user } = useAuth();
  const location = useLocation();
  const { shopId } = useParams();
  const { findRole } = useFirebase();
  const { shopInfo, products, loading, error, setError, fetchShopInfo, fetchProducts, addProduct, fetchOffer, addOffer } = useShop();
  const [open, setOpen] = useState(false);
  
  const [owner, setOwner] = useState('');
  const [createdAt, setCreatedAt] = useState('');

  
  const [featureInputs, setFeatureInputs] = useState(['']);
  const [offers, setOffers] = useState({});
  

  const [isDisabled, setIsDisabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const result = findRole(user?.uid);
    result.then((role) => {
      if (role === 'admin') {
        setIsAdmin(true);
      }
    });

  }, [user?.uid]);
  useEffect(() => {
    if (shopId) {
      fetchShopInfo(shopId);
      fetchProducts(shopId);
    }
  }, [shopId]);

  useEffect(() => {
    if (shopInfo && shopInfo.ownerId) {
      findOwner();
    }
    if (shopInfo && shopInfo.createdAt instanceof Timestamp) {
      setCreatedAt(shopInfo.createdAt.toDate().toLocaleString());
    }
  }, [shopInfo]);

  useEffect(() => {
    const fetchAllOffers = async () => {
      const offersPromises = products.map(product => fetchOffer(product.id));
      const offersResults = await Promise.all(offersPromises);
      const newOffers = {};
      products.forEach((product, index) => {
        newOffers[product.id] = offersResults[index];
      });
      setOffers(newOffers);
    };

    if (products.length > 0) {
      fetchAllOffers();
    }
  }, [products]);



  useEffect(() => { }, [fetchOffer]);




  const findOwner = async () => {
    try {
      const userRef = doc(db, 'users', shopInfo.ownerId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const user = userSnap.data();
        setOwner(user.name);
      } else {
        setError('User not found');
      }
    } catch (error) {
      setError('Error fetching user');
      console.error('Error fetching user:', error);
    }
  };

  const handleAddFeatureInput = () => {
    setFeatureInputs([...featureInputs, '']);
  };

  const handleRemoveFeatureInput = () => {
    if (featureInputs.length > 1) {
      setFeatureInputs(featureInputs.slice(0, -1));
    }
  };

  const handleFeatureInputChange = (index, event) => {
    const newFeatures = [...featureInputs];
    newFeatures[index] = event.target.value;
    setFeatureInputs(newFeatures);
  };

  

  

  

  const handleSubmit = (event) => {
    setIsDisabled(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const price = formData.get('price');
    const features = featureInputs;
    addProduct(shopId, { name, price, features, category: shopInfo.category });
    setOpen(false);
    setIsDisabled(false);
  };


  


  
  return (
    <div className='bg-sky-950 h-full p-5'>
      <div className='flex justify-start mb-3'>
        <Menu location={location.pathname} />
      </div>
      <div className='flex items-center justify-between gap-3'>
        <div>
          {error && <div className='text-red-500'>{error}</div>}
          <div className='flex items-center gap-2'>
            <ArrowBackIcon className='text-white mt-1' onClick={() => window.history.back()} />
            <h2 className='font-bold text-white text-2xl md:text-3xl'>{shopInfo?.name} Details</h2>
          </div>

        </div>
        {isAdmin && (<Button disabled={open} variant="contained" onClick={() => setOpen(true)}>Add Product</Button>)}

      </div>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          style: {
            backgroundColor: '#1f2937',
            color: '#f9fafb'
          },
          component: 'form',
          onSubmit: handleSubmit
        }}
      >
        <DialogTitle style={{ color: '#f9fafb' }}>Add a new product</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#f9fafb' }}>
            Provide information about the new product.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name of the product"
            fullWidth
            variant="standard"
            InputLabelProps={{ style: { color: '#94b8b8' } }}
            InputProps={{ style: { color: '#f9fafb' } }}
          />
          <TextField
            required
            margin="dense"
            id="price"
            name="price"
            label="Price of the product"
            fullWidth
            variant="standard"
            InputLabelProps={{ style: { color: '#94b8b8' } }}
            InputProps={{ style: { color: '#f9fafb' } }}
          />
          {featureInputs.map((feature, index) => (
            <TextField
              key={index}
              required
              margin="dense"
              id={`feature-${index}`}
              label={`Feature ${index + 1}`}
              fullWidth
              variant="standard"
              value={feature}
              onChange={(e) => handleFeatureInputChange(index, e)}
              InputLabelProps={{ style: { color: '#94b8b8' } }}
              InputProps={{ style: { color: '#f9fafb' } }}
            />
          ))}
          <Button onClick={handleAddFeatureInput} style={{ color: '#00f' }}>Add Feature</Button>
          <Button onClick={handleRemoveFeatureInput} style={{ color: '#f00' }}>Remove Feature</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} style={{ color: '#f9fafb', }}>Cancel</Button>
          <Button disabled={isDisabled} type="submit" style={{ color: '#f9fafb', backgroundColor: 'green' }}>Add to Database</Button>
        </DialogActions>
      </Dialog>

      {loading && <div className='flex justify-center'><Loading /></div>}
      <div className='grid grid-col-1 md:grid-cols-2 gap-10 p-10'>
        <div>
          <a href="#" className="block">
            <img alt="" src={shopInfo?.img} className="h-56 w-full rounded-bl-3xl rounded-tr-3xl object-cover sm:h-64 lg:h-72" />
            <div className="mt-4 sm:flex sm:items-center sm:justify-center sm:gap-4">
              <strong className="font-medium text-white">{shopInfo?.name}</strong>
              <span className="hidden sm:block sm:h-px sm:w-8 sm:bg-yellow-500"></span>
              <p className="mt-0.5 opacity-50 sm:mt-0 text-white">{owner}</p>
            </div>
          </a>
        </div>
        <div>
          <div className="flow-root">
            <dl className="sx-my-3 divide-y divide-gray-100 text-sm dark:divide-gray-700 border rounded-lg p-5">
              {shopInfo && (
                <>
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                    <dt className="font-medium text-gray-900 dark:text-white">Admin</dt>
                    <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{owner}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                    <dt className="font-medium text-gray-900 dark:text-white">Location</dt>
                    <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">Floor: {shopInfo.location.floor}, Section: {shopInfo.location.section}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                    <dt className="font-medium text-gray-900 dark:text-white">Category</dt>
                    <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{shopInfo.category}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                    <dt className="font-medium text-gray-900 dark:text-white">Started At</dt>
                    <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{createdAt}</dd>
                  </div>
                  <div className="grid grid-cols-1 gap-1 py-3 even:bg-gray-50 sm:grid-cols-3 sm:gap-4 even:dark:bg-gray-800">
                    <dt className="font-medium text-gray-900 dark:text-white">Last Updated</dt>
                    <dd className="text-gray-700 sm:col-span-2 dark:text-gray-200">{shopInfo.updatedAt?.toDate().toLocaleString() || 'N/A'}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
      <div className='p-3 flex justify-between gap-2'>
        {isAdmin && (<SimplePopup categoryName="this shop"/>)}
        {isAdmin && (<AlertDialog shopId={shopId} from="shoppart" title="Delete this shop?" text="Delete this shop" color="error" ask="Do you want to Delete this shop? Doing this will remove the shop, the products and offers associated with it from the server." />)}

      </div>
      <FilterBar/>
      

    </div>
  );
}

export default ShopDetails;
