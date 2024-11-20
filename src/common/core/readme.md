## Interceptor trong NestJS là một lớp (class) có thể can thiệp vào luồng xử lý của request và response. Chúng được sử dụng để thực hiện các tác vụ như:

    Chỉnh sửa dữ liệu trả về.
    Đo thời gian xử lý.
    Ghi log.
    Thêm các dữ liệu bổ sung vào response.

## TransformInterceptor là một loại interceptor giúp chuẩn hóa dữ liệu phản hồi từ server trước khi gửi về client.

Khi client gửi request, nó đi qua tất cả các middlewares, guards, pipes, và cuối cùng đến controller hoặc route handler.
Dữ liệu trả về từ route handler tiếp tục đi qua interceptor, lúc này TransformInterceptor sẽ xử lý dữ liệu, chuẩn hóa lại cấu trúc, thêm các thông tin bổ sung (như statusCode, message), và cuối cùng gửi trả client.

## Thành phần chính của TransformInterceptor:

- Reflector:
  Reflector được sử dụng để lấy metadata (dữ liệu bổ sung được gắn trên route handler hoặc controller). Trong trường hợp này, nó được dùng để lấy thông tin về message từ metadata gắn bởi decorator @ResponseMessage.

- statusCode:
  Là mã trạng thái HTTP, ví dụ 200 cho thành công, 400 cho lỗi yêu cầu, hoặc 500 cho lỗi server. Interceptor lấy thông tin này từ phản hồi của server.

- message:
  Là thông báo tùy chỉnh được định nghĩa cho từng route thông qua metadata. Nếu không có thông báo nào được định nghĩa, nó sẽ trả về một chuỗi rỗng.

- data:
  Là dữ liệu thực tế được trả về từ route handler, chẳng hạn như danh sách người dùng, thông tin chi tiết của một mục, hoặc trạng thái của một thao tác.
