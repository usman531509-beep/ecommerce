import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const CategoryShowcase = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "1",
      name: "RINGS",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=500",
      path: "/rings"
    },
    {
      id: "2",
      name: "NECKLACES",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500",
      path: "/necklaces"
    },
    {
      id: "3",
      name: "BRACELETS",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=500",
      path: "/bracelets"
    },
    {
      id: "4",
      name: "EARRINGS",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=500",
      path: "/earings"
    }
  ];

  return (
    <section className="w-full py-6 md:py-12 px-2 md:px-4 bg-white">

      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-0">
        
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            onClick={() => navigate(cat.path)}
            whileHover={{ scale: 0.98 }}
            className="relative h-[250px] md:h-[400px] cursor-pointer overflow-hidden group"
          >
            {/* Category Image */}
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Category Name */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-white text-base md:text-2xl font-light tracking-[0.1em] md:tracking-[0.2em] uppercase transition-all duration-300 group-hover:tracking-[0.3em]">
                {cat.name}
              </h2>
            </div>  

            {/* Bottom Border Animation (Hidden on mobile for better look) */}
            <motion.div 
              initial={{ width: 0 }}
              whileHover={{ width: "60%" }}
              className="hidden md:block absolute bottom-1/2 translate-y-8 h-[1px] bg-white/60 left-1/2 -translate-x-1/2"
            />
          </motion.div>
        ))}

      </div>
    </section>
  );
};

export default CategoryShowcase;