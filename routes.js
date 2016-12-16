"use strict";
var emoji = require('emoji');

module.exports = function(app) {
    app.get('/', function (req, res) {
        var html = emoji.unifiedToHTML('😄😊😃☺😉😍😘😚😳😌😁😜😝😒😏😓😔😞😖😥😰😨😣😢😭😂😲😱😠😡😪😷👿👿👽💛💙💜💗💚❤💔💓💘✨🌟💢❕❔💤💨💦🎶🎵🔥💩👍👎👌👊✊✌👋✋👃👀👂👄💋👣💀💂👸👼')
            .replace(/<span/gi, '<li><span')
            .replace(/<\/span>/gi, '</span></li>');

        res.render('index',{
            emoji: html
        });
    });

};
