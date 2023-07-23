import Vdom from "./vDom";

class Replayer extends Vdom {
  constructor() {
    super();
    this.initDom = null;
    this.actionList = null;
  }
  replay() {
    if (this.actionList.length === 0) return;
    const timerOffset = 16.7;
    let startTime = this.actionList[0].timestamp;
    let appMouse = null;
    const state = () => {
      const action = this.actionList[0];
      let target = this.idMap.get(action.id);
      console.log(this.idMap, "idmapssss");
      if (!target) {
        console.error("找不到元素id", action.id);
        return;
      }
      let element = target;

      // 控制回放速度，太快的话需要等这startTime加载完成才行
      if (startTime >= action.timestamp) {
        this.actionList.shift();
        switch (action.type) {
          // 节点数量
          case this.ActionType.ACTION_TYPE_ELEMENT:
            // console.log(element);
            action.addedNodes.forEach((ch) => {
              let el = this.createElement(ch, true);
              element.appendChild(el);
            });
            action.removedNodes.forEach((id) => {
              let el = this.idMap.get(id);
              element.removeChild(el);
            });
            break;
          // 属性
          case this.ActionType.ACTION_TYPE_ATTRIBUTE:
            for (const name in action.attributes) {
              element.setAttribute(name, action.attributes[name]);
            }
            break;
          // 文本变化
          case this.ActionType.ACTION_TYPE_TEXT:
            element.textContent = action.newText;
            break;
          case this.ActionType.ACTION_TYPE_MOUSE:
            if (!appMouse) {
              appMouse = element.querySelector(".app-mouse");
              // appMouse.classList.add('active')
            }
            appMouse.style.transform = `translate(${action.pageX}px,${action.pageY}px)`;
            break;
          case this.ActionType.ACTION_TYPE_INPUT:
            element.value = action.inputValue;
            break;
        }
      }

      startTime += timerOffset;
      if (this.actionList.length > 0) {
        requestAnimationFrame(state);
      } else {
        console.log("重放结束");
      }
    };
    state();
  }
  init(initDom, actionList) {
    this.initDom = initDom;
    this.actionList = actionList;
    // document.body.appendChild(html)
    this.createIframe().then(() => {
      this.replay();
    });
  }

  createIframe() {
    return new Promise((resolve, reject) => {
      let iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-same-origin");
      //   iframe.setAttribute("scrolling", "no");
      iframe.setAttribute(
        "style",
        "border:0;position:fixed;top:100px;left:0;background:pink;"
      );
      iframe.setAttribute("id", "replay-iframe");

      // iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');

      iframe.width = `${this.initDom.width}px`;
      iframe.height = `${this.initDom.height}px`;

      iframe.onload = () => {
        const doc = iframe.contentDocument;
        const root = doc.documentElement;
        // 反序列化，虚拟dom转真实dom
        const html = this.deSerialization(this.initDom);
        for (const { name, value } of Array.from(html.attributes)) {
          root.setAttribute(name, value);
        }
        root.removeChild(root.firstElementChild);
        root.removeChild(root.firstElementChild);
        Array.from(html.children).forEach((child) => {
          root.appendChild(child);
        });
        // 添加鼠标
        const mouse = document.createElement("div");
        mouse.className = "app-mouse";
        mouse.style.width = "100px";
        mouse.style.height = "100px";
        mouse.style.background = "red";
        mouse.style.position = "fixed";
        mouse.style.top = "0px";
        mouse.style.left = "0px";
        doc.body.appendChild(mouse);
        resolve();
      };
      document.body.appendChild(iframe);
    });
  }
}

export default new Replayer();
