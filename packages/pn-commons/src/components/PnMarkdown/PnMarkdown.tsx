import ReactMarkdown from 'react-markdown';

export type PNMarkdownProps = {
  content: string;
};

const allowedElements = [
  'h1',
  'h2',
  'h3',
  'p',
  'strong',
  'em',
  'code',
  'ul',
  'li',
  'a',
  'br',
] as const;

type LinkComponentProps = {
  href?: string;
  children?: React.ReactNode;
};

const isSafeHref = (href?: string): href is string => !!href && /^https:\/\//i.test(href);

const LinkComponent = ({ href, children }: LinkComponentProps) => {
  if (!isSafeHref(href)) {
    return <>{children}</>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export const PNMarkdown = ({ content = '' }: PNMarkdownProps) => {
  if (!content.trim()) {
    return null;
  }

  return (
    <ReactMarkdown
      skipHtml
      allowedElements={[...allowedElements]}
      components={{
        a: LinkComponent,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default PNMarkdown;
