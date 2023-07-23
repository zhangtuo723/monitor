import tracker from "../utils/tracker";
import onload from "../utils/onload";
export function blankScreen() {
    let wrapperElements = ['html', 'body', '#container', '#root', '.content']
    let emptyPoints = 0
    function isWrapper(element) { 
        let selector = getSelector(element)
        if (wrapperElements.includes(selector)) { 
            emptyPoints++
        }
        
    }
    function getSelector(element) { 
        const { id, className, nodeName } = element
        if (id) {
            return '#' + id
        } else if (className) {
            return '.' + className.split(' ').filter(v => !!v).join('.')
        } else { 
            return nodeName.toLowerCase()
        }
    }

    onload(function () {
        let xElements, yElements;
        for (let i = 0; i < 9; i++) {
            xElements = document.elementsFromPoint((window.innerWidth * i) / 10, window.innerHeight / 2)
            yElements = document.elementsFromPoint(window.innerWidth / 2, (window.innerHeight * i) / 10)
            isWrapper(xElements[0])
            isWrapper(yElements[0])  
        }
        if (emptyPoints >= 0) { 
            tracker.send({
                kind: 'stability',
                type: 'blank',
                emptyPoints: emptyPoints + '',
                screen: window.screen.width + "X" + window.screen.height,
                viewPoint: window.innerWidth + "X" + window.innerHeight,
            })
        }
    })
}