import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useLocation, useParams, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useFirebase } from '../../scripts/firebaseContext';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../scripts/firebaseConfig';
import Loading from '../common/Loading';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Menu from '../common/Menu';


import AlertDialog from '../common/AlertDialog';
import SimplePopup from '../common/PopUp';

function Shops() {
  const { categoryId } = useParams();
  const { shops, refreshShops, loading, offers, findRole } = useFirebase();
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [categoryName, setCategoryName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {

    const result = findRole(user?.uid);
    result.then((role) => {
      if (role === 'admin') {
        setIsAdmin(true);
      }
    });

  }, [user?.uid]);



  // Fetch user info
  const userInfo = async () => {
    if (user) {
      const q = query(collection(db, 'users'), where('uid', '==', user.uid));
      try {
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        if (users.length > 0) {
          return users[0].id;
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
    } else {
      throw new Error("User is not authenticated");
    }
  };

  // Fetch category name
  const fetchCategoryName = async () => {
    const categoryRef = doc(db, 'categories', categoryId);
    try {
      const categorySnap = await getDoc(categoryRef);
      if (categorySnap.exists()) {
        const category = categorySnap.data();
        setCategoryName(category.name);
        return category.name;
      } else {
        console.error("Category not found");
        setError("Category not found");
        return null;
      }
    } catch (error) {
      console.error("Error fetching category:", error);
      setError("Error fetching category");
      return null;
    }
  };

  // Add a new shop
  const addShop = async () => {
    const name = document.getElementById('name').value;
    const floor = document.getElementById('Floor').value;
    const section = document.getElementById('section').value;
    const image = document.getElementById('image').value;

    try {
      const category = await fetchCategoryName();
      const userId = await userInfo();

      await addDoc(collection(db, 'shops'), {
        name,
        category,
        location: {
          floor,
          section
        },
        img: image,
        categoryId: location.pathname.split('/')[3],
        createdAt: serverTimestamp(),
        ownerId: userId
      });

      setOpen(false);
      // Refresh shops after adding a new shop
      refreshShops();
    } catch (error) {
      console.error("Error adding shop:", error);
      throw error;
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const loadCategoryName = async () => {
      try {
        const fetchedCategoryName = await fetchCategoryName();
        setCategoryName(fetchedCategoryName);
      } catch (error) {
        setError(`Error fetching category name from useEffect: ${error}`);
      }
    };
    loadCategoryName();
  }, [categoryId]);

  if (location.pathname.includes('details')) {
    return (
      
        <Outlet />
      
    )
  }

  return (
    <div className='bg-sky-950 h-full p-5'>
      <div className='flex justify-start mb-3'>
        <Menu location={location.pathname} />
      </div>
      <div className='flex items-center justify-between gap-3'>
        {error && <h1 className='text-red-700'>error: {error}</h1>}
        <div className='flex items-center gap-2'>
          <ArrowBackIcon className='text-white mt-1' onClick={() => window.history.back()} />
          <h1 className='font-bold text-white text-2xl md:text-3xl'>{categoryName} shops</h1>
        </div>
        {isAdmin && (
          <Button variant="contained" onClick={handleClickOpen}>
            Add Shop
          </Button>
        )}

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              backgroundColor: '#1f2937',
              color: '#f9fafb'
            },
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              addShop();
            },
          }}
        >
          <DialogTitle style={{ color: '#f9fafb' }}>Add Shop</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ color: '#f9fafb' }}>
              Provide information about the new Shop you want to add.
            </DialogContentText>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Name of the Shop"
              fullWidth
              variant="standard"
              InputLabelProps={{ style: { color: '#94b8b8' } }}
              InputProps={{ style: { color: '#f9fafb' } }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="Floor"
              name="Floor"
              label="Floor number of the Shop"
              fullWidth
              variant="standard"
              InputLabelProps={{ style: { color: '#94b8b8' } }}
              InputProps={{ style: { color: '#f9fafb' } }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="section"
              name="section"
              label="Which section of the floor is the shop located (A, B, C, D)"
              fullWidth
              variant="standard"
              InputLabelProps={{ style: { color: '#94b8b8' } }}
              InputProps={{ style: { color: '#f9fafb' } }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="image"
              name="image"
              label="Banner image, paste 'URL' of the image"
              fullWidth
              variant="standard"
              InputLabelProps={{ style: { color: '#94b8b8' } }}
              InputProps={{ style: { color: '#f9fafb' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ color: '#f9fafb' }}>Cancel</Button>
            <Button type="submit" style={{ color: '#f9fafb', backgroundColor: 'green' }}>Add to Database</Button>
          </DialogActions>
        </Dialog>

      </div>
      {loading ? (
        <div className='flex justify-center'>
          <Loading />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 p-5 gap-3 lg:grid-col-4'>
          {shops.filter(shop => shop.categoryId === categoryId).map(shp => (
            <Card
              key={shp.id}
              id={shp.id}
              categoryId={categoryId}
              name={shp.name}
              img={shp.img}
              floor={shp.location.floor}
              section={shp.location.section}
              offers={offers}
            />
          ))}
        </div>
      )}
      <div className='p-5 flex justify-between items-center gap-1'>

        {isAdmin && (<SimplePopup categoryName={categoryName}/>)}
          


        {isAdmin && (<AlertDialog from="categorypart" categoryId={categoryId} color="error" title="Delete this category?" text={"Delete " + categoryName} ask="By doing so, this category along with all the shops, products and offers along with it will be removed." />)}



      </div>


    </div>
  );
}

export default Shops;
