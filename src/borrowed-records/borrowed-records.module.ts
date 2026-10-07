import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../books/book.entity.js';
import { Reader } from '../readers/reader.entity.js';
import { BorrowedRecord } from './borrowed-record.entity.js';
import { BorrowedRecordsController } from './borrowed-records.controller.js';
import { BorrowedRecordsService } from './borrowed-records.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowedRecord, Book, Reader])],
  controllers: [BorrowedRecordsController],
  providers: [BorrowedRecordsService],
})
export class BorrowedRecordsModule {}
