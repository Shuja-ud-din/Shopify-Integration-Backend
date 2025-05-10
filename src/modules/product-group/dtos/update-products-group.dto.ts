import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductsGroupProductsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one product must be provided.' })
  @IsNotEmpty()
  @IsString({ each: true })
  products: string[];
}
