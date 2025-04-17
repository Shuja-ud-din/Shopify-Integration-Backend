import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFormulaDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  formula: string;

  @IsMongoId()
  @IsNotEmpty()
  store: string;
}
