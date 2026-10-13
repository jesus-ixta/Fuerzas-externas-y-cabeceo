import React from 'react';
import { Latex } from './Latex';

interface MathMarkdownProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

/**
 * Checks if a string inside backticks looks like a mathematical equation rather than programming code
 */
function isMathExpression(str: string): boolean {
  const trimmed = str.trim();
  const mathKeywords = [
    '\\omega', '\\zeta', '\\phi', '\\ddot', '\\dot', '\\sqrt', '\\frac',
    'omega', 'zeta', 'phi', 'wn', 'wd', 'F0', 'me', 'rd', 'X =', 'r =',
    'm*x', 'mx', 'kx', 'cx', 'cos(', 'sin(', 'arctan', 'delta', 'rad/s',
    '^2', '²', '³', 'sqrt(', '±', '≈', '≠', '≤', '≥', '∫', 'λ'
  ];
  return (
    mathKeywords.some((kw) => trimmed.toLowerCase().includes(kw.toLowerCase())) ||
    (/^[\w\s\+\-\*\/\^\=\(\)\.\,\\]+$/.test(trimmed) &&
      (trimmed.includes('=') || trimmed.includes('/') || trimmed.includes('^')))
  );
}

/**
 * Cleans formula strings (removes markdown backticks, trims)
 */
