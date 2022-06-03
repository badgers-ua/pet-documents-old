import create, { SetState } from 'zustand';
import { NODE_ENV } from '../../../types';
import { devtools } from 'zustand/middleware';

export type ActivePetProfileTabState = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
};
const state = (
  set: SetState<ActivePetProfileTabState>,
): ActivePetProfileTabState => {
  return {
    activeTab: 0,
    setActiveTab: (activeTab: number) => set({ activeTab }),
  };
};

const devToolsState: any = devtools(state);

export const createActivePetProfileTabStore = () =>
  create<ActivePetProfileTabState>(
    process.env.NODE_ENV === NODE_ENV.DEV ? devToolsState : state,
  );

export default createActivePetProfileTabStore;
