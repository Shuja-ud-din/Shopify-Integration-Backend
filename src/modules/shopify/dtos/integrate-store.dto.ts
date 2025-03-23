import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class IntegrateStoreDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
