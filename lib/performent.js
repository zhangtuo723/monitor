import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function performentMonitor() { 
    let FMP, LCP,FP,FCP;
    new PerformanceObserver((entryList, observe) => { 
        LCP = entryList.getEntries()[0]
        // console.log('Lcp:',LCP)
        observe.disconnect()

    }).observe({ entryTypes: ['largest-contentful-paint'] })

    new PerformanceObserver((entryList, observe) => {
        FMP = entryList.getEntries()[0]
        // console.log('FMP:',FMP)
        observe.disconnect()
    }).observe({ entryTypes: ['element']})

    new PerformanceObserver((entryList, observe) => { 
        const firstInput = entryList.getEntries()[0]
        if (firstInput) { 
            // ？？为什么这样计算???
            let inputDelay = firstInput.processingStart - firstInput.startTime
            let duration = firstInput.duration;
            if (inputDelay > 0 || duration > 0) { 
                tracker.send({
                    kind: 'experience',
                    type: 'firstInputDelay',
                    inputDelay: inputDelay ?? 0,
                    duration: duration ?? 0,
                    startTime:firstInput.startTime,
                })
            }
        }
        observe.disconnect()
    }).observe({ entryTypes: ['first-input'] })

    new PerformanceObserver((entryList, observe) => {
        // fp fcp
         FP = entryList.getEntriesByName('first-paint')[0]
         FCP = entryList.getEntriesByName('first-contentful-paint')[0]
        observe.disconnect()
    }).observe({ entryTypes: ['paint']})

    onload(function () { 
        setTimeout(() => { 
            const {
                fetchStart,
                connectStart,
                connectEnd,
                requestStart,
                responseStart,
                responseEnd,
                domLoading,
                domInteractive,
                domContentLoadedEventStart,
                domContentLoadedEventEnd,
                loadEventStart,
            } = window.performance.timing;

            // 发送time指标
            tracker.send({
                kind: 'experience',
                type: 'timing',
                connectTime: connectEnd - connectStart,
                ttfbTime: responseStart - requestStart, // 首字节到达时间
                responseTime: responseEnd - responseStart, // response响应耗时
                parseDOMTime: loadEventStart - domLoading, // DOM解析渲染的时间
                domContentLoadedTime:
                    domContentLoadedEventEnd - domContentLoadedEventStart, // DOMContentLoaded事件回调耗时
                timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
                loadTime: loadEventStart - fetchStart, // 完整的加载时间
            })

            tracker.send({
                kind: "experience",
                type: "paint",
                firstPaint: FP?.startTime ??0,
                firstContentPaint: FCP?.startTime ??0,
                firstMeaningfulPaint: FMP?.startTime ??0,
                largestContentfulPaint: LCP?.renderTime??0,

            })

        },3000)

        
           
        
       
    })
   
}
