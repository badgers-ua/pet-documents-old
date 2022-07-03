import { IsBoolean, IsOptional } from 'class-validator';
import { PetReqDto } from './pet-req.dto';
import { Transform } from 'class-transformer';
import { booleanTransformFormatter } from '../../utils/formatter.utils';

export class EditPetReqDto extends PetReqDto {
  @Transform(booleanTransformFormatter)
  @IsBoolean()
  @IsOptional()
  readonly isAvatarChanged?: boolean;
}
