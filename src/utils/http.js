import axios from 'axios'
import { ElMessage } from 'element-plus'

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000
})
instance.interceptors.request.use(config => {
    config.headers.Authorization = localStorage.token
    return config
});
instance.interceptors.response.use(
config => {
    if(config?.data?.meta?.msg === '无效token'){
        ElMessage({
            message: config.data.meta.msg+'，请重新登陆',
            type: 'error',
            duration:3 * 1000
        });
    }
    return config
},
error => {
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        ElMessage({
            message: '请求超时，请稍后重试',
            type: 'error',
            duration:3 * 1000
        });
    }
    return error
});
export const get = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        instance.get(url, { params })
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            })
    })
}

export const post = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            })
    })
}

export const put = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.put(url, data)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            })
    })
}

export const del = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        instance.delete(url, data)
            .then(res => {
                resolve(res.data)
            }, err => {
                reject(err)
            })
    })
}