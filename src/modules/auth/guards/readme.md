1.  Local Strategy xác thực thông tin đăng nhập (email và password).
    JWT Strategy dùng để bảo vệ các route cần xác thực sau khi đăng nhập.
    Guards (AuthGuard) được sử dụng để kích hoạt chiến lược tương ứng.
    AuthService xử lý logic liên quan đến xác thực và phát hành token.

2.  Khi người dùng đăng nhập, Passport sẽ:
    Gọi phương thức validate(email, password) của LocalStrategy.
    Kiểm tra thông tin đăng nhập qua AuthService.validateUser.
    Nếu hợp lệ, trả về thông tin người dùng; nếu không, báo lỗi UnauthorizedException.

3.

- passport-jwt: Phương thức này chỉ cần bạn cung cấp token trong header theo chuẩn Authorization: Bearer <your-jwt-token>, và nó sẽ tự động phân tích, xử lý JWT từ request header, giải mã và kiểm tra tính hợp lệ của token mà không cần phải xử lý thủ công, giúp bạn tập trung vào các logic ứng dụng mà không cần lo lắng về việc giải mã hoặc xử lý token thủ công.

- extractTokenFromHeader là phương pháp thủ công, bạn tự quản lý việc lấy token từ header và có thể tùy chỉnh logic xử lý. Tuy nhiên, bạn sẽ cần thêm các bước để giải mã và xác thực token. (jsonwebtoken)

=> Kiểu như thay vì tự viết code để lấy token từ header Authorization và kiểm tra xem có tồn tại không, sau đó phân tách chuỗi để lấy phần token thì sài thư viện nhanh hơn 👍
