
import Worker from 'worker-loader!./block.worker.js'
export function block() { 
    let worker = new Worker()
    // worker.postMessage('xxx')
    
    
    worker.addEventListener('message', (data) => { 
        
        worker.postMessage({ time: data.data, url: location.href})
    })
}