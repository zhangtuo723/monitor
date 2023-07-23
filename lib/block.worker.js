import tracker from '../utils/tracker'
let stime;
let rtime = new Date();
let url = ''

addEventListener('message', (data) => { 
    rtime = data.data.time
    url = data.data.url
})
let blockCnt = 0
let blockflg = true
let timer = setInterval(() => {
    stime = new Date()
    let durtime = stime - rtime
    if (durtime > 1500) {
        blockCnt++
    } else { 
        blockCnt=0
    }
    if (blockCnt > 3 && blockflg) { 
        blockflg = false
        tracker.send({
            kind: "experience",
            type: "caton",
            url,
        })      
    }
    if (blockCnt > 10 ) { 
        tracker.send({
            kind: "experience",
            type: "block",
            url,
            event:events
        })
        clearInterval(timer)
    }
    postMessage(stime)
}, 1000);
