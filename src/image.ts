import COS from "cos-js-sdk-v5";
import axios from "axios";
import { OpenAPI } from "./api/core/OpenAPI";
export interface OSSTempKey {
  expiredTime: number;
  expiration: Date;
  credentials: Credentials;
  requestId: string;
  startTime: number;
}
export interface Credentials {
  sessionToken: string;
  tmpSecretId: string;
  tmpSecretKey: string;
}
const ossName = "images-1253529509";
const ossRegion = "ap-chengdu";
export const uploadImages = async (
  image: Blob,
) => {
  const mimeType = image.type;
  const fileName = image.name; // e.g. 'file.txt'

  const ext = fileName.split(".").pop(); // 'txt'
  // 初始化实例
  const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: async function (_, callback) {
      // 初始化时不会调用，只有调用 cos 方法（例如 cos.putObject）时才会进入
      // 异步获取临时密钥
      // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
      // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
      // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
      const { data } = await axios.get<OSSTempKey>("/api/ossKey", {
        headers: {
          Authorization: `Bearer ${OpenAPI.TOKEN}`,
        },
      });

      const crendentials = data.credentials;
      callback({
        TmpSecretId: crendentials.tmpSecretId,
        TmpSecretKey: crendentials.tmpSecretKey,
        SecurityToken: crendentials.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000 ]
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    },
  });
  try {
    const key = new Date().getTime();
    const fileName = `${key}.${ext}`;
    await cos.uploadFile({
      Bucket: ossName as string,
      Region: ossRegion as string,
      Key: fileName,
      ContentType: mimeType,
      Body: image, // 上传文件对象
      // SliceSize: 1024 * 1024 * 5,
    });
    const userStoreUrl = `https://images-1253529509.cos.ap-chengdu.myqcloud.com/${fileName}`;
    return userStoreUrl;
  } catch (err) {
    console.error(err);
  }
};
