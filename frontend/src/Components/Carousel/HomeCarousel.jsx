import React, { useContext } from 'react';
import { ShopContext } from '../../Context/ShopContext';

const RotatingCards = () => {
  const { all_product } = useContext(ShopContext);
  const [rotation, setRotation] = React.useState(0);
  const isDragging = React.useRef(false);
  const startX = React.useRef(0);
  const startRotation = React.useRef(0);
  const isPaused = React.useRef(false);

  React.useEffect(() => {
    let animationFrameId;
    const animate = () => {
      if (!isDragging.current && !isPaused.current) {
        setRotation((prev) => prev + 0.2);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const cards = all_product.slice(5, 15).map((product) => ({
    id: product._id,
    img: product.images?.[0]?.url,
    title: product.name,
  }));

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startRotation.current = rotation;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - startX.current;
    // Adjust sensitivity as needed (e.g., divide by 5 for slower rotation)
    const newRotation = startRotation.current + deltaX / 5;
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e) => {
    isDragging.current = true;
    startX.current = e.touches[0].clientX;
    startRotation.current = rotation;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.touches[0].clientX - startX.current;
    const newRotation = startRotation.current + deltaX / 5;
    setRotation(newRotation);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Stop dragging if mouse leaves the area
  // Stop dragging if mouse leaves the area
  const handleMouseLeave = () => {
    isDragging.current = false;
    isPaused.current = false;
  };

  return (
    <div
      className="
        flex justify-center items-center 
        min-h-[300px] sm:min-h-[500px]
        overflow-hidden 
        [perspective:600px] sm:[perspective:1000px]
        bg-gray-50
        cursor-grab active:cursor-grabbing
      "
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Ring */}
      <div
        className="
          relative 
          w-[80px] h-[100px] 
          sm:w-[200px] sm:h-[200px]
          [transform-style:preserve-3d] 
          transition-transform duration-75 ease-out
        "
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="
              absolute top-0 left-0 
              w-full h-full 
              bg-white rounded-xl 
              shadow-lg overflow-hidden 
              border border-gray-200
              select-none pointer-events-none
            "
            style={{
              transform: `
                rotateY(${index * (360 / cards.length)}deg) 
                translateZ(${window.innerWidth < 640 ? '150px' : '350px'})
              `,
            }}
          >
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RotatingCards;
