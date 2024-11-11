import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, {
    message: 'Name should be between 5 and 255 characters long.',
  })
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)
  address: string;
}
