import Recorder from "../utils/record.js";
import Replayer from '../utils/play.js'

// export function webrecord() { 

//     // record.start()

// }


export function webrecord(){
    start()
    setTimeout(()=>{
        end()
        replay()
    },10000)
   

}
export function start(){
    Recorder.start()
}
export function end(){
    Recorder.end()
}
export function replay(){
    const recordlist = window.localStorage.getItem('recordList')
        if(recordlist){
            const recorditem = JSON.parse(recordlist)[0]
            const initDom = recorditem.initDom
            const actionList = recorditem.actionList
            Replayer.init(initDom,actionList)
            window.localStorage.removeItem('recordList')
        }
    
}