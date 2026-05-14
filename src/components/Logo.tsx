import React from 'react';

const LOGO_URL = "https://yt3.ggpht.com/gQZnjAzR4qzJPbuHBN-odnw7k_5VDi1sGeyH4w4qWSX0B8sJ7C71HPn0xbqom1g-EpXju27XnA=s176-c-k-c0x00ffffff-no-rj-mo";

interface LogoProps {
  className?: string;
  size?: number | string;
}

export default function Logo({ className = "", size = 120 }: LogoProps) {
  return (
    <img 
      src={LOGO_URL} 
      alt="Apna Gyanshala Logo" 
      width={size} 
      height={size} 
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      referrerPolicy="no-referrer"
    />
  );
}
