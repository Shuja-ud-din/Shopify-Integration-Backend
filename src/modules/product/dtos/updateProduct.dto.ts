import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

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

  @IsOptional()
  @IsNumber()
  @Min(0)
  fallbackInventoryQuantity?: number;

  @IsOptional()
  @IsMongoId()
  comparePriceFormula?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;
}
