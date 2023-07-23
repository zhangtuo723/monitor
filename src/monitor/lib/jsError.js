import tracker from "../utils/tracker"
export function injectJsError() { 
    window.addEventListener('error', (event) => {
        console.log(event)
        tracker.send({
            kind: 'stability',
            type: 'error',
            message: event.message,
            filename: event.filename,
            position: `${event.lineno}:${event.colno}`,
        })
        
    })
    // promise rejection处理
    window.addEventListener('unhandledrejection', (event) => {
        let message;
        if (typeof event.reason === 'string') {
            message = event.reason
        } else if (typeof event.reason === 'object') { 
            message = event.reason.message
        }
        tracker.send({
            kind: "stability", 
            type: "error", 
            errorType: "promiseError", // js执行错误
            message, // 报错信息
        })

     })
}