1.

- @Public() là một decorator được sử dụng để đánh dấu các route là "công khai", nghĩa là không cần xác thực (bỏ qua guard xác thực). Thường thì bạn sẽ có những route mà không yêu cầu phải có JWT token hoặc xác thực, ví dụ như trang đăng nhập.

2. Cách hoạt động:

- @Public() sẽ gắn metadata cho các route được đánh dấu, giúp xác định rằng những route đó không cần guard xác thực.
- Sau đó, trong guard xác thực (ví dụ: JwtAuthGuard), bạn có thể kiểm tra metadata này và quyết định có bỏ qua guard không.
