// 存储令牌
export const setToken = (token, key = 'token') => {
  localStorage.setItem(key, token);
};

// 获取令牌
export const getToken = (key = 'token') => {
  return localStorage.getItem(key);
};

// 删除令牌
export const removeToken = (key = 'token') => {
  localStorage.removeItem(key);
};

// 检查是否登录
export const isLoggedIn = (key = 'token') => {
  return !!localStorage.getItem(key);
};