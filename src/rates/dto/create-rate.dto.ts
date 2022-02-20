import { IsNotEmpty } from 'class-validator';
export class CreateRateDto {
  @IsNotEmpty()
  ves: string;

  @IsNotEmpty()
  cop: string;
}
