import React from 'react'
import { useNavigate } from 'react-router-dom';

function CategoryCard(props) {
  const navigate = useNavigate();
  

  const handleClick = () => {
    navigate(`/dashboard/shops/${props.id}`);
  };
  return (
    <div onClick={handleClick} className="cursor-pointer">
        <article
  className="overflow-hidden rounded-lg shadow transition hover:shadow-lg dark:shadow-gray-700/25"
>
  <img
    alt=""
    src={props.img}
    className="h-56 w-full object-cover"
  />

  <div className="bg-white p-4 sm:p-6 dark:bg-gray-900">
    

    <a href="#">
      <h3 className="mt-0.5 text-lg text-gray-900 dark:text-white">
        {props.title}
      </h3>
    </a>

    <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500 dark:text-gray-400">
      {props.desc}
    </p>
  </div>
</article>
    </div>
  )
}

export default CategoryCard