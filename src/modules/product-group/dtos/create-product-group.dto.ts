import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { EndScheduleOn, RepeatUnit } from 'src/common/enums/schedule.enum';

class EndScheduleDto {
  @IsEnum(EndScheduleOn)
  on: EndScheduleOn;

  @ValidateIf((o) => o.endOn === EndScheduleOn.COUNT)
  @IsInt()
  @Min(1)
  value?: number;
}

class RepeatDto {
  @IsInt()
  @Min(1)
  every: number;

  @IsEnum(RepeatUnit)
  unit: RepeatUnit;
}

export class ScheduleDto {
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  timezone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => RepeatDto)
  repeat?: RepeatDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EndScheduleDto)
  end?: EndScheduleDto;
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto;
}
