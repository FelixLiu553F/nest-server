const {
  RDS_HOST: host,
  RDS_PORT: port,
  RDS_PASSWORD: password,
  RDS_PATH: path,
} = process.env;

export const REDIS_CONFIG = {
  path: path ? path : null,
  host,
  port: parseInt(port, 10),
  password,
};

// 会话超时时间 (默认7天)
export const SESSION_EXPIRES = +(process.env.SESSION_EXPIRES ?? '604800');
