// 认证服务

const API_URL = 'http://192.168.110.220:3000/api';

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 返回登录结果
 */
export async function login(username, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('登录失败:', data);
            if (data && data.message) {
                throw new Error(data.message);
            } else if (response.status === 401) {
                throw new Error('用户名或密码不正确');
            } else if (response.status === 404) {
                throw new Error('用户不存在');
            } else {
                throw new Error('登录失败，请稍后再试');
            }
        }

        // 保存token到localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        return data;
    } catch (error) {
        console.error('登录过程发生错误:', error);
        throw error;
    }
}

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Promise} - 返回注册结果
 */
export async function register(username, email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // 改进错误处理，提供更具体的错误信息
            console.error('注册失败:', data);
            if (data && data.message) {
                throw new Error(data.message);
            } else if (response.status === 409) {
                throw new Error('用户名或邮箱已被注册');
            } else {
                throw new Error('注册失败，请稍后再试');
            }
        }

        return data;
    } catch (error) {
        console.error('注册过程发生错误:', error);
        throw error;
    }
}

/**
 * 用户登出
 */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

/**
 * 获取当前用户信息
 * @returns {Object|null} - 返回用户信息或null
 */
export function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

/**
 * 获取认证令牌
 * @returns {string|null} - 返回令牌或null
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * 检查用户是否已登录
 * @returns {boolean} - 是否已登录
 */
export function isAuthenticated() {
    return !!getToken();
}

/**
 * 添加认证头部到请求
 * @param {Object} headers - 原始头部
 * @returns {Object} - 添加认证信息后的头部
 */
export function authHeader(headers = {}) {
    const token = getToken();
    if (token) {
        return {
            ...headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return headers;
} 