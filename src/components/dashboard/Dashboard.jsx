import React, { useEffect, useState } from 'react';
import CategoryCard from '../common/CategoryCard';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../../scripts/firebaseConfig';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Outlet, useLocation } from 'react-router-dom';
import { useFirebase } from '../../scripts/firebaseContext';
import Loading from '../common/Loading';
import Menu from '../common/Menu';
import { useAuth } from '../../hooks/useAuth';

function Dashboard() {
  const {user} = useAuth();
  const location = useLocation();
  const { categories, loading, refreshCategories, findRole } = useFirebase();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    
    const result = findRole(user?.uid);
    result.then((role) => {
      if (role === 'admin') {
        setIsAdmin(true);
      }
    });

  }, [user?.uid]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const addCategory = async () => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const img = document.getElementById('image').value;
    try {
      await addDoc(collection(db, 'categories'), {
        name,
        description,
        img
      });
      // Refresh the categories after adding a new category
      refreshCategories();
      setOpen(false);
    } catch (error) {
      console.error("Error adding document:", error);
      setError(error.message);
    }
  };

  if (location.pathname.startsWith('/dashboard/shops') || location.pathname.startsWith('/dashboard/products')) {
    return <Outlet />;
  }

  return (
    <div className='bg-sky-950 h-full p-5'>
      <div className='flex justify-start mb-3'>
        <Menu location={location.pathname} />
      </div>
      <div className='flex items-center justify-between'>
        {error && <h1 className='text-red-700'>error: {error}</h1>}
        <h1 className='font-bold text-white text-3xl'>Shop Categories</h1>
        {isAdmin && (
          <Button variant="contained" onClick={handleClickOpen}>
            Add Category
          </Button>
        )}
        <Dialog 
  open={open}
  onClose={handleClose}
  PaperProps={{
    style:{
      backgroundColor: '#1f2937',
      color: '#f9fafb'
    },
    component: 'form',
    onSubmit: (event) => {
      event.preventDefault();
      addCategory();
    },
  }}
>
  <DialogTitle style={{ color: '#f9fafb' }}>Add Category</DialogTitle>
  <DialogContent>
    <DialogContentText style={{ color: '#f9fafb' }}>
      Provide information about the new category you want to add.
    </DialogContentText>
    <TextField
      autoFocus
      required
      margin="dense"
      id="name"
      name="name"
      label="Name of the category"
      fullWidth
      variant="standard"
      InputLabelProps={{ style: { color: '#94b8b8' } }}
      InputProps={{ style: { color: '#f9fafb' } }}
    />
    <TextField
      required
      margin="dense"
      id="description"
      name="description"
      label="Description of the category"
      fullWidth
      variant="standard"
      InputLabelProps={{ style: { color: '#94b8b8' } }}
      InputProps={{ style: { color: '#f9fafb' } }}
    />
    <TextField
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
    <Button type="submit" style={{ color: '#f9fafb', backgroundColor:'green'}}>Add to Database</Button>
  </DialogActions>
      </Dialog>

      </div>
      {loading ? (
        <div className='flex justify-center'>
          <Loading />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 p-5 gap-3 lg:grid-cols-4'>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              id={category.id}
              title={category.name}
              desc={category.description}
              img={category.img}
            />
          ))}
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default Dashboard;
