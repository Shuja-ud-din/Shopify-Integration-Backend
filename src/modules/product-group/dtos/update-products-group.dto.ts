import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProductsGroupProductsDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  products: string[];
}
