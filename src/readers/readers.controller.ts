import { Body, Controller, Get, Post } from '@nestjs/common';
import { Reader } from './reader.entity.js';
import type { CreateReaderDto } from './readers.dto.js';
import { ReadersService } from './readers.service.js';

@Controller('readers')
export class ReadersController {
  constructor(private readonly readersService: ReadersService) {}

  @Post()
  create(@Body() input: CreateReaderDto): Promise<Reader> {
    return this.readersService.create(input);
  }

  @Get()
  findAll(): Promise<Reader[]> {
    return this.readersService.findAll();
  }
}
