import tracker from "../utils/tracker";
export function injectAjax() {
    let XMLHttpRequest = window.XMLHttpRequest;
    let oldOpen = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function (method, url, async) {
        // url不包含tracker.url 才会上报
        if (!url.match(RegExp(tracker.url))) { 
            this.logData = {method,url,async}
        }
        return oldOpen.apply(this,arguments)
    }
    
    let oldSend = XMLHttpRequest.prototype.send
    XMLHttpRequest.prototype.send = function (body) { 
        if (this.logData) { 
            let startTime = Date.now()
            let handler = (type) => (event) => {
                let duration = Date.now() - startTime
                let status = this.status
                let statusText = this.statusText
                tracker.send({
                    kind: 'stability',
                    type: 'xhr',
                    eventType: type,
                    pathname: this.logData.url,
                    status: status + '-' + statusText,
                    duration,
                    response: this.response ? JSON.stringify(this.response) : '',
                    params:body||''
                })
            }
            this.addEventListener('load', handler('load'), false) // 成功触发
            this.addEventListener('error', handler('error'), false) // 失败触发
            this.addEventListener('abort',handler('abort'),false) // 终止触发
        }

        return oldSend.apply(this,arguments)

    }
    
 }