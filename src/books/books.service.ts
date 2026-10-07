import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity.js';
import { CreateBookDto } from './books.dto.js';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  create(input: CreateBookDto): Promise<Book> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('A book payload is required');
    }

    if (
      typeof input.title !== 'string' ||
      typeof input.author !== 'string' ||
      (input.isbn !== undefined && typeof input.isbn !== 'string')
    ) {
      throw new BadRequestException('title and author must be strings');
    }

    const title = input.title.trim();
    const author = input.author.trim();
    const isbn = input.isbn?.trim();
    if (!title || !author) {
      throw new BadRequestException('title and author are required');
    }

    return this.booksRepository.save(
      this.booksRepository.create({
        title,
        author,
        isbn: isbn || null,
      }),
    );
  }

  findAll(): Promise<Book[]> {
    return this.booksRepository.find({ order: { id: 'ASC' } });
  }
}
