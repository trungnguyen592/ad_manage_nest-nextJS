import { SetMetadata } from '@nestjs/common';
import { ROLES } from '@/common/enums/role.enum';

// Đảm bảo decorator Roles nhận một mảng các vai trò
export const Roles = (...roles: ROLES[]) => SetMetadata('roles', roles);
