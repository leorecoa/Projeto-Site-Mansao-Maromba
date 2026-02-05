import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
};

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`glass-card ${className}`}
      style={{
        background: 'var(--color-bg-card, rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--color-border, rgba(255, 255, 255, 0.1))',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
