import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { BorrowedRecord } from '../borrowed-records/borrowed-record.entity.js';

@Entity()
export class Reader {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @OneToMany(() => BorrowedRecord, (record) => record.reader)
  borrowedRecords: Relation<BorrowedRecord[]>;
}
