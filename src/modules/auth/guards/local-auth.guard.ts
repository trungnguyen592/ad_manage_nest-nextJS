import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

// thay vì viết AuthGuard('local') thì LocalAuthGuard kiểu cho nó tường minh
