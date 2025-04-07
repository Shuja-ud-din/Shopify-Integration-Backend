import { IsArray, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateProductGroupDto {
  @MinLength(3)
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @MinLength(3)
  formula: string;
}
