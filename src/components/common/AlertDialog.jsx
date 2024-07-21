import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../../scripts/firebaseConfig';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useShop } from '../../scripts/ShopDetailContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../scripts/firebaseContext';

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const {fetchProducts} = useShop();
  const { shopId } = useParams();
  const {categoryId} = useParams();
  const {refreshShops, refreshCategories} = useFirebase();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeCategory = async (categoryId) => {
    console.log("Removing category now");
    setIsDisabled(true);
    try {
        await deleteDoc(doc(db, 'categories', categoryId));
        refreshCategories();
        navigate('/dashboard');
    } catch (error) {
        console.error("Error removing category: ", error);
    } finally {
        setIsDisabled(false);
    }
  }

  const removeShop = async (shopId) => {
    console.log("Removing shop now");
    setIsDisabled(true);
    try {
        await deleteDoc(doc(db, 'shops', shopId));
        refreshShops();
        navigate(`/dashboard/shops/${categoryId}`);
    } catch (error) {
        console.error("Error removing shop: ", error);
    } finally {
        setIsDisabled(false);
    }
  }

  const removeProduct = async (productId) => {
    console.log("Removing product now");
    setIsDisabled(true);
    try {
        await deleteDoc(doc(db, 'products', productId));
        fetchProducts(shopId); //refresh
    } catch (error) {
        console.error("Error removing product: ", error);
    } finally {
        setIsDisabled(false);
    }


  }

  const removeOffers = async (productId) => {
    console.log("Removing offer now");
    setIsDisabled(true);
    try {
        const offersCollection = collection(db, 'offers');
        const q = query(offersCollection, where('productId', '==', productId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('No matching offers found');
        } else {
            querySnapshot.forEach(async (document) => {
                await deleteDoc(doc(db, 'offers', document.id));
                console.log(`Deleted offer with ID: ${document.id}`);
            });
            fetchProducts(shopId); //refresh
        }
    } catch (error) {
        console.error("Error removing offer: ", error);
    } finally {
        setIsDisabled(false);
    }

  }

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen} variant='contained' color={props.color}> <DeleteIcon />{props.text}</Button>
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
            if(props.from === 'offerpart'){
            removeOffers(props.productId);
            }else if (props.from === 'productpart'){
              removeProduct(props.productId);
            }else if(props.from === 'shoppart'){
              removeShop(props.shopId);
            }else if(props.from === 'categorypart'){
              removeCategory(props.categoryId);
            }
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: '#f9fafb' }}>
          {props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ color: '#f9fafb' }}>
            {props.ask}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: '#f9fafb',
              backgroundColor: '#3b3b3b',
              '&:hover': {
                backgroundColor: '#555555'
              }
            }}
          >
            Disagree
          </Button>
          <Button
            type='submit'
            disabled={isDisabled}
            onClick={handleClose}
            autoFocus
            sx={{
              color: '#f9fafb',
              backgroundColor: 'red',
              '&:hover': {
                backgroundColor: '#555555'
              }
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>


    </React.Fragment>
  );
}
