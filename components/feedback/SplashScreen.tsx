import React from 'react';

interface SplashScreenProps {
  onAnimationEnd: () => void;
  isFadingOut: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationEnd, isFadingOut }) => {
  return (
    <div
      className={`fixed inset-0 z-[999] flex items-center justify-center overflow-hidden ${isFadingOut ? 'splash-container splash-fade-out' : 'splash-container'}`}
      onAnimationEnd={(e) => {
        if (isFadingOut && e.animationName === 'splash-fade-out') onAnimationEnd();
      }}
    >
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        <img
          src="https://acdn-us.mitiendanube.com/stores/004/048/852/themes/common/logo-59460031-1702327004-d85672d8490cfcdddfd25fff2c4cb1621702327004-480-0.webp"
          alt="Mansao Maromba Logo"
          className="splash-logo splash-logo-size"
        />
        <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full splash-progress rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
