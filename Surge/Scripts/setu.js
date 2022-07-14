let apikey = '856426855e95d8e0e16da5' //请在 Telegram 内使用 @loliconApiBot 申请，
let r18 = 1 //18禁为1 非为0 2是混合
let keyword = ''//搜索关键字
let num = 1 //一次返回的结果数量，范围为1到10，数字的数量亦为弹框的次数
var params = {
    url:encodeURI("https://api.lolicon.app/setu?apikey=" + apikey + "&r18=" + r18 + "&keyword=" + keyword + "&num=" + num),
    header:{  
     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Mobile/15E148 Safari/604.1"
    },
}
$httpClient.get(params,function(error, response, data){
    let datas = JSON.parse(data) || {"code": 1,"msg": "无响应"}
   if(datas.code == 0){
    let msg = datas.data[0]
    let url = msg.url
    console.log(url)
    $notification.post("每日色图","",msg.tags,{'openUrl':url,'mediaUrl':url})
   } 
   else{
      console.log(datas.msg)
      $notification.post("获取图片失败","",datas.msg)
    }
  });
$done({});
