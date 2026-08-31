import ReactMarkdown from 'react-markdown';

export type PNMarkdownProps = {
  content: string;
  onExternalLinkClick?: (href: string) => void;
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
  onExternalLinkClick?: (href: string) => void;
};

const isSafeHref = (href?: string): href is string => !!href && /^https:\/\//i.test(href);

const LinkComponent = ({ href, children, onExternalLinkClick }: LinkComponentProps) => {
  if (!isSafeHref(href)) {
    return <>{children}</>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onExternalLinkClick?.(href)}
    >
      {children}
    </a>
  );
};

type MarkdownComponentsProps = {
  onExternalLinkClick?: (href: string) => void;
};

const getMarkdownComponents = ({ onExternalLinkClick }: MarkdownComponentsProps) => ({
  a: (props: LinkComponentProps) => (
    <LinkComponent {...props} onExternalLinkClick={onExternalLinkClick} />
  ),
});

export const PNMarkdown = ({ content = '', onExternalLinkClick }: PNMarkdownProps) => {
  if (!content.trim()) {
    return null;
  }

  return (
    <ReactMarkdown
      skipHtml
      allowedElements={[...allowedElements]}
      components={getMarkdownComponents({ onExternalLinkClick })}
    >
      {content}
    </ReactMarkdown>
  );
};

export default PNMarkdown;
