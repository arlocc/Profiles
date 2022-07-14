/*
    本作品用于QuantumultX和Surge之间js执行方法的转换
    您只需书写其中任一软件的js,然后在您的js最【前面】追加上此段js即可
    无需担心影响执行问题,具体原理是将QX和Surge的方法转换为互相可调用的方法
    尚未测试是否支持import的方式进行使用,因此暂未export
    如有问题或您有更好的改进方案,请前往 https://github.com/sazs34/TaskConfig/issues 提交内容,或直接进行pull request
*/
// #region 固定头部
let isQuantumultX = $task != undefined; //判断当前运行环境是否是qx
let isSurge = $httpClient != undefined; //判断当前运行环境是否是surge
// http请求
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
// cookie读写
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
// 消息通知
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
// #endregion 固定头部

// #region 网络请求专用转换
if (isQuantumultX) {
    var errorInfo = {
        error: ''
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        },
        post: (url, cb) => {
            var urlObj;
            if (typeof (url) == 'string') {
                urlObj = {
                    url: url
                }
            } else {
                urlObj = url;
            }
            url.method = 'POST';
            $task.fetch(urlObj).then(response => {
                cb(undefined, response, response.body)
            }, reason => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, '')
            })
        }
    }
}
if (isSurge) {
    $task = {
        fetch: url => {
            //为了兼容qx中fetch的写法,所以永不reject
            return new Promise((resolve, reject) => {
                if (url.method == 'POST') {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error
                            });
                        } else {
                            resolve(null, {
                                error: error
                            })
                        }
                    })
                }
            })

        }
    }
}
// #endregion 网络请求专用转换

// #region cookie操作
if (isQuantumultX) {
    $persistentStore = {
        read: key => {
            return $prefs.valueForKey(key);
        },
        write: (val, key) => {
            return $prefs.setValueForKey(val, key);
        }
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: key => {
            return $persistentStore.read(key);
        },
        setValueForKey: (val, key) => {
            return $persistentStore.write(val, key);
        }
    }
}
// #endregion

// #region 消息通知
if (isQuantumultX) {
    $notification = {
        post: (title, subTitle, detail) => {
            $notify(title, subTitle, detail);
        }
    }
}
if (isSurge) {
    $notify = function (title, subTitle, detail) {
        $notification.post(title, subTitle, detail);
    }
}
// #endregion

// ==UserScript==
// @Name              QX每日色图脚本
// @Author            Cuttlefish
// @TgChannel         https://t.me/ddgksf2021
// @WechatID          公众号墨鱼手记
// @UpdateTime        20210212
// @Appreciation      觉得不错👏去公众号菜单栏赞助我喝杯🥤
// @WebURL            https://api.lolicon.app/#/setu
// @Quota             300次/天
// @Attention         请在本地使用此脚本，便于填写ApiKey
// @ScriptURL         https://raw.githubusercontent.com/ddgksf2013/Cuttlefish/master/Script/setu.js
// ==/UserScript==

let userApikey   = '856426855e95d8e0e16da5' //请在 Telegram 内使用 @loliconApiBot 申请
let userR18      = 2 //18禁为1 非为0 2是混合
let userKeyword  = ''//搜索关键字
let userNum      = 1 //一次返回的结果数量，范围为1到10，数字的数量亦为弹框的次数
var request = {
    url:encodeURI("https://api.lolicon.app/setu?apikey=" + userApikey + "&r18=" + userR18 + "&keyword=" + userKeyword + "&num=" + userNum),
    header:{  
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1"
    },
}
$task.fetch(request).then(response => {
	let obj = JSON.parse(response.body);
	console.log(response.body);
	if(obj.code == 0)
	{
		for(i = 0;i<obj.data.length;i++)
		{
			let pictureURL = encodeURI(obj.data[i].url);
			$notify("每日色图", "", "cuttlefish", {"open-url":pictureURL,"media-url":pictureURL}); // Success
		}
	}
	else
	{
		 $notify("Title", "Subtitle", reason.error); // Error!
	}
})
