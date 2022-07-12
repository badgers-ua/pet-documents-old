import { CircularProgress } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { SPECIES } from '@pdoc/types';
import { getPetPreviewAvatarBySpecies } from '../utils/formatter.utils';

type PetAvatarProps = {
  url?: string;
  isLoading: boolean;
  size: number;
  species: SPECIES;
};

const PetAvatar = ({ url, isLoading, species, size = 48 }: PetAvatarProps) => {
  if (isLoading) {
    return (
      <Box
        width={size}
        height={size}
        minWidth={size}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress size={size} />
      </Box>
    );
  }

  return url ? (
    <Avatar src={url} sx={{ width: size + 'px', height: size + 'px' }} />
  ) : (
    getPetPreviewAvatarBySpecies(species, size)
  );
};

export default PetAvatar;