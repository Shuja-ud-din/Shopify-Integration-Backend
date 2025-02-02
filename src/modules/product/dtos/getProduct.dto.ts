import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class GetProductDto {
  @IsString()
  @MinLength(3)
  id: string;
}

export class UpdateProductUrlsDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  urls: string[];
}
