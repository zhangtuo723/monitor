import tracker from "../utils/tracker";
export function longTask() {
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.duration > 100) {
               
                requestIdleCallback(() => {
                    tracker.send({
                        kind: "experience",
                        type: "longTask",
                        startTime: entry.startTime, // 开始时间
                        duration: entry.duration, // 持续时间
                        // 录屏 或者获取最后一个事件
                    });
                });
            }
        });
    }).observe({ entryTypes: ["longtask"]});
}
