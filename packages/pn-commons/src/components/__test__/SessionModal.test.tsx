import { render } from "../../test-utils";
import SessionModal from "../SessionModal";
import * as hooks from "../../hooks/useIsMobile";

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

describe('test SessionModal component', () => {
    test('renders the component without confirm button', () => {
        const result = render(<SessionModal open title={'Test title'} message={'test message'}/>)

        expect(result.baseElement).toHaveTextContent(/test title/i)
        expect(result.baseElement).toHaveTextContent(/test message/i)
    });

    test('renders the full component with custom label', () => {
        const result = render(
            <SessionModal
                open
                title={'Test title'}
                message={'test message'}
                onConfirm={() => {}}
                onConfirmLabel={'Confirm'}
            />)

        expect(result.baseElement).toHaveTextContent(/test title/i)
        expect(result.baseElement).toHaveTextContent(/test message/i)
        expect(result.baseElement).toHaveTextContent(/confirm/i)
    });

    test('renders the full component with default label', () => {
        const result = render(
            <SessionModal
                open
                title={'Test title'}
                message={'test message'}
                onConfirm={() => {}}
            />)

        expect(result.baseElement).toHaveTextContent(/test title/i)
        expect(result.baseElement).toHaveTextContent(/test message/i)
        expect(result.baseElement).toHaveTextContent(/riprova/i)
    });

    test('renders the full component in mobile view', () => {
        useIsMobileSpy.mockReturnValue(true);
        const result = render(
            <SessionModal
                open
                title={'Test title'}
                message={'test message'}
                onConfirm={() => {}}
                onConfirmLabel={'Confirm'}
            />)

        expect(result.baseElement).toHaveTextContent(/test title/i)
        expect(result.baseElement).toHaveTextContent(/test message/i)
        expect(result.baseElement).toHaveTextContent(/confirm/i)
    });
});