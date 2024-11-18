import * as bcrypt from 'bcrypt';
const saltRounds = 10;

//Khi có lỗi, hàm sẽ return undefined thay vì throw, giúp hàm gọi có thể kiểm tra và xử lý undefined
export const hashPasswordHelper = async (
  plainPassword: string,
): Promise<string | undefined> => {
  try {
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error('Lỗi khi mã hóa mật khẩu:', error);
    return undefined; // Trả về undefined khi có lỗi
  }
};

//Khi có lỗi, hàm sẽ trả về false, giúp hàm gọi có thể nhận diện thất bại và tiếp tục xử lý mà không cần try/catch bên ngoài.
export const comparePasswordHelper = async (
  plainPassword: string,
  hashPassword: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plainPassword, hashPassword);
  } catch (error) {
    console.error('Lỗi khi so sánh mật khẩu:', error);
    return false; // Trả về false khi có lỗi
  }
};
