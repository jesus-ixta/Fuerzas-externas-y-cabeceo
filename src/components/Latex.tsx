import React, { useMemo } from 'react';
import katex from 'katex';

interface LatexProps {
  math: string;
  displayMode?: boolean;
  className?: string;
}

export const Latex: React.FC<LatexProps> = ({ math, displayMode = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
      });
    } catch (error) {
      console.error('KaTeX error:', error);
      return `<span class="text-rose-600 font-mono text-sm">${math}</span>`;
    }
  }, [math, displayMode]);

  return (
    <span
      className={`inline-block ${displayMode ? 'my-2 block overflow-x-auto py-1 text-center' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
