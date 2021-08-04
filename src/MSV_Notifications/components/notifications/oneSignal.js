const config = require('../../../../config/index')
const sendOneSignal_N = function(data) {
  ///  console.warn('Data message--->', data)
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${config.OneSignal.key_api}`
    };
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    var https = require('https');
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        // console.log("Response:");
        // console.log(JSON.parse(data));
      });
    });
    req.on('error', function(e) {
      // console.log("ERROR:");
      // console.log(e);
    });
    req.write(JSON.stringify(data));
    req.end();
  };
 
module.exports = {
    sendOneSignal_N
}