import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { useTracking } from '../useTracking'; // Import your hook

let container;

beforeEach(() => {
    // Set up a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // Clean up on exiting
    unmountComponentAtNode(container);
    container.remove();
});

// Mock the global OneTrust object
global.OneTrust = {
    OnConsentChanged: jest.fn(),
};

// Mock the mixpanelInit function
jest.mock('../../utils/mixpanel.utility', () => ({
    mixpanelInit: jest.fn(),
}));

describe('useTracking', () => {
    it('should initialize Mixpanel when OneTrust consent is granted', () => {
        const mixpanelToken = 'your-mixpanel-token';
        const nodeEnv = 'development';

        act(() => {
            render(<TestComponent mixpanelToken={mixpanelToken} nodeEnv={nodeEnv} />, container);
        });

        // Simulate OneTrust consent change
        act(() => {
            global.OptanonWrapper();
        });

        expect(global.OneTrust.OnConsentChanged).toHaveBeenCalled();
        expect(require('../utils/mixpanel.utility').mixpanelInit).toHaveBeenCalledWith(mixpanelToken, nodeEnv);
    });

    it('should initialize Mixpanel when the Optanon cookie is present', () => {
        // Mock the document.cookie value to include the OptanonConsent cookie
        Object.defineProperty(document, 'cookie', {
            value: 'OptanonConsent=C0002%3A1; path=/',
            writable: true,
        });

        const mixpanelToken = 'your-mixpanel-token';
        const nodeEnv = 'development';

        act(() => {
            render(<TestComponent mixpanelToken={mixpanelToken} nodeEnv={nodeEnv} />, container);
        });

        expect(global.OneTrust.OnConsentChanged).not.toHaveBeenCalled();
        expect(require('../utils/mixpanel.utility').mixpanelInit).toHaveBeenCalledWith(mixpanelToken, nodeEnv);
    });
});

function TestComponent({ mixpanelToken, nodeEnv }) {
    useTracking(mixpanelToken, nodeEnv);
    return <div />;
}
