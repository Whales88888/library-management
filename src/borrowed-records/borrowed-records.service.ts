import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../books/book.entity.js';
import { Reader } from '../readers/reader.entity.js';
import { BorrowedRecord } from './borrowed-record.entity.js';
import { CreateBorrowedRecordDto } from './borrowed-records.dto.js';

const DEFAULT_LOAN_DAYS = 14;

@Injectable()
export class BorrowedRecordsService {
  constructor(
    @InjectRepository(BorrowedRecord)
    private readonly recordsRepository: Repository<BorrowedRecord>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    @InjectRepository(Reader)
    private readonly readersRepository: Repository<Reader>,
  ) {}

  async create(input: CreateBorrowedRecordDto): Promise<BorrowedRecord> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('A borrowing payload is required');
    }
    if (
      !Number.isSafeInteger(input.bookId) ||
      input.bookId < 1 ||
      !Number.isSafeInteger(input.readerId) ||
      input.readerId < 1
    ) {
      throw new BadRequestException(
        'bookId and readerId must be positive integers',
      );
    }

    const [book, reader] = await Promise.all([
      this.booksRepository.findOneBy({ id: input.bookId }),
      this.readersRepository.findOneBy({ id: input.readerId }),
    ]);

    if (!book) {
      throw new NotFoundException(`Book ${input.bookId} was not found`);
    }
    if (!reader) {
      throw new NotFoundException(`Reader ${input.readerId} was not found`);
    }

    const borrowedAt = new Date();
    if (input.dueDate !== undefined && typeof input.dueDate !== 'string') {
      throw new BadRequestException('dueDate must be an ISO date string');
    }

    const dueDate = input.dueDate
      ? new Date(input.dueDate)
      : new Date(
          borrowedAt.getTime() + DEFAULT_LOAN_DAYS * 24 * 60 * 60 * 1000,
        );

    if (Number.isNaN(dueDate.getTime()) || dueDate <= borrowedAt) {
      throw new BadRequestException('dueDate must be a valid future date');
    }

    const record = this.recordsRepository.create({
      book,
      reader,
      borrowedAt,
      dueDate,
      returnedAt: null,
    });

    return this.recordsRepository.save(record);
  }

  findAll(): Promise<BorrowedRecord[]> {
    return this.recordsRepository.find({
      relations: { book: true, reader: true },
      order: { borrowedAt: 'DESC' },
    });
  }
}
