// 类型声明扩展（解决 request.user 的类型问题）
declare module 'express' {
  interface Request {
    user?: JwtPayload; // 明确声明 user 属性类型
  }
}

// JWT 负载类型定义
export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
}
