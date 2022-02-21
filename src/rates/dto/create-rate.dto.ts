import { IsNotEmpty } from 'class-validator';
export class CreateRateDto {
  @IsNotEmpty()
  ves: number;

  @IsNotEmpty()
  cop: number;
}
