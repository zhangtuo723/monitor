import tracker from "../utils/tracker";
export function injectFetch() { 
   
    let oldFetch = window.fetch
    function handleFetch(url, options) { 
        let startTime = Date.now();
        return new Promise((resolve, reject) => {
                oldFetch(url, options)
                    .then(response => {
                        
                        resolve(response)
                    }, rejection => {
                        // 连接未连接上
                        sendLogData({
                            url,
                            startTime,
                            eventType: 'load',
                            response: rejection.stack,
                            options
                        })
                        reject(rejection)
                    })
         })
    }

    window.fetch = handleFetch
}

const sendLogData = ({
    startTime,
    statusText = '',
    status = '',
    eventType,
    url,
    options,
    response,
}) => {
    // 持续时间
    let duration = Date.now() - startTime;
    const { method = 'get', body } = options || {}
    tracker.send({
        kind: "stability",
        type: "fetch",
        eventType: eventType,
        pathname: url,
        status: status + "-" + statusText, // 状态码
        duration,
        response: response ? JSON.stringify(response) : "", // 响应体
        method,
        params: body || "", // 入参
    });
}