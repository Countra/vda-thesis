import axios from "axios";

function axiosRequest(dict) {
    // 请求的参数
    let reqArgs = {};
    // 后端路径
    const baseUrl = process.env.VUE_APP_BACK_API;
    // 目标URL
    const url = baseUrl + dict.url;
    // 请求方法
    const method = dict.method;
    // 数据（POST方法）
    const data = dict.data;
    // GET的参数
    const params = dict.params;
    reqArgs.method = method;
    reqArgs.url = url;
    if (data) {
        reqArgs.data = data;
    } else if (params) {
        reqArgs.params = params;
    }
    // 如果有token就带上
    const user = localStorage.getItem('user');
    if (user) {
        const token = JSON.parse(user).token;
        reqArgs.headers = {
            'Authentication': token
        }
    }
    console.log(reqArgs);
    return new Promise((resolve, reject) => {

        axios(reqArgs).then(res => {
            resolve(res);
        }).catch(error => {
            reject(error);
        })

    })
}

export default axiosRequest;