import React, { useMemo } from 'react';
import { motion, Transition } from 'framer-motion';

// Define a type for our randomized element configuration
interface RandomElementProps {
  count?: number;
  types?: React.ReactNode[];
  containerClass?: string;
  elementClass?: string;
}

const RandomizedElements: React.FC<RandomElementProps> = ({
  count = 10,
  types = ['&#x266B;', '&#9833;', '&#9834;', '&#9835;', '&#9836;', '&#9837;', '&#9838;', '&#9839;'],
  containerClass = 'absolute inset-0 overflow-hidden pointer-events-none',
  elementClass = 'absolute'
}) => {
  // Generate consistent random elements using useMemo
  const randomElements = useMemo(() => {
    return Array.from({ length: count }, (_, index) => ({
      id: `random-element-${index}`,
      type: types[Math.floor(Math.random() * types.length)],
      initial: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.7 + 0.3,
        scale: Math.random() * 0.5 + 0.5,
        rotate: Math.random() * 360
      },
      animate: {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        opacity: [
          Math.random() * 0.7 + 0.3, 
          Math.random() * 0.3, 
          Math.random() * 0.7 + 0.3
        ],
        rotate: [
          Math.random() * 360,
          Math.random() * 360,
          Math.random() * 360
        ]
      },
      transition: {
        duration: Math.random() * 5 + 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      } as Transition
    }));
  }, [count, types]);

  return (
    <div className={containerClass}>
      {randomElements.map((element) => (
        <motion.span
          key={element.id}
          className={elementClass}
          initial={element.initial}
          animate={element.animate}
          transition={element.transition}
          dangerouslySetInnerHTML={{ __html: element.type as string }}
        />
      ))}
    </div>
  );
};

export default RandomizedElements;