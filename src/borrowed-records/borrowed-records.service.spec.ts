import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Book } from '../books/book.entity.js';
import { Reader } from '../readers/reader.entity.js';
import { BorrowedRecord } from './borrowed-record.entity.js';
import { BorrowedRecordsService } from './borrowed-records.service.js';

describe('BorrowedRecordsService', () => {
  let service: BorrowedRecordsService;
  let recordsRepository: {
    create: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let booksRepository: { findOneBy: ReturnType<typeof vi.fn> };
  let readersRepository: { findOneBy: ReturnType<typeof vi.fn> };
  const book = {
    id: 1,
    title: 'Clean Code',
    author: 'Robert C. Martin',
  } as Book;
  const reader = {
    id: 1,
    name: 'Nguyen Van An',
    email: 'an@example.com',
  } as Reader;

  beforeEach(async () => {
    recordsRepository = {
      create: vi.fn((record) => record),
      save: vi.fn(async (record) => record),
      find: vi.fn(),
    };
    booksRepository = { findOneBy: vi.fn().mockResolvedValue(book) };
    readersRepository = { findOneBy: vi.fn().mockResolvedValue(reader) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowedRecordsService,
        {
          provide: getRepositoryToken(BorrowedRecord),
          useValue: recordsRepository,
        },
        { provide: getRepositoryToken(Book), useValue: booksRepository },
        { provide: getRepositoryToken(Reader), useValue: readersRepository },
      ],
    }).compile();

    service = module.get(BorrowedRecordsService);
  });

  it('creates a loan with the requested book, reader, and a 14-day due date', async () => {
    const before = Date.now();
    const result = await service.create({ bookId: 1, readerId: 1 });
    const after = Date.now();

    expect(recordsRepository.save).toHaveBeenCalledOnce();
    expect(result.book).toBe(book);
    expect(result.reader).toBe(reader);
    expect(result.borrowedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.borrowedAt.getTime()).toBeLessThanOrEqual(after);
    expect(result.dueDate.getTime() - result.borrowedAt.getTime()).toBe(
      14 * 24 * 60 * 60 * 1000,
    );
  });

  it('rejects a loan when the book does not exist', async () => {
    booksRepository.findOneBy.mockResolvedValue(null);

    await expect(service.create({ bookId: 99, readerId: 1 })).rejects.toThrow(
      'Book 99 was not found',
    );
    expect(recordsRepository.save).not.toHaveBeenCalled();
  });

  it('rejects a due date that is not in the future', async () => {
    await expect(
      service.create({
        bookId: 1,
        readerId: 1,
        dueDate: '2000-01-01T00:00:00.000Z',
      }),
    ).rejects.toThrow('dueDate must be a valid future date');
    expect(recordsRepository.save).not.toHaveBeenCalled();
  });

  it('lists borrowed records with their book and reader relations', async () => {
    recordsRepository.find.mockResolvedValue([]);

    await service.findAll();

    expect(recordsRepository.find).toHaveBeenCalledWith({
      relations: { book: true, reader: true },
      order: { borrowedAt: 'DESC' },
    });
  });
});
