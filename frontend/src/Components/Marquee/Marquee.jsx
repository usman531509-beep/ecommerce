import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../Context/ShopContext';
import { Tag } from 'lucide-react'; 
import axios from 'axios';
import './Marquee.css';


const OfferMarquee = () => {
    const { API_BASE_URL } = useContext(ShopContext); 
    const [offers, setOffers] = useState([]);
    
    useEffect(() => {
        const fetchMarqueeOffers = async () => {
            try {
        
                const response = await axios.get(`${API_BASE_URL}/api/offers`); 
                setOffers(response.data);
            } catch (error) {
                console.error("Failed to fetch marquee offers:", error);
                setOffers([]);
            }
        };
        fetchMarqueeOffers();
    }, [API_BASE_URL]);


    if (!offers || offers.length === 0) {
        return null;
    }
    

   
    const createMarqueeContent = (offersArray, repeatIndex) => {
        
        return offersArray.map((offer, index) => (
            <React.Fragment key={`${offer._id}-${repeatIndex}-${index}`}>
                <span 
                    
                    className="flex items-center gap-4 whitespace-nowrap text-lg font-medium tracking-wide"
                >
                    <Tag className="w-5 h-5 text-yellow-300 animate-pulse" />
                    
                    <span className="text-white">
                        {offer.marqueeText || `${offer.name} is LIVE!`}
                    </span>
                    
                    {offer.discountPercentage > 0 && (
                        <span className="bg-yellow-400 text-red-800 px-3 py-0.5 rounded-full font-bold shadow-md transform hover:scale-105 transition-transform duration-200">
                            {offer.discountPercentage}% OFF
                        </span>
                    )}
                </span>
                
               
                <span className="px-8" />
            </React.Fragment>
        ));
    };


   
    const primaryContent = createMarqueeContent(offers, 0);
    const repeatedContent1 = createMarqueeContent(offers, 1);
    const numberOfRepetitions = 12;
    
    return (
        <div 
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-2.5 overflow-hidden shadow-xl z-50 border-b-2 border-red-800"
        >
            
            <div className="marquee-content flex animate-marquee items-center"> 
                
                {primaryContent}
                {repeatedContent1}
                {Array.from({ length: numberOfRepetitions - 2 }).map((_, i) => (
                    <React.Fragment key={i}>
                        {createMarqueeContent(offers, i + 2)}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default OfferMarquee;