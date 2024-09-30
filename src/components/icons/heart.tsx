import * as React from 'react';

const HeartIcon = ({ width = 26, height = 26, ...props }: any) => {
  const strokeWidth = (width + height) / 30; // Adjust strokeWidth based on size
  
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"  
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth} 
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M19.5 12.572L12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572" />
    </svg>
  );
};

export default HeartIcon;
