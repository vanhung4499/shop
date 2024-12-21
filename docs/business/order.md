# Order

## Giới thiệu

- Quản lý thông tin đơn hàng của khách hàng.
- Thực hiện các thao tác đặt hàng, xác nhận đơn hàng, hủy đơn hàng, vận chuyển, thanh toán, hoàn trả.

## Mục đích thực hiện

- Cover lại toàn bộ quy trình đặt hàng giống như một hệ thống thực tế như Shopee, Lazada.
- Xây dựng một hệ thống đặt hàng đây đủ chức năng.
- Tìm hiểu về các công nghệ liên quan như RabbitMQ để xử lý theo hướng event-driven.
- Tăng hiệu suất xử lý cho hệ thống.

## Technologies

- MongoDB
- RabbitMQ
- NodeJS

## Order Workflow

1. **Đặt hàng**
    - Gửi API request đến server với thông tin đơn hàng.
    - Kiểm tra thông tin sản phẩm và khoá một số lượng sản phẩm trong kho.
    - Tạo một order mới trong database với trạng thái `PENDING` (chờ thanh toán).
    - Đồng thời gửi một delay message vào RabbitMQ để xử lý hết hạn thanh toán ví dụ sau 15 phút.
        - Nếu không thanh toán, hủy đơn hàng và giải phóng số lượng sản phẩm trong kho.
2. **Thanh toán**
    - Khi khách hàng thanh toán, gửi API request đến server với thông tin thanh toán.
    - Gọi một API tới hệ thống thanh toán để thực hiện thanh toán.
    - Xử lý trạng thái theo kết quả thanh toán
        - Thành công: Cập nhật trạng thái đơn hàng thành `PAID` và giảm số lượng sản phẩm trong kho.
        - Thất bại: Cập nhật trạng thái đơn hàng thành `CANCELLED` và giải phóng số lượng sản phẩm bị khoá trong kho.
3. **Huỷ**
    - Gửi API request đến server với thông tin hủy đơn hàng.
    - Nếu đơn hàng chưa được vận chuyển, có thể hủy đơn hàng:
        - Nếu đơn hàng chưa thanh toán, giải phóng số lượng sản phẩm bị khoá trong kho.
        - Nếu đơn hàng đã thanh toán, gọi api hoàn tiền và cập nhật trạng thái đơn hàng thành `REFUNDED` đồng thời hoàn
          trả số lượng sản phẩm trong kho.

4. **Trả hàng**
    - Gửi API request đến server với thông tin trả hàng.
    - Gọi API tới hệ thống thanh toán để hoàn tiền cho khách hàng.
    - Cập nhật trạng thái đơn hàng thành `RETURNED` và hoàn trả số lượng sản phẩm trong kho.

> Hiện tại hệ thống đang bỏ qua phần giao hàng, vận chuyển.

## Tiến độ

- Đã hoàn thành phần đặt hàng, thanh toán, huỷ đơn hàng.
- Đang tiếp tục phát triển phần trả hàng.
- Chưa phát triển hệ thống thanh toán phụ nên đang trả về kết quả mô phỏng khi pay order.