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
      <div className="text-center mt-20 text-2xl font-semibold text-gray-600">
        Product not found 🧐
      </div>
    );
  }

  return (
    <div>
      <Breadcrum product={product} />
      <ProductDisplay product={product} />
      <DiscriptiobBox product={product} />
    </div>
  );
};

export default Product;
