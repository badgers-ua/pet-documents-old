import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { IPetResDto } from '@pdoc/types';
import { useEffect, useState } from 'react';
import { useStorage } from 'reactfire';
import { getPetWithAvatar } from '../utils/factory.utils';

export type PetWithAvatar = Omit<IPetResDto, 'avatar'> & {
  avatar: JSX.Element;
};

const size = 96;

// TODO: Move mapping logic to API Hook
const usePetWithAvatar = (pet: IPetResDto | undefined) => {
  const [petWithAvatar, setPetWithAvatar] = useState<PetWithAvatar>({
    ...pet,
    avatar: (
      <Box height={size} width={size}>
        <CircularProgress size={size} />
      </Box>
    ),
  } as PetWithAvatar);
  const storage = useStorage();

  useEffect(() => {
    if (!pet) {
      return;
    }
    const loadAvatar = async () => {
      const _petWithAvatar = (await getPetWithAvatar(
        pet,
        storage,
        size,
      )) as PetWithAvatar;
      setPetWithAvatar(_petWithAvatar);
    };
    loadAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet]);

  return petWithAvatar;
};

export default usePetWithAvatar;
