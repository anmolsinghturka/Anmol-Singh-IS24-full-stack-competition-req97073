/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { UserDto } from 'src/dto/users.dto';
import { UsersService } from './users.service';
import { ApiProperty } from '@nestjs/swagger';

@Controller('product')
export class UsersController {
    constructor(private readonly service: UsersService) { }

    @Post()
    Add(@Body() body: UserDto) {
        return this.service.Add(body);
    }

    @Get()
    FindAll() {
        return this.service.FindAll();
    }

    @Get('/:productId')
    FindOne(@Param('productId') productId: string) {
        return this.service.FindOne(productId);
    }

    @Put('/:id')
    Update(@Param('id') id: string, @Body() body: UserDto) {
        return this.service.Update(id, body);
    }

    @Delete('/:productId')
    Delete(@Param('productId') productId: string) {
        return this.service.Delete(productId);
    }

    @Get('/monogoid/:id')
    FindMongoOne(@Param('id') id: string) {
        return this.service.FindMongoOne(id);
    }

    @Post('/searchscrummaster')
    Search(@Query('key') key: string) {
        return this.service.SearchScrumMaster(key);
    }

    @Post('/searchdeveloper')
    searchDeveloper(@Query('name') name: string) {
        return this.service.searchDeveloper(name);
    }

    @Post('GenerateRandomProducts')
    GenerateRandomProducts() {
        return this.service.GenerateRandomProducts();
    }
}
