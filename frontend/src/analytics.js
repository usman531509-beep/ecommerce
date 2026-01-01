import ReactGA from "react-ga4";

export const initGA = () => {
  
  ReactGA.initialize("G-FDS8NVET3P"); 
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};