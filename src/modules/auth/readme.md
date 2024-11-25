1. Đăng kí tk

## Logic ĐKI

- Frontend gọi api register
- Backend lưu user (trả ra id của user), đồng thời gửi email/code để active
- Frontend redirect to /verify/:id
- Backend viết api (/check-code) check theo id và mã code tại email

- Step 1: tạo account

  - Save user to database
  - Gửi code to email

- Step 2: verify account
  - Gọi api verify với mã code ( Bên FE, DB có isActive: True thì ok)
  - Nếu user đki ko active mà vẫn đăng nhập thì sao?
    - Cho đăng nhập but navigate tới trang Active
    - Gửi lại mã code (Nếu hếc hạn)

2.  Khi người dùng đăng nhập, Passport sẽ:
    Gọi phương thức validate(email, password) của LocalStrategy.
    Kiểm tra thông tin đăng nhập qua AuthService.validateUser.
    Nếu hợp lệ, trả về thông tin người dùng; nếu không, báo lỗi UnauthorizedException.
3.  Local Strategy xác thực thông tin đăng nhập (email và password).
    JWT Strategy dùng để bảo vệ các route cần xác thực sau khi đăng nhập.
    Guards (AuthGuard) được sử dụng để kích hoạt chiến lược tương ứng.
    AuthService xử lý logic liên quan đến xác thực và phát hành token.
4.

- passport-jwt: Phương thức này chỉ cần bạn cung cấp token trong header theo chuẩn Authorization: Bearer <your-jwt-token>, và nó sẽ tự động phân tích, xử lý JWT từ request header, giải mã và kiểm tra tính hợp lệ của token mà không cần phải xử lý thủ công, giúp bạn tập trung vào các logic ứng dụng mà không cần lo lắng về việc giải mã hoặc xử lý token thủ công.

- extractTokenFromHeader là phương pháp thủ công, bạn tự quản lý việc lấy token từ header và có thể tùy chỉnh logic xử lý. Tuy nhiên, bạn sẽ cần thêm các bước để giải mã và xác thực token. (jsonwebtoken)

=> Kiểu như thay vì tự viết code để lấy token từ header Authorization và kiểm tra xem có tồn tại không, sau đó phân tách chuỗi để lấy phần token thì sài thư viện nhanh hơn 👍

5. Tóm tắt

- Đăng nhập (LocalStrategy):
  Người dùng gửi email, password → Tạo JWT → Trả về JWT.
- Truy cập route được bảo vệ (JwtStrategy):
  Người dùng gửi JWT trong header.
  JwtAuthGuard kiểm tra tính hợp lệ của JWT:
  Dùng khóa bí mật (JWT_SECRET) để giải mã JWT.
  Lấy thông tin payload từ JWT.
  Cho phép truy cập hoặc từ chối (nếu không hợp lệ).
