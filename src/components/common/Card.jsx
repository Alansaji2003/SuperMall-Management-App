import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ApartmentIcon from '@mui/icons-material/Apartment';
function Card(props) {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/dashboard/shops/${props.categoryId}/details/${props.id}`);
  };

  const [offers, setOffers] = useState(0);

  useEffect(() => {
    if(props.offers){
      let number = 0;
      props.offers.map((offer)=>{
        
        
        if(offer.shopId == props.id){
          number = number + 1;
        }
      })
      setOffers(number);
    }
  },[])
  

  return (
    <div onClick={handleClick}  className='p-5 cursor-pointer'>
    <a  className="block rounded-lg p-4 shadow-sm shadow-indigo-100 bg-gray-900">
  <img
    alt=""
    src={props.img}
    className="h-56 w-full rounded-md object-cover"
  />

  <div className="mt-2">
    <dl>
      <div>
        
      </div>

      <div>
        <dt className="sr-only">Address</dt>

        <dd className="font-medium text-white">{props.name}</dd>
      </div>
    </dl>

    <div className="mt-6 flex items-center gap-8 text-xs">
      <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
        <svg
          className="size-4 text-indigo-700"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
          />
        </svg>

        <div className="mt-1.5 sm:mt-0">
          <p className="text-white">Floor no.</p>

          <p className="font-medium text-white">{props.floor}</p>
        </div>
      </div>

      <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
        <ApartmentIcon className="size-3 text-indigo-700" />

        <div className="mt-1.5 sm:mt-0">
          <p className=" text-white">Section</p>

          <p className="font-medium text-white">{props.section}</p>
        </div>
      </div>

      <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
        <LocalOfferIcon className="size-3 text-indigo-700" />


        <div className="mt-1.5 sm:mt-0">
          <p className="text-white">Offers</p>

          <p className="font-medium text-white">{offers}</p>
        </div>
      </div>
    </div>
  </div>
</a>
    </div>
  )
}

export default Card