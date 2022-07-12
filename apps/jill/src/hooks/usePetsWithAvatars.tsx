import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { IPetPreviewResDto } from '@pdoc/types';
import { useEffect, useState } from 'react';
import { useStorage } from 'reactfire';
import { getPetWithAvatar } from '../utils/factory.utils';
import { getPetPreviewAvatarBySpecies } from '../utils/formatter.utils';

export type PetPreviewWithAvatar = Omit<IPetPreviewResDto, 'avatar'> & {
  avatar: JSX.Element;
};

const size = 48;

// TODO: Move mapping logic to API Hook
const usePetsWithAvatar = (pets: IPetPreviewResDto[]) => {
  const [petsWithAvatars, setPetsWithAvatars] = useState<
    PetPreviewWithAvatar[]
  >(
    pets.map((p) => ({
      ...p,
      avatar: !p.avatar ? (
        getPetPreviewAvatarBySpecies(p.species, size)
      ) : (
        <Box height={size} width={size}>
          <CircularProgress size={size} />
        </Box>
      ),
    })) as PetPreviewWithAvatar[],
  );
  const storage = useStorage();

  useEffect(() => {
    const _petsWithAvatars: PetPreviewWithAvatar[] = [];
    const loadAvatars = async () => {
      for (let i = 0; i < pets.length; i++) {
        const pet = pets[i];

        const _petWithAvatar = (await getPetWithAvatar(
          pet,
          storage,
          size,
        )) as PetPreviewWithAvatar;
        _petsWithAvatars.push(_petWithAvatar);
      }
      setPetsWithAvatars(_petsWithAvatars);
    };
    loadAvatars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return petsWithAvatars;
};

export default usePetsWithAvatar;
