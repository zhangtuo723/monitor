import Vdom from './vDom'

class Recorder extends Vdom{

    constructor() {
        super()
        this.initDom = null
        this.actionList = []
        this.observer = null
        this.mouseTimer=0

    }

    start() {
        this.initObserver()
        // 首屏虚拟dom
        this.initDom = this.serialization(document.documentElement)
        this.initDom.width = window.innerWidth
        this.initDom.height = window.innerHeight

        // 鼠标
        window.addEventListener('mousemove',this.observerMouse.bind(this))
        // 输入框
        window.addEventListener('input',this.observerInput.bind(this))
        

    }

    end() {
        this.observer.disconnect()

        // 保存本地
        const recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]')
        recordList.push({
            initDom:this.initDom,
            actionList:this.actionList,
            time:new Date().toLocaleString()
        })
        window.localStorage.setItem('recordList',JSON.stringify(recordList))
        this.reset()

    }
    reset(){
        this.id = 1;
        this.idMap.clear()
        this.initDom = undefined,
        this.actionList = []
    }
    initObserver() {
        this.observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                const { type, target, attributeName, addedNodes, removedNodes } = mutation;
                const targetNode = target
                // console.log(mutation)
                switch (type) {
                    case 'attributes':
                        const value = targetNode.getAttribute(attributeName)
                        // 这个value-----暂时留着
                        this.setAction(targetNode, {
                            type: this.ActionType.ACTION_TYPE_ATTRIBUTE
                        })
                        break;
                    case 'childList':
                       
                        this.setAction(targetNode, {
                            type: this.ActionType.ACTION_TYPE_ELEMENT,
                            addedNodes: [...addedNodes].map(el => this.serialization(el)),
                            removedNodes: [...removedNodes].map(el => this.serialization(el))
                        })
                        break;
                    case 'characterData':
                        this.setAction(targetNode.parentNode, {
                            type: this.ActionType.ACTION_TYPE_TEXT,
                            newText: targetNode.parentNode.textContent
                        })
                        break;
                }
            }
        })
        this.observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
        })
    }
    observerMouse(e){
        // 节流的
        if(Date.now() - this.mouseTimer>100){
            this.mouseTimer = Date.now()
            this.setAction(document.body,{
                type:this.ActionType.ACTION_TYPE_MOUSE,
                timestamp:Date.now(),
                pageX:e.clientX,
                pageY:e.clientY
            })
        }
    }
    observerInput(e){
        this.setAction(e.target,{
            type:this.ActionType.ACTION_TYPE_INPUT,
            inputValue:e.target.value
        })
    }

    setAction(element, otherParam) {
        const id = this.idMap.get(element)
        const action = Object.assign(this.parseElement(element,id),{timestamp:Date.now()},otherParam)
        this.actionList.push(action)
        // console.log(this.actionList)

    }
   



}

export default  new Recorder()