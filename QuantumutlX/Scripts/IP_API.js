if ($response.statusCode != 200) {
  $done(Null);
}

var body = $response.body;
var obj = JSON.parse(body);
var title = obj['country'];
var subtitle = obj['city'] + ' ' + obj['isp'] + " ➠ "+ obj['country'];
var ip = obj['query'];
var description = "國家" + ":" + obj['country'] + '\n' + "地區" + ":" + obj['city'] + '\n' + "運營商" + ":" + obj['isp'] + '\n' + "數據中心" + ":" + obj['org'] + '\n' + obj['as'] + '\n'+'定位: [' +obj["lat"]+","+obj["lon"]+"]" + '\n' + 'IP:'+ obj['query'] + '\n' +'時區:'+ obj['timezone'];


$done({title, subtitle, ip, description});
