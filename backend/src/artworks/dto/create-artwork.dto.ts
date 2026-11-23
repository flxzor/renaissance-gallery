import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsInt,
  Min,
  Max,
  IsIn,
  IsUrl,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateArtworkDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  artist: string;

  @IsInt()
  @Min(1200)
  @Max(2100)
  year: number;

  @IsIn([
    'Renaissance Awal',
    'Renaissance Tinggi',
    'Manierisme',
    'Renaissance Utara',
  ])
  period: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  description: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsBoolean()
  isMasterpiece?: boolean;
}
