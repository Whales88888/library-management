import { Body, Controller, Get, Post } from '@nestjs/common';
import { Book } from './book.entity.js';
import type { CreateBookDto } from './books.dto.js';
import { BooksService } from './books.service.js';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() input: CreateBookDto): Promise<Book> {
    return this.booksService.create(input);
  }

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }
}
