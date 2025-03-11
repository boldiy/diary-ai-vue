// 日记服务
import { authHeader } from './auth'

const API_URL = 'http://192.168.110.220:3000/api/diaries'

/**
 * 获取所有日记
 * @returns {Promise<Array>} - 日记列表
 */
export async function getAllDiaries() {
    try {
        const response = await fetch(API_URL, {
            headers: authHeader()
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || '获取日记失败')
        }

        return data
    } catch (error) {
        console.error('获取日记失败:', error)
        throw error
    }
}

/**
 * 获取单个日记详情
 * @param {number} id - 日记ID
 * @returns {Promise<Object>} - 日记详情
 */
export async function getDiary(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            headers: authHeader()
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || '获取日记详情失败')
        }

        return data
    } catch (error) {
        console.error(`获取日记#${id}失败:`, error)
        throw error
    }
}

/**
 * 创建新日记
 * @param {Object} diary - 日记对象
 * @returns {Promise<Object>} - 创建的日记
 */
export async function createDiary(diary) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diary)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || '创建日记失败')
        }

        return data
    } catch (error) {
        console.error('创建日记失败:', error)
        throw error
    }
}

/**
 * 更新日记
 * @param {number} id - 日记ID
 * @param {Object} diary - 日记对象
 * @returns {Promise<Object>} - 更新后的日记
 */
export async function updateDiary(id, diary) {
    try {
        console.log('准备更新日记:', diary)
        console.log('准备更新日记:', JSON.stringify(diary))
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                ...authHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diary)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || '更新日记失败')
        }

        return data
    } catch (error) {
        console.error(`更新日记#${id}失败:`, error)
        throw error
    }
}

/**
 * 删除日记
 * @param {number} id - 日记ID
 * @returns {Promise<void>}
 */
export async function deleteDiary(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeader()
        })

        if (!response.ok) {
            const data = await response.json()
            throw new Error(data.message || '删除日记失败')
        }
    } catch (error) {
        console.error(`删除日记#${id}失败:`, error)
        throw error
    }
}

/**
 * 获取指定日期的日记列表
 * @param {string} date - 日期字符串 (YYYY-MM-DD)
 * @returns {Promise<Array>} - 日记列表
 */
export async function getDiariesByDate(date) {
    try {
        const response = await fetch(`${API_URL}/date/${date}`, {
            headers: authHeader()
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '获取日记列表失败');
        }

        return data;
    } catch (error) {
        console.error('获取日记列表失败:', error);
        throw error;
    }
} 