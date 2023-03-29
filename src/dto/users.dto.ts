/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
    @ApiProperty({
        description: 'Product Id',
        example: '4353'
    })
    productId: string;

    @ApiProperty({
        description: 'Full name',
        example: 'Management System'
    })
    @IsNotEmpty()
    productName: string;

    @ApiProperty({
        description: 'Product Owner Name',
        example: 'Owner'
    })
    @IsNotEmpty()
    productOwnerName: string;

    @ApiProperty({
        description: 'Date',
        example: ['Dev 1', 'Dev 2']
    })
    @IsNotEmpty()
    developers: string[];

    @ApiProperty({
        description: 'Date',
        example: 'Scrum Master'
    })
    @IsNotEmpty()
    scrumMasterName: string;

    @ApiProperty({
        description: 'Date',
        example: '2000-03-13'
    })
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({
        description: '',
        example: 'Agile'
    })
    @IsNotEmpty()
    methodology: string;
}
