1. Quản lý Refresh Token:

- Lưu trữ Refresh Token trong cơ sở dữ liệu: Token được mã hóa và lưu trong cơ sở dữ liệu người dùng, giúp tăng cường bảo mật.
- Access Token có thời gian hết hạn ngắn và không cần hủy trực tiếp, nhưng Refresh Token cần được quản lý kỹ lưỡng.

2. Quá trình Tạo và Quản lý JWT Tokens:

- Tạo access và refresh tokens bất đồng bộ, sử dụng các bí mật và thời gian hết hạn khác nhau cho từng loại token.
- Cập nhật refresh token đã mã hóa trong cơ sở dữ liệu sau khi đăng nhập.

3. Xác thực và Hủy JWT Tokens:

- Hủy refresh token khi người dùng đăng xuất hoặc khi tài khoản bị xóa.
- Xác thực refresh token bằng cách so sánh với phiên bản mã hóa đã lưu trong cơ sở dữ liệu.
- Nếu token không hợp lệ, sẽ ném một UnauthorizedException.

4. Quay vòng Refresh Token:

- Quay vòng refresh token: Mỗi khi làm mới phiên làm việc, một refresh token mới sẽ được cấp, và token cũ sẽ bị hủy.
- Cải thiện bảo mật bằng cách đảm bảo rằng refresh token cũ không thể tái sử dụng.

5. Logout và Hủy Token:

- Khi người dùng đăng xuất, refresh token sẽ được đặt thành null, làm hết hiệu lực của token.
