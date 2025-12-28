import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import Breadcrum from "../Components/Breadcrum/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import DiscriptiobBox from "../Components/DiscriptionBox/DiscriptiobBox";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  
  const { ProductId } = useParams(); 
  
  const product = all_product.find((item) => item._id === ProductId);

  if (!product) {
    return (
      <div className="p-8 text-center text-xl text-red-600 min-h-screen bg-gray-50">
        Product not found 🧐
      </div>
    );
  }

  return (
    <div className="pt-16 bg-white min-h-screen">
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DiscriptiobBox product={product} />
    </div>
  );
};

export default Product;
