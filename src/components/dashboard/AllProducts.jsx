import React from 'react';
import { useFirebase } from '../../scripts/firebaseContext';

function AllProducts() {
  const { products } = useFirebase();

  return (
    <div className='bg-sky-950 h-full p-5'>
      <h1 className='font-bold text-white text-2xl mb-5'>All the products in the mall</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 lg:grid-cols-4'>
        {products.map((product) => (
          <div key={product.name} className='bg-gray-900 rounded-lg shadow-md p-5'>
            <h2 className='font-bold text-white text-lg mb-2'>{product.name}</h2>
            <p className='text-gray-300 mb-4'>Category: {product.category}</p>
            <p className='text-gray-300 mb-4'>Price: ${product.price}</p>
            <ul className='text-gray-300 mb-4'>
              {product.features.map((feature, index) => (
                <li key={index} className='text-sm'>{feature}</li>
              ))}
            </ul>
            <p className='text-gray-500 text-sm'>Shop ID: {product.shopId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