function cleanFormula(raw: string): string {
  return raw
    .replace(/^```(?:latex|math|plaintext)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();
}

/**
 * Parses inline text for $math$, \(math\), `math`, **bold**, *italic*
 */
function renderInlineContent(text: string, isUser: boolean = false): React.ReactNode[] {
  const regex = /(\$([^\$]+)\$|\\\(([^\)]+)\\\)|`([^`]+)`|\*\*([^\*]+)\*\*|\*([^\*]+)\*)/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Case 1: $...$
    if (match[2] !== undefined) {
      elements.push(
        <Latex
          key={match.index}
          math={match[2]}
          displayMode={false}
          className={`mx-0.5 ${isUser ? 'text-white font-semibold' : 'text-blue-900 font-semibold'}`}
        />
      );
    }
    // Case 2: \(...\)
    else if (match[3] !== undefined) {
      elements.push(
        <Latex
          key={match.index}
          math={match[3]}
          displayMode={false}
          className={`mx-0.5 ${isUser ? 'text-white font-semibold' : 'text-blue-900 font-semibold'}`}
        />
      );
    }
    // Case 3: `...`
    else if (match[4] !== undefined) {
      const codeContent = match[4];
      if (isMathExpression(codeContent)) {
        const latexEquivalent = codeContent
          .replace(/omega_n|wn/g, '\\omega_n')
          .replace(/omega/g, '\\omega')
          .replace(/zeta/g, '\\zeta')
          .replace(/phi/g, '\\phi')
          .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
          .replace(/([a-zA-Z0-9]+)\^2/g, '$1^2');
        elements.push(
          <Latex
            key={match.index}
            math={latexEquivalent}
            displayMode={false}
            className={`mx-0.5 ${isUser ? 'text-white font-semibold' : 'text-blue-900 font-semibold'}`}
          />
        );
      } else {
        elements.push(
          <code
            key={match.index}
            className={`px-1.5 py-0.5 rounded font-mono text-xs ${
              isUser ? 'bg-blue-700 text-white' : 'bg-slate-200/70 text-slate-800'
            }`}
          >
            {codeContent}
          </code>
        );
      }
    }
    // Case 4: **bold**
    else if (match[5] !== undefined) {
      elements.push(
        <strong key={match.index} className={`font-bold ${isUser ? 'text-white' : 'text-slate-900'}`}>
          {match[5]}
        </strong>
      );
    }
    // Case 5: *italic*
    else if (match[6] !== undefined) {
      elements.push(
        <em key={match.index} className={`italic ${isUser ? 'text-blue-100' : 'text-slate-800'}`}>
          {match[6]}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

export const MathMarkdown: React.FC<MathMarkdownProps> = ({ content, isUser = false, className = '' }) => {
  const normalized = content.replace(/\r\n/g, '\n');

  // Match block math: $$...$$, \[...\], or ```math/latex/code containing math
  const blockRegex = /(?:\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|```(?:math|latex)?\n([\s\S]*?)```)/g;

  const blocks: Array<{ type: 'math' | 'text'; content: string }> = [];
  let lastIdx = 0;
  let blockMatch: RegExpExecArray | null;

  while ((blockMatch = blockRegex.exec(normalized)) !== null) {
    if (blockMatch.index > lastIdx) {
      const textBlock = normalized.slice(lastIdx, blockMatch.index).trim();
      if (textBlock) {
        blocks.push({ type: 'text', content: textBlock });
      }
    }

    const mathContent = blockMatch[1] || blockMatch[2] || blockMatch[3] || '';
    blocks.push({ type: 'math', content: cleanFormula(mathContent) });

    lastIdx = blockRegex.lastIndex;
  }

  if (lastIdx < normalized.length) {
    const remaining = normalized.slice(lastIdx).trim();
    if (remaining) {
      blocks.push({ type: 'text', content: remaining });
    }
  }

  if (blocks.length === 0) {
    blocks.push({ type: 'text', content: normalized });
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      {blocks.map((block, bIdx) => {
        if (block.type === 'math') {
          return (
            <div
              key={bIdx}
              className={`my-2.5 py-2.5 px-3 rounded-xl text-center overflow-x-auto shadow-2xs ${
                isUser
                  ? 'bg-blue-700/80 border border-blue-500/50 text-white'
                  : 'bg-white border border-slate-200 text-slate-900'
              }`}
            >
              <Latex math={block.content} displayMode={true} />
            </div>
          );
        }

        const paragraphs = block.content.split(/\n\s*\n/);

        return (
          <React.Fragment key={bIdx}>
            {paragraphs.map((para, pIdx) => {
              const lines = para.split('\n');

              const isNumberedList = lines.every((line) => /^\s*\d+[\.\)]\s+/.test(line));
              const isBulletList = lines.every((line) => /^\s*[\-\*]\s+/.test(line));

              if (isNumberedList) {
                return (
                  <ol
                    key={pIdx}
                    className={`list-decimal pl-5 space-y-1.5 text-xs sm:text-sm ${
                      isUser ? 'text-blue-50' : 'text-slate-700'
                    }`}
                  >
                    {lines.map((line, lIdx) => {
                      const itemText = line.replace(/^\s*\d+[\.\)]\s+/, '');
                      return (
                        <li key={lIdx} className="leading-relaxed">
                          {renderInlineContent(itemText, isUser)}
                        </li>
                      );
                    })}
                  </ol>
                );
              }

              if (isBulletList) {
                return (
                  <ul
                    key={pIdx}
                    className={`list-disc pl-5 space-y-1.5 text-xs sm:text-sm ${
                      isUser ? 'text-blue-50' : 'text-slate-700'
                    }`}
                  >
                    {lines.map((line, lIdx) => {
                      const itemText = line.replace(/^\s*[\-\*]\s+/, '');
                      return (
                        <li key={lIdx} className="leading-relaxed">
                          {renderInlineContent(itemText, isUser)}
                        </li>
                      );
                    })}
                  </ul>
                );
              }

              if (para.startsWith('### ')) {
                return (
                  <h4
                    key={pIdx}
                    className={`font-bold text-sm mt-2 ${isUser ? 'text-white' : 'text-slate-900'}`}
                  >
                    {renderInlineContent(para.slice(4), isUser)}
                  </h4>
                );
              }
              if (para.startsWith('## ')) {
                return (
                  <h3
                    key={pIdx}
                    className={`font-extrabold text-base mt-2 ${isUser ? 'text-white' : 'text-slate-900'}`}
                  >
                    {renderInlineContent(para.slice(3), isUser)}
                  </h3>
                );
              }

              return (
                <p
                  key={pIdx}
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isUser ? 'text-white' : 'text-slate-700'
                  }`}
                >
                  {lines.map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {renderInlineContent(line, isUser)}
                      {lIdx < lines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
