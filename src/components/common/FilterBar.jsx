import {
    Button, TextField, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, Container, Grid, Typography,
    Box, Drawer, List, ListItem, ListItemText, Checkbox, AppBar,
    Toolbar, IconButton,
  } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useFirebase } from '../../scripts/firebaseContext';
import { FilterList as FilterListIcon, Compare as CompareIcon } from '@mui/icons-material';
import Loading from './Loading';
import { useShop } from '../../scripts/ShopDetailContext';
import AlertDialog from './AlertDialog';
import { useParams } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs' 
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useAuth } from '../../hooks/useAuth';



const prices = ['Below $500', 'Below $1000', 'Below $2000', 'Above $2000'];

function FilterBar() {
    const {user} = useAuth();
    const [isAdmin, setIsAdmin] = useState(false);
    const { findRole} = useFirebase();
    const { shopId } = useParams();
    const [offers, setOffers] = useState({});
    const [isFilterOpen, setFilterOpen] = useState(false);
    const {products, loading, fetchOffer, addOffer,fetchShopInfo, fetchProducts, } = useShop();
    const [isCompareOpen, setCompareOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [comparisonList, setComparisonList] = useState([]);
    const [productId, setProductId] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [openOffer, setOpenOffer] = useState(false);
    const [validFrom, setValidFrom] = useState(null);
    const [validTo, setValidTo] = useState(null);

    useEffect(() => {

        const result = findRole(user?.uid);
        result.then((role) => {
          if (role === 'admin') {
            setIsAdmin(true);
          }
        });
    
      }, [user?.uid]);
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

      useEffect(() => {
        if (shopId) {
          fetchShopInfo(shopId);
          fetchProducts(shopId);
        }
      }, [shopId]);
      const handleOfferSubmit = (e) => {
        setIsDisabled(true);
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get('name');
        const discount = formData.get('discount');
        const description = formData.get('description');
        const validFrom = formData.get('validFrom');
        const validTo = formData.get('validTo');
    
    
        addOffer(productId, { title, discount, description, shopId, validFrom, validTo });
    
        fetchProducts(shopId);
        setIsDisabled(false);
        setOpenOffer(false);
      }
    
    const handleCompareChange = (product) => {
        const newComparisonList = comparisonList.includes(product)
          ? comparisonList.filter(item => item !== product)
          : [...comparisonList, product];
        setComparisonList(newComparisonList);
      };
    

    const handlePriceChange = (priceRange) => {
        const newSelectedPrices = selectedCategories.includes(priceRange)
          ? selectedCategories.filter(price => price !== priceRange)
          : [...selectedCategories, priceRange];
        setSelectedCategories(newSelectedPrices);
      };
      const filteredProducts = products.filter(product => {
        if (selectedCategories.length === 0) return true;
        const productPrice = parseFloat(product.price);
        return selectedCategories.some(priceRange => {
          if (priceRange === 'Below $500') return productPrice < 500;
          if (priceRange === 'Below $1000') return productPrice < 1000;
          if (priceRange === 'Below $2000') return productPrice < 2000;
          if (priceRange === 'Above $2000') return productPrice > 2000;
          return false;
        });
      });

      const handleOfferClick = (productId) => {
        setProductId(productId);
      }

    return (
        <div>
            <AppBar position="static" color="transparent" sx={{ top: 'auto', bottom: 0 }}>

                <Toolbar className='flex justify-between items-center bg-gray-900'>
                    <h2 className='text-white font-bold'>Product Display</h2>
                    <div>
                        <IconButton edge="start" color="inherit" aria-label="filter" onClick={() => setFilterOpen(true)}>

                            <FilterListIcon className='text-white' />

                        </IconButton>
                        <IconButton edge="end" color="inherit" aria-label="compare" onClick={() => setCompareOpen(true)}>
                            <CompareIcon className='text-white' />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={isFilterOpen} onClose={() => setFilterOpen(false)}>
                <List>
                    <ListItem>
                        <Typography variant="h6">Filter by Price</Typography>
                    </ListItem>
                    {prices.map((price) => (
                        <ListItem key={price} onClick={() => handlePriceChange(price)}>
                            <Checkbox checked={selectedCategories.includes(price)} />
                            <ListItemText primary={price} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Drawer anchor="right" open={isCompareOpen} onClose={() => setCompareOpen(false)}>
                <List>
                    <ListItem>
                        <Typography variant="h6">Comparison List</Typography>
                    </ListItem>
                    {comparisonList.map((product) => (
                        <ListItem key={product.id}>
                            <ListItemText primary={product.name} secondary={`Price: $${product.price}`} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Container>
        {loading && <div className='flex justify-center'><Loading /></div>}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {filteredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  p: 3,
                  backgroundColor: '#111827',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                  },
                }}
                className='bg-gray-900'
              >
                <div className='flex justify-between mb-4'>
                  {isAdmin && (<AlertDialog productId={product.id} from="productpart" title="Delete this product?" text="Product" color="error" ask="Do you want to delete this product from the current shop? Doing so will remove the product data, as well as its offer data from server." />)}

                  {isAdmin && (<AlertDialog productId={product.id} from="offerpart" title="Clear offers?" text="Offer" color="warning" ask="Do you want to clear all offers from this product? Doing so will remove this offer data from the server." />)}

                </div>
                <Typography fontWeight={700} className='text-sky-300' variant="h5" sx={{ mb: 1 }}>
                  {product.name}
                </Typography>
                <Typography className='text-green-400' variant="h6" sx={{ mb: 1 }}>
                  Price: ${product.price}
                </Typography>
                <Typography className='text-gray-100' variant="body1" sx={{ mb: 1 }}>
                  Category: {product.category}
                </Typography>

                <Typography className='text-gray-100' variant="h6">

                  {offers[product.id] ? (
                    <>

                      {offers[product.id][0] != null && <hr className="border-t-2 border-gray-300 my-4 mx-auto w-1/2" />}
                      {offers[product.id].map((offer) => (

                        <span key={offer.id}>
                          {offer.title}: {offer.description}<br />
                          {offer.discount ? `Discount: ${offer.discount}%` : ''}<br />
                        </span>
                      ))}
                    </>
                  ) : 'Loading...'}
                </Typography>
                <hr className="border-t-2 border-gray-300 my-4 mx-auto w-1/2" />
                <Typography className='text-gray-100' variant="h6">

                  <span className='font-bold'>Features:</span><br />
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </Typography>
                <div className='flex items-center gap-3 mt-2'>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleCompareChange(product)}
                  >
                    {comparisonList.includes(product) ? 'Remove from Compare' : 'Add to Compare'}
                  </Button>
                  {isAdmin && (<Button
                    disabled={openOffer}
                    sx={{ mt: 2 }}
                    onClick={() => { handleOfferClick(product.id); setOpenOffer(true); }}
                    variant='contained'
                  >
                    Add Offer
                  </Button>)}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Dialog
                      open={openOffer}
                      onClose={() => setOpenOffer(false)}
                      PaperProps={{
                        style: {
                          backgroundColor: '#1f2937',
                          color: '#f9fafb'
                        },
                        component: 'form',
                        onSubmit: handleOfferSubmit
                      }}
                    >
                      <DialogTitle style={{ color: '#f9fafb' }}>Add a new offer to the product</DialogTitle>
                      <DialogContent>
                        <DialogContentText style={{ color: '#f9fafb' }}>
                          Provide information about the new offer.
                        </DialogContentText>
                        <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="name"
                          name="name"
                          label="Name of the offer"
                          fullWidth
                          variant="standard"
                          InputLabelProps={{ style: { color: '#94b8b8' } }}
                          InputProps={{ style: { color: '#f9fafb' } }}
                        />
                        <TextField
                          required
                          margin="dense"
                          id="discount"
                          name="discount"
                          label="Discount % of the offer"
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
                          label="Description of the offer"
                          fullWidth
                          variant="standard"
                          InputLabelProps={{ style: { color: '#94b8b8' } }}
                          InputProps={{ style: { color: '#f9fafb' } }}
                        />
                        <DatePicker
                          label="Valid From"
                          value={validFrom}
                          onChange={(newValue) => setValidFrom(newValue)}
                          slotProps={{ textField: { variant: 'filled', style: { backgroundColor: '#ffff' } } }}
                        />
                        <DatePicker
                          label="Valid To"
                          value={validTo}
                          onChange={(newValue) => setValidTo(newValue)}
                          slotProps={{ textField: { variant: 'filled', style: { backgroundColor: '#ffff' } } }}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={() => setOpenOffer(false)} style={{ color: '#f9fafb' }}>Cancel</Button>
                        <Button disabled={isDisabled} type="submit" style={{ color: '#f9fafb', backgroundColor: 'green' }}>Add to Database</Button>
                      </DialogActions>
                    </Dialog>

                  </LocalizationProvider>
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
        </div>
    )
}

export default FilterBar