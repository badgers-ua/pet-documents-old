import create, { SetState } from 'zustand';
import { devtools } from 'zustand/middleware';
import { isLoading, NODE_ENV } from '../../../types';

export type LoaderState = {
  setIsLoading: (isLoading: boolean) => void;
} & isLoading;

const state = (set: SetState<LoaderState>): LoaderState => {
  return {
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  };
};

const devToolsState: any = devtools(state);

const createLoaderStore = () =>
  create<LoaderState>(
    process.env.NODE_ENV === NODE_ENV.DEV ? devToolsState : state,
  );

export default createLoaderStore;
