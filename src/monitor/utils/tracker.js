

function getExtraData() {
    return {
        title: document.title,
        url: location.href,
        timestamp: Date.now(),
        // userAgent: userAgent.parse(navigator.userAgent).name,
        userAgent:'xxxx-xxx'
    };
}
class SendTracker {
    constructor() {
        // pass
        this.url = 'http://xxx.xxx.xxx'
    }
    send(data = {}) { 
        // 处理一下格式发给日志系统xxx
        console.log('-------------------------')
        console.dir(data)
        console.log('-------------------------')
    }
}
 
export default new SendTracker()