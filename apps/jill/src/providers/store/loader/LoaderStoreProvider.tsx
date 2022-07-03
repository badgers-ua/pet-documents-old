import React from 'react';
import createContext from 'zustand/context';
import createLoaderStore, { LoaderState } from './createLoaderStore';
import { Children } from '../../../types';
import { StoreApi } from 'zustand';

const Context = createContext<StoreApi<LoaderState>>();

const createStore = () => createLoaderStore();

const LoaderStoreProvider = ({ children }: Children) => {
  return (
    <Context.Provider createStore={createStore}>{children}</Context.Provider>
  );
};

export const useLoaderStore = Context.useStore;
export default LoaderStoreProvider;
