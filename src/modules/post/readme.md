## Object.assign(post, updatePostDto)

- Cách hoạt động:
  Object.assign(post, updatePostDto) sao chép tất cả các thuộc tính từ updatePostDto vào đối tượng post hiện có, và sau đó bạn lưu đối tượng post với các thuộc tính đã được cập nhật.
  Phương pháp này giúp bạn tùy chỉnh các thuộc tính của đối tượng post sau khi đã tải nó từ cơ sở dữ liệu, mà không thay đổi cách bạn xử lý các thuộc tính mới. Sau đó, bạn có thể kiểm tra các điều kiện trước khi lưu đối tượng lại.

- Lý do sử dụng:
  Nếu bạn muốn linh hoạt trong việc cập nhật đối tượng, đồng thời có thể thêm các logic kiểm tra hoặc điều chỉnh trước khi lưu vào cơ sở dữ liệu (ví dụ: kiểm tra xem bài viết có bị xóa mềm hay không).
  Nó cho phép bạn xử lý và cập nhật các thuộc tính có sẵn từ updatePostDto, mà không cần phải sử dụng phương thức khác như preload (phương thức này có thể không đủ để xử lý những tình huống phức tạp hơn như các logic kiểm tra bổ sung).

## preload (như trong async update(updateUserDto: UpdateUserDto))

- Cách hoạt động:
  preload là một phương thức của TypeORM, giúp bạn tải đối tượng từ cơ sở dữ liệu và tự động gán giá trị của các thuộc tính từ DTO (Data Transfer Object) vào đối tượng đã tải về.
  Đây là một cách tự động để làm mới đối tượng trong cơ sở dữ liệu với các giá trị từ DTO, mà không cần phải gọi save trực tiếp.
- Lý do sử dụng:
  Phương thức preload rất hữu ích khi bạn muốn cập nhật đối tượng từ cơ sở dữ liệu với các dữ liệu đã được xác nhận, mà không cần phải lo lắng về việc thực hiện các bước thủ công như Object.assign.
  Thích hợp khi bạn muốn chỉ cập nhật một số trường và không có logic kiểm tra phức tạp hoặc các điều kiện cần xử lý trước khi lưu đối tượng.

## Tóm lại

1. preload: Dùng để tự động cập nhật đối tượng từ DTO mà không cần phải xử lý thủ công các thuộc tính. Tuy nhiên, bạn không thể thực hiện các logic kiểm tra phức tạp trước khi cập nhật.
2. Object.assign: Cho phép bạn linh hoạt hơn trong việc xử lý các thuộc tính và thực hiện các logic kiểm tra trước khi cập nhật đối tượng.
