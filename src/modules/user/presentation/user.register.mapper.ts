import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
	@ApiProperty({
		example: 'test@test.com',
	})
	email: string;

	@ApiProperty({
		example: 'Test',
	})
	name: string;

	@ApiProperty({
		example: '123456Password',
	})
	password: string;
}
