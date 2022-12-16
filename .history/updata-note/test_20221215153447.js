import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import qs from "qs";
import { Spin } from "@arco-design/web-react";
import BrowserStorage from "@/storage/browser";

import BaseStorage from "@/storage";
import { TOKEN, USER_INFO, ACTIVE_PROJECT } from "@/constants";

/* ######################################################## 基础配置 ######################################################## */

const URLENCODED_CONTENT_TYPE = {
  "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
}; // 浏览器默认配置值， 在 config.params 中生效
const JSON_CONTENT_TYPE = { "Content-Type": "application/json;charset=UTF-8" }; // 当前对接默认
const FORMDATA_CONTENT_TYPE = {
  "Content-Type": "multipart/form-datacharset=UTF-8",
}; // 文件上传

const headers = BrowserStorage.is_no_support_browser()
  ? Object.assign(
      {},
      {
        "Cache-Control": "no-cache",
      },
      URLENCODED_CONTENT_TYPE
    )
  : URLENCODED_CONTENT_TYPE;

// 请求钩子
let startTime = 0;
const isDev = process.env.NODE_ENV === "development";
const urlPrefix = isDev ? "/dev-api" : "/prod-api";

const service = axios.create({
  headers,
  // method: 'post', // 定制： 默认使用post请求， 且使用json格式传参
  baseURL: urlPrefix,
  // timeout: 20000,
  // timeoutErrorMessage: '请求超时',
});
let requestCount = 0;
// 展示loading
const showLoading = () => {
  if (requestCount === 0) {
    var dom = document.createElement("div");
    dom.setAttribute("id", "loading");
    document.body.appendChild(dom);
    ReactDOM.render(<Spin loading />, dom);
  }
  requestCount++;
};
// 取消loading
const hideLoading = () => {
  requestCount--;
  if (requestCount === 0) {
    document.body.removeChild(document.getElementById("loading"));
  }
};

// request interceptor
service.interceptors.request.use(
  (config) => {
    // requestCount为0，才创建loading, 避免重复创建
    if (config.headers.isLoading !== false) {
      showLoading();
    }

    // debugger
    if (!config.params) {
      config.params = {};
    }
    const method = config.method ? config.method.toUpperCase() : "GET";
    // 1. 不同请求参数的 特殊处理
    if (method === "GET") {
      // if (config.json) {
      //   // config.data = JSON.stringify(config.data)
      //   // // config.data = qs.stringify(config.data)
      //   Object.assign(config.headers.get, JSON_CONTENT_TYPE)
      //   // config.headers = Object.assign({}, config.headers, JSON_CONTENT_TYPE)
      //   config.headers = Object.assign({}, config.headers, JSON_CONTENT_TYPE) // json
      // }
    } else if (method === "POST") {
      if (!config.data) {
        config.data = {};
      }
      if (config.formData) {
        config.data = create_form_data(config.data);
        config.headers = Object.assign(
          {},
          config.headers,
          FORMDATA_CONTENT_TYPE
        );
      } else {
        const json = config.json ? config.json : true;
        if (json) {
          config.headers = Object.assign({}, config.headers, JSON_CONTENT_TYPE); // json
        } else {
          config.data = qs.stringify(config.data); // url
        }
      }
    }

    const tokenVal = BaseStorage.get_string(TOKEN);
    if (tokenVal) {
      config.headers["IamToken"] = tokenVal;
    }
    config.headers["userId"] = 1; // store.getters.projectActive ||
    const projectActive = BaseStorage.get_json(ACTIVE_PROJECT);
    config.headers["projectId"] = projectActive
      ? projectActive.projectId
      : undefined; //'get_projectId_failed'
    // config.headers['projectId'] = 'e886761e63564f98825dc3fc62d40251'

    startTime = new Date().getTime();
    return config;
  },
  (error) => {
    // 判断当前请求是否设置了不显示Loading
    if (error.config.headers.isLoading !== false) {
      hideLoading();
    }
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    // 判断当前请求是否设置了不显示Loading
    if (response.config.headers.isLoading !== false) {
      hideLoading();
    }

    const loadTime = new Date().getTime() - startTime;

    const res = response.data;

    if (isDev && loadTime > 6000) {
      console.warn(
        `本次加载时间为 ${loadTime / 1000}s`,
        `api: ${response.request.responseURL}`
      );
    }

    const rst = {
      status: false,
      data: res.data,
      message: res.message || res.msg || "",
    };
    if (res.code === 200) {
      rst.status = true;
    } else if (res.code === 10009) {
      BaseStorage.remove(TOKEN, USER_INFO);
      const url = window.location;
      window.open(url.protocol + "//" + url.hostname + ":8005/login", "_self");
      return false;
    }

    return Promise.resolve(rst);
  },
  (error) => {
    if (error.config?.headers.isLoading !== false) {
      hideLoading();
    }
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default service;
