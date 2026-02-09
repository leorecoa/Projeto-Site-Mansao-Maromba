
import React from 'react';

interface SplashScreenProps {
  onAnimationEnd: () => void;
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd, isFadingOut }) => {
  return (
    <div 
      className={`fixed inset-0 bg-black z-[999] flex items-center justify-center ${isFadingOut ? 'splash-container fade-out' : 'splash-container'}`}
      onAnimationEnd={(e) => {
        if (isFadingOut && (e.animationName === 'splash-fade-out' || e.animationName === 'fade-out')) onAnimationEnd();
      }}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
      <img 
        src="https://acdn-us.mitiendanube.com/stores/004/048/852/themes/common/logo-59460031-1702327004-d85672d8490cfcdddfd25fff2c4cb1621702327004-480-0.webp" 
        alt="Mansão Maromba Logo" 
        className="w-64 md:w-80 splash-logo relative z-10" 
      />
    </div>
  );
};

export default SplashScreen;
