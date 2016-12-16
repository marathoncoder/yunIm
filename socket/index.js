"use strict";
var emoji = require('emoji');

//在线用户
let onlineUsers = {};
//当前在线人数
let onlineCount = 0;

module.exports = function(io){
    io.on('connection', function (socket) {
        //监听新用户加入
        socket.on('login', function(obj){
            //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
            socket.name = obj.userId;

            //检查在线列表，如果不在里面就加入
            if(!onlineUsers.hasOwnProperty(obj.userId)) {
                onlineUsers[obj.userId] = obj.userName;
                //在线人数+1
                onlineCount++;
            }

            //向所有客户端广播用户加入
            io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
        });

        //监听用户退出
        socket.on('disconnect', function(){
            //将退出的用户从在线列表中删除
            if(onlineUsers.hasOwnProperty(socket.name)) {
                //退出用户的信息
                var obj = {userid:socket.name, userName:onlineUsers[socket.name]};

                //删除
                delete onlineUsers[socket.name];
                //在线人数-1
                onlineCount--;

                //向所有客户端广播用户退出
                io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
            }
        });

        //监听用户发布聊天内容
        socket.on('message', function(obj){
            //向所有客户端广播发布的消息
            io.emit('message', obj);
        });

        //监听表情发送
        socket.on('emoji',function(obj){
            var emojiCode = obj.emojiCode;
            var text = '';
            var emojiMap  = emoji.EMOJI_MAP;
            for(var i in emojiMap){
                var item = emojiMap[i];
                if(item[2] == emojiCode){
                    text = i;
                }
            }
            io.emit('emoji',{text: text,userId:obj.userId});
        });
    });
}