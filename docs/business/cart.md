# Cart Operations

## Giới thiệu

Sử dụng Redis + MongoDB để lưu trữ thông tin giỏ hàng của khách hàng.

- Redis sử dụng để lưu trữ tạm thời thông tin giỏ, vì nó nhanh và dễ sử dụng.
- MongoDB sử dụng để lưu trữ thông tin giỏ hàng của.

## Mục đích thực hiện

- Tìm hiểu về Redis và ứng dụng
- Tăng hiệu suất xử lý cho hệ thống

## Chiến lược

### Mô tả

- Sử dụng Redis để lưu trữ và truy xuất nhanh thông tin giỏ hàng của khách hàng.
- Vào mỗi cuối ngày hay nửa đêm, dữ liệu cart sẽ được đồng bộ vào MongoDB để lưu trữ vĩnh viễn.
- Xem xét các giỏ hàng đã lâu không được truy cập để xoá khỏi Redis. (Nếu cần)

### Vấn đề cần giải quyết

Với cách trên, databse sẽ được giảm tải và hiệu suất xử lý sẽ tăng lên, nhưng vấn đề sự nhất quán dữ liệu giữa Redis và MongoDB cần được xem xét.
Sẽ có nhiều trường hợp dữ liệu bị mất hoặc không đồng bộ giữa 2 hệ thống.

Vì mục tiêu chỉ là làm một hệ thống đơn giản nên việc đồng bộ dữ liệu hằng ngày là có thể chấp nhận được.
Nếu không sẽ cần phải xem xét các giải pháp khác để đảm bảo sự nhất quán dữ liệu.

## Cấu trúc lưu trữ

### Redis

Lưu trữ thông tin cart items theo key `:{userId}`, value là Hash chứa thông tin chi tiết của cart item. 

### MongoDB
Lưu trữ thông tin chi tiết của cart bao gồm userId, cart items, và các thông tin khác.

> Hash là một cấu trúc dữ liệu trong redis, nó cho phép lưu trữ nhiều cặp key-value giống như Hashmap trong Java hay Map trong Javascript.

## Cách thức hoạt động

- Các truy vấn đọc và ghi thông tin giỏ hàng sẽ được thực hiện trên Redis để đảm bảo hiệu suất cao (đặc biệt là các thao tác add to cart).
  - Sử dụng các thao tác hGet, hSet, hDel để thao tác với Hash trong Redis.
  - Sử dụng các thao tác incr, decr để thao tác với số lượng cart item.
- Sử dụng một job executor để đồng bộ dữ liệu giỏ hàng từ Redis vào MongoDB theo chu kỳ.
    - Sử dụng node-crone để thực hiện job này.
    - Thực thi job này vào cuối ngày hoặc nửa đêm để giảm tải cho hệ thống. vì nửa đêm ít người dùng truy cập.

## Triển khai

Vui lòng xem chi tiết trong cart service.

## Tham khảo

- [Redis](https://redis.io/)
- [MongoDB](https://www.mongodb.com/)