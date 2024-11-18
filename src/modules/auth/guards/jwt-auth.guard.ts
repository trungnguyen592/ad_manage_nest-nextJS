import { IS_PUBLIC_KEY } from '@/common/decorators/customize';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

//Đây là guard bạn sẽ viết để kiểm tra xem người dùng đã xác thực thông qua JWT hay chưa.
//Guard này sẽ kiểm tra tính hợp lệ của JWT trong request, ví dụ như kiểm tra Authorization header có chứa token hợp lệ hay không.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Access Token không hợp lệ hoặc không có tại header.',
        )
      );
    }
    return user;
  }
}
