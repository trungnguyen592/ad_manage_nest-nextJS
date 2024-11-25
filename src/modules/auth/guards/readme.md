# TÌM HIỂU VỀ JWT Blacklist với Redis VÀ algorithms: ['RS256']

1. JWT Blacklist với Redis:

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

2. algorithms: ['RS256']:

- RS256 là một thuật toán mã hóa sử dụng RSA (Rivest–Shamir–Adleman) với SHA-256 để ký và xác thực JWT.
- Cơ chế hoạt động:
  Ký JWT: Sử dụng private key để ký nội dung của JWT.
  Xác thực JWT: Sử dụng public key để xác minh rằng JWT không bị thay đổi và được tạo bởi người có private key tương ứng.

# Quy trình khi sử dụng RS256 với Access Token/Refresh Token:

1. Khi đăng nhập:
   Server tạo Access Token và Refresh Token.
   Access Token có thời hạn ngắn (ví dụ: 15 phút).
   Refresh Token có thời hạn dài hơn (ví dụ: 7 ngày).

- Cả hai token được ký bằng RS256:
  Private Key để ký.
  Client nhận token và lưu trữ (Access Token thường ở bộ nhớ, Refresh Token trong cookies bảo mật).

2. Khi gửi yêu cầu đến server:
   Client gửi Access Token qua header Authorization.
   Server sử dụng Public Key để xác minh Access Token:
   Nếu hợp lệ, tiếp tục xử lý.
   Nếu hết hạn, yêu cầu Refresh Token để cấp lại Access Token mới.
3. Khi làm mới Access Token:
   Client gửi Refresh Token tới server.
   Server xác minh Refresh Token bằng Public Key:
   Nếu hợp lệ, cấp lại Access Token mới.
   Nếu không, yêu cầu đăng nhập lại.

=> Nó đảm bảo rằng:
Hệ thống phân tán có thể xác minh tính hợp lệ của token dễ dàng.
Đảm bảo token không bị giả mạo.
Chỉ server có thể tạo token mới (vì giữ Private Key).
