import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Book } from './books/book.entity.js';
import { BooksModule } from './books/books.module.js';
import { BorrowedRecord } from './borrowed-records/borrowed-record.entity.js';
import { BorrowedRecordsModule } from './borrowed-records/borrowed-records.module.js';
import { Reader } from './readers/reader.entity.js';
import { ReadersModule } from './readers/readers.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const port = Number(config.get<string>('DB_PORT', '3306'));
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new Error('DB_PORT must be an integer between 1 and 65535');
        }

        const ca = config.get<string>('DB_SSL_CA');
        return {
          type: 'mysql' as const,
          host: config.get<string>('DB_HOST', '127.0.0.1'),
          port,
          username: config.get<string>('DB_USERNAME', 'root'),
          password: config.get<string>('DB_PASSWORD', ''),
          database: config.get<string>('DB_DATABASE', 'library_management'),
          entities: [Book, Reader, BorrowedRecord],
          synchronize: config.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
          ssl:
            config.get<string>('DB_SSL', 'false') === 'true'
              ? { rejectUnauthorized: true, ...(ca ? { ca } : {}) }
              : undefined,
        };
      },
    }),
    BooksModule,
    ReadersModule,
    BorrowedRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
