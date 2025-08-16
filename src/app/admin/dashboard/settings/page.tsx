"use client";

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { Outfit } from 'next/font/google';

// Load Outfit font
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // choose weights you need
});

export default function UnderConstruction() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/under-construction.json')
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <div
    className={outfit.className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      minHeight: '100vh',
      paddingTop: '50px',
      textAlign: 'center',
      background: '#f9fafb'
    }}
  >
    <div style={{ width: 350, height: 310, marginTop: '50px' }}>
      <Lottie animationData={animationData} loop={true} />
    </div>
    <h1 style={{ fontSize: '2rem', color: '#000', marginTop: '1rem' }}>
      Under Construction
    </h1>
    <p style={{ fontSize: '1.2rem', color: '#777', marginTop: '0.5rem' }}>
      This page is currently being built. Check back soon!
    </p>
  </div>
  
  );
}
