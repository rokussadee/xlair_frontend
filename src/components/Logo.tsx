import React from 'react';
import logoPath from './dist/assets/logo_white_full.png'

interface LogoProps {
  width?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 288,
  className = ''
}) => {
  return (
    <img
      src={logoPath} // Update with your logo path
      alt="Xlair radio logo"
      width={width}
      className={className}
    />
  );
};

export default Logo;
