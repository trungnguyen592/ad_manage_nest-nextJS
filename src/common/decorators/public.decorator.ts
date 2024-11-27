import { SetMetadata } from '@nestjs/common';

//IS_PUBLIC_KEY là khóa để nhận biết metadata (dùng trong guard).
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE, message);
