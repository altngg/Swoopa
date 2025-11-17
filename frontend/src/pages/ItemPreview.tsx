import React from 'react';
import { useParams } from 'react-router-dom';

const ItemPreview = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Просмотр товара</h1>
      <p>ID товара: {id}</p>
    </div>
  );
};

export default ItemPreview;