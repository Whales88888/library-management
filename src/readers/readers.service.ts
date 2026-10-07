import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reader } from './reader.entity.js';
import { CreateReaderDto } from './readers.dto.js';

@Injectable()
export class ReadersService {
  constructor(
    @InjectRepository(Reader)
    private readonly readersRepository: Repository<Reader>,
  ) {}

  create(input: CreateReaderDto): Promise<Reader> {
    if (!input || typeof input !== 'object') {
      throw new BadRequestException('A reader payload is required');
    }

    if (
      typeof input.name !== 'string' ||
      typeof input.email !== 'string' ||
      (input.phone !== undefined && typeof input.phone !== 'string')
    ) {
      throw new BadRequestException('name and email must be strings');
    }

    const name = input.name.trim();
    const email = input.email.trim();
    const phone = input.phone?.trim();
    if (!name || !email.includes('@')) {
      throw new BadRequestException('A valid name and email are required');
    }

    return this.readersRepository.save(
      this.readersRepository.create({
        name,
        email,
        phone: phone || null,
      }),
    );
  }

  findAll(): Promise<Reader[]> {
    return this.readersRepository.find({ order: { id: 'ASC' } });
  }
}
