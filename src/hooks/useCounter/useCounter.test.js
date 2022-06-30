import { renderHook, act } from '@testing-library/react-hooks';
import useCounter from './useCounter';

describe('useCounter', () => {

    test(`Check default count's value is 0`, () => {
        const { result } = renderHook(() => useCounter());

        expect(result.current.count).toBe(0);
    });

    test(`Check add will correct change count's value`, () => {
        const { result } = renderHook(() => useCounter());

        act(() => { result.current.add(3); });

        expect(result.current.count).toBe(3);
    });

    test(`Check callBack will trigger after add executed`, () => {
        const callBack = jest.fn();
        const { result } = renderHook(() => useCounter(0, callBack));

        act(() => { result.current.add(); });

        expect(callBack.mock.calls.length).toBe(2);
    });
});
