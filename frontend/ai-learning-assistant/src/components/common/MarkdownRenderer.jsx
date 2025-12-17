import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-lg font-bold mt-4 mb-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-base font-bold mt-3 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-sm font-bold mt-3 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside mb-2 ml-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside mb-2 ml-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <table
              className="w-full my-3 border border-slate-200/60 rounded-md overflow-hidden text-sm"
              {...props}
            />
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-slate-50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-3 py-2 text-left font-semibold border-b border-slate-200/60 text-slate-900"
              {...props}
            />
          ),
          tr: ({ node, ...props }) => (
            <tr
              className="border-t border-slate-200/60 odd:bg-white even:bg-slate-50/30"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 text-slate-700" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-4 border-slate-200/60" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img
              className="max-w-full rounded-md border border-slate-200/60 my-2"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-([-a-z0-9]+)/i.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : inline ? (
              <code
                className="bg-neutral-100 p-1 rounded font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              <SyntaxHighlighter
                style={dracula}
                language="plaintext"
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="bg-neutral-800 text-white p-3 rounded-md overflow-x-auto font-mono text-sm my-4"
              {...props}
            />
          ),
        }}
      >
        {content || ''}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
