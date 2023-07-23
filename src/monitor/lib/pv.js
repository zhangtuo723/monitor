import tracker from "../utils/tracker";
export function pv() { 
    var connection = navigator.connection
    tracker.send({
        kind: 'business',
        type: 'pv',
        effectiveType: connection.effectiveType,
        rtt: connection.rtt,
        screen: `${window.screen.width}x${window.screen.height}`, //设备分辨率
    })
    let startTime = Date.now()
  
    
    let preurl = location.href
    let starttime = new Date()
    // 检测hash 路由
    window.addEventListener('hashchange', () => { 
        let stayTime = new Date() - startTime
        
        startTime = new Date()
        preurl = location.href
        tracker.send({
            kind: 'business',
            type: 'stayTime',
            stayTime,
            url:location.href
        })
    })

    window.addEventListener('unload', () => {
        let stayTime = Date.now() - startTime
        tracker.send({
            kind: 'business',
            type: 'stayTime',
            stayTime,
            url:location.href
        })
     })
}