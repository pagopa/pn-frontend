import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import { useSafeDispatch } from '@pagopa-pn/pn-commons';

import type { AppDispatch, RootState } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useSafeAppDispatch = () => useSafeDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
