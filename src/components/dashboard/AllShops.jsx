import React, { useState } from 'react'
import { useFirebase } from '../../scripts/firebaseContext';
import Card from '../common/Card';


function AllShops() {
    
    const {shops, offers} = useFirebase();
    

  return (
    <div className='bg-sky-950 h-full p-5 '>
    <h1 className='font-bold text-white text-2xl '>All the shops in the mall</h1>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 lg:grid-col-4'>
    {shops.map((shop)=>(
        <Card
              key={shop.id}
              id={shop.id}
              categoryId={shop.categoryId}
              name={shop.name}
              img={shop.img}
              floor={shop.location.floor}
              section={shop.location.section}
              offers={offers}
            />
    )
    )}
    </div>
    
        
    </div>
  )
}

export default AllShops