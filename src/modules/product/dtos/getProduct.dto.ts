import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class GetProductDto {
  @IsString()
  @MinLength(3)
  id: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  urls?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  profitMargin?: number;
}
