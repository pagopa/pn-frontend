import { useIsMobile } from "../useIsMobile";
import { render } from "../../test-utils";
import React from "react";
import mediaQuery from 'css-mediaquery';

const Component = () => {
    const isMobile = useIsMobile();

    return (
        <div>{JSON.stringify(isMobile)}</div>
    )
}

function createMatchMedia(width: number) {
    return (query: string): MediaQueryList => ({
      matches: mediaQuery.match(query, { width }) as boolean,
      media: '',
      addListener: () => {},
      removeListener: () => {},
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });
  }

describe('test useIsMobile hook', () => {

    test('hook should return false', () => {
        window.matchMedia = createMatchMedia(2000);
        const result = render(<Component />);
        expect(result.container).toHaveTextContent('false');
    });

    test('hook should return true', () => {
        window.matchMedia = createMatchMedia(800);
        const result = render(<Component />);
        expect(result.container).toHaveTextContent('true');
    });
  
});