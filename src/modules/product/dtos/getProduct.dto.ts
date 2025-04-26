import { IsString, MinLength } from 'class-validator';

export class GetProductDto {
  @IsString()
  @MinLength(3)
  id: string;
}
