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

6. JWT Blacklist với Redis

- Redis là một hệ thống lưu trữ dữ liệu theo dạng key-value, rất nhanh và có thể lưu trữ dữ liệu tạm thời với thời gian sống (TTL - Time-to-Live).
- Cài đặt Redis và NestJS Redis module:
  npm install @nestjs/redis redis
- Cấu hình Redis vào AuthModule:
  RedisModule.forRoot({
  host: 'localhost', // Redis server đang chạy trên máy tính này
  port: 6379, // Cổng mặc định của Redis
  });
- Thêm JWT vào blacklist: Khi người dùng logout hoặc khi bạn muốn hủy quyền truy cập của họ, bạn thêm access_token vào Redis blacklist.
  AuthService:
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async blacklistToken(token: string) {
  // Tạo khóa cho token
  const tokenKey = `blacklist:${token}`;

  // Lưu trữ token vào Redis với thời gian hết hạn tương ứng với thời gian hết hạn của token
  await this.redis.set(tokenKey, true, 'EX', 3600); // TTL 1 giờ (hoặc theo thời gian hết hạn của token)
  }

  // Kiểm tra token có nằm trong blacklist không
  async isTokenBlacklisted(token: string): Promise<boolean> {
  const tokenKey = `blacklist:${token}`;
  const exists = await this.redis.exists(tokenKey);
  return exists === 1;
  }

- Kiểm tra blacklist khi nhận yêu cầu: Trước khi cho phép một người dùng thực hiện hành động bảo mật (ví dụ: truy cập tài nguyên yêu cầu quyền truy cập), bạn cần kiểm tra xem access_token có bị blacklist không.
  => JWT Guard

- Xóa token khỏi blacklist (Optional): Nếu bạn muốn xóa token khỏi blacklist sau một thời gian (ví dụ: khi token hết hạn hoặc người dùng đăng nhập lại), Redis sẽ tự động xóa các token đã hết hạn nếu bạn thiết lập TTL (thời gian sống) cho mỗi token.

# Cơ chế hoạt động của Redis và JWT Blacklist

- Khi người dùng logout: Bạn lưu trữ access_token vào Redis với TTL (Time-To-Live) tương ứng với thời gian hết hạn của token. Điều này có nghĩa là khi token hết hạn, Redis sẽ tự động xóa nó khỏi blacklist.
- Khi người dùng thực hiện yêu cầu: Trước khi xử lý yêu cầu, bạn kiểm tra xem token có bị blacklist không. Nếu có, yêu cầu sẽ bị từ chối.
- Khi người dùng đăng nhập lại: Một token mới sẽ được cấp và không bị lưu trong blacklist (trừ khi có hành động logout hoặc hủy quyền truy cập lại).
