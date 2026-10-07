import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Book } from '../books/book.entity.js';
import { Reader } from '../readers/reader.entity.js';

@Entity()
export class BorrowedRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.borrowedRecords, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'book_id' })
  book: Relation<Book>;

  @ManyToOne(() => Reader, (reader) => reader.borrowedRecords, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'reader_id' })
  reader: Relation<Reader>;

  @Column({ type: 'datetime', name: 'borrowed_at' })
  borrowedAt: Date;

  @Column({ type: 'datetime', name: 'due_date' })
  dueDate: Date;

  @Column({ type: 'datetime', name: 'returned_at', nullable: true })
  returnedAt: Date | null;
}
