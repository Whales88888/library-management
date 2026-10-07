import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BorrowedRecord } from '../borrowed-records/borrowed-record.entity.js';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  isbn: string | null;

  @OneToMany(() => BorrowedRecord, (record) => record.book)
  borrowedRecords: Relation<BorrowedRecord[]>;
}
