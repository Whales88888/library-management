# Ứng dụng quản lý thư viện

Ứng dụng REST API xây dựng bằng NestJS, TypeORM và MySQL. Ứng dụng quản lý sách, độc giả và các lượt mượn sách; mỗi lượt mượn mặc định có hạn trả sau 14 ngày.

## Yêu cầu

- Node.js 20 trở lên
- MySQL 8 trở lên (cài local hoặc dùng dịch vụ như Aiven)

## Cài đặt và chạy

1. Tạo cơ sở dữ liệu:

   ```sql
   CREATE DATABASE library_management
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```

2. Sao chép `.env.example` thành `.env`, rồi cập nhật thông tin kết nối MySQL.
3. Cài dependencies và chạy ứng dụng:

   ```bash
   npm install
   npm run start:dev
   ```

Mặc định API chạy tại `http://localhost:3000`. `DB_SYNCHRONIZE=true` giúp TypeORM tự tạo/cập nhật bảng khi chạy bài tập; hãy tắt tùy chọn này và dùng migrations khi triển khai production. Với MySQL có TLS, đặt `DB_SSL=true`; nếu nhà cung cấp yêu cầu CA riêng, cung cấp nội dung chứng chỉ trong `DB_SSL_CA`.

## Cấu trúc thư mục

```text
src/
├── books/             # Entity, DTO, Service, Controller, Module của sách
├── readers/           # Entity, DTO, Service, Controller, Module của độc giả
├── borrowed-records/  # Entity, DTO, Service, Controller, Module của lượt mượn
├── app.module.ts      # Cấu hình kết nối DB và đăng ký các module
└── main.ts            # Khởi động ứng dụng NestJS
```

## API

### Tạo sách

`POST /books`

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884"
}
```

`GET /books` liệt kê sách.

### Tạo độc giả

`POST /readers`

```json
{
  "name": "Nguyen Van An",
  "email": "an@example.com",
  "phone": "0900000000"
}
```

`GET /readers` liệt kê độc giả.

### Mượn sách

`POST /borrowed-records` lưu lượt mượn vào `BorrowedRecord`. `bookId` và `readerId` phải trỏ tới dữ liệu đã tồn tại. Có thể truyền `dueDate` theo ISO 8601; nếu bỏ qua, hạn trả được đặt sau ngày mượn 14 ngày.

```json
{
  "bookId": 1,
  "readerId": 1,
  "dueDate": "2026-10-21T16:00:00.000Z"
}
```

### Danh sách các lượt mượn

`GET /borrowed-records` trả về các lượt mượn cùng thông tin sách, độc giả, ngày mượn và hạn trả.

## Kiểm tra

```bash
npm test
npm run build
```

## Chụp ảnh minh chứng

Khởi động ứng dụng khi MySQL đang chạy, mở `http://localhost:3000` để chụp màn hình ứng dụng, sau đó dùng Postman hoặc curl để gọi `POST /books`, `POST /readers`, `POST /borrowed-records` và `GET /borrowed-records`. Chụp lại request và response thành công để đính kèm bài nộp.
