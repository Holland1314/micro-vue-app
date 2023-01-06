import axios from 'axios'
import { message } from 'ant-design-vue';
import { publicIp } from "./url";

// let hide = null
const instance = axios.create({
  //创建axios实例，在这里可以设置请求的默认配置
  timeout: 10000, // 设置超时时间10s
  baseURL: publicIp, //根据自己配置的反向代理去设置不同环境的baeUrl
});
// 文档中的统一设置post请求头。下面会说到post请求的几种'Content-Type'
instance.defaults.headers.post[
  ("Content-Type", "Access-Control-Allow-Origin")
] = "application/json";
//生产经营管理系统
// instance.defaults.headers.post['Authorization'] = 'Bearer session_info_key_8ad453d2-95f2-4075-a3b2-05b18ae2a0d1'
let httpCode = {
  //这里我简单列出一些常见的http状态码信息，可以自己去调整配置
  400: "请求参数错误",
  401: "权限不足, 请重新登录",
  403: "服务器拒绝本次访问",
  404: "请求资源未找到",
  500: "内部服务器错误",
  501: "服务器不支持该请求中使用的方法",
  502: "网关错误",
  504: "网关超时",
};

/** 添加请求拦截器 **/
instance.interceptors.request.use(
  (config) => {
    config.headers["token"] = sessionStorage.getItem("access_token") || "";
    if (config.type === "fileUpload") {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    if (config.type === "download") {
      config["responseType"] = "blob";
    }
    // hide = message.loading({ content: 'Loading...', duration: 0 });
    // 在这里：可以根据业务需求可以在发送请求之前做些什么:例如我这个是导出文件的接口，因为返回的是二进制流，所以需要设置请求响应类型为blob，就可以在此处设置。
    /*if (config.url.includes('pur/contract/export')) {
        config.headers['responseType'] = 'blob'
    }
    // 我这里是文件上传，发送的是二进制流，所以需要设置请求头的'Content-Type'
    if (config.url.includes('pur/contract/upload')) {
        config.headers['Content-Type'] = 'multipart/form-data'
    }*/
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

/** 添加响应拦截器  **/
instance.interceptors.response.use(
  (response) => {
    // hide()
    // token失效判断，不知道为什么没进error，没时间细看，先加这了
    if (response.data.code && response.data.code === 401) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips = response.data.message;
      message.error(tips);
      window.location.href = "/#/login";
      return;
      // this.props.history.push("/TalentPool");
    }

    if (
      response.data.code &&
      response.data.code != 200 &&
      !response.data.successful
    ) {
      // 根据请求失败的状态码去给用户相应的提示
      let tips = response.data.message;
      message.error(tips);
      return;
    }
    if (response.status === 200) {
        // console.log(response.headers['content-disposition']);
      // 响应结果里的statusText: ok是我与后台的约定，大家可以根据实际情况去做对应的判断
      if(response.data.code){
        return Promise.resolve(response.data);
      }else{
        return Promise.resolve(response);
      }
      
    } else {
      message.error("响应超时");
      return Promise.reject(response.data.message);
    }
  },
  (error) => {
    // hide()
    if (error.response) {
      // 根据请求失败的http状态码去给用户相应的提示
      let tips =
        error.response.status in httpCode
          ? httpCode[error.response.status]
          : error.response.data.message;
      message.error(tips);
      if (error.response.status === 401) {
        // token或者登陆失效情况下跳转到登录页面，根据实际情况，在这里可以根据不同的响应错误结果，做对应的事。这里我以401判断为例
        //针对框架跳转到登陆页面
        this.props.history.push("/login");
      }
      return Promise.reject(error);
    } else {
      message.error("请求超时, 请刷新重试");
      return Promise.reject("请求超时, 请刷新重试");
    }
  }
);
export default instance;

/* 统一封装get请求 */
export const get = (url, data, baseURL, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: "get",
      baseURL: baseURL ? publicIp[baseURL] : publicIp.publicIp,
      url,
      data,
      ...config,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * var formData = new FormData();
   formData.append("file", e.target.files[0]);     /////// e.target.files 获取fileList对象里的上传的file对象添加到formData里面
   post("url",formData,"baseUrl",{type:"fileUpload"})
   */

/* 统一封装post请求  */
export const post = (url, data, baseURL, config = {}) => {
  return new Promise((resolve, reject) => {
    instance({
      method: "post",
      baseURL: baseURL ? publicIp[baseURL] : publicIp.publicIp,
      url,
      data,
      ...config,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
// name 携带后缀名
export const downLoadData = (name,res) => {
    const blob = new Blob([res.data]);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = e => {
        const a = document.createElement('a');
        a.download = `${name}`;
        a.href = e.target.result;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
};
