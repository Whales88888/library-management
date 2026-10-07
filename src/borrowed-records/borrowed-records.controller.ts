import { Body, Controller, Get, Post } from '@nestjs/common';
import { BorrowedRecord } from './borrowed-record.entity.js';
import type { CreateBorrowedRecordDto } from './borrowed-records.dto.js';
import { BorrowedRecordsService } from './borrowed-records.service.js';

@Controller('borrowed-records')
export class BorrowedRecordsController {
  constructor(
    private readonly borrowedRecordsService: BorrowedRecordsService,
  ) {}

  @Post()
  create(@Body() input: CreateBorrowedRecordDto): Promise<BorrowedRecord> {
    return this.borrowedRecordsService.create(input);
  }

  @Get()
  findAll(): Promise<BorrowedRecord[]> {
    return this.borrowedRecordsService.findAll();
  }
}
