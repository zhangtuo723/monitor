class Vdom {
  constructor() {
    this.id = 1;
    this.idMap = new Map();

    this.ActionType = {
      ACTION_TYPE_ATTRIBUTE: 1, // 修改元素属性
      ACTION_TYPE_ELEMENT: 2, // 元素增减
      ACTION_TYPE_TEXT: 3, // 文本变化
      ACTION_TYPE_MOUSE: 4, // 鼠标
      ACTION_TYPE_INPUT: 5, // 输入框
    };
  }
  serialization(parent) {
    let element = this.parseElement(parent);
      if (parent instanceof HTMLInputElement) {
        parent.value && (element.value = parent.value);
      }
     
    Array.from(parent.childNodes??[], (child) => {
      if(this.serialization(child))
      element.children.push(this.serialization(child));
    });
    return element;
  }
  getNewID() {
    return this.id++;
  }

  parseElement(element, id) {
    if(element.nodeType>3)return
    let attributes = {};
    if(element.attributes){
      for (const { name, value } of Array.from(element.attributes)) {
        attributes[name] = value;
      }
    }
    
    if (!id) {
      //解析新元素才做映射
      id = this.getNewID();
      // console.log("getID", element, id);
      this.idMap.set(element, id); //元素为键，ID为值
    }
    // if(element.nodeName == '#text'){
    //   return {
    //     children: [],
    //     id: id,
    //     tagName: element.nodeName.toLowerCase(),
    //     attributes: attributes,
    //     textContent:element.textContent
    //   };

    // }
    return {
      children: [],
      id: id,
      tagName: element.nodeName.toLowerCase(),
      attributes: attributes,
      nodeType:element.nodeType,
      textContent:element.nodeType>=3?element.textContent:''
    };
  }
  isFilterNode(el) {
    return ["SCRIPT",'script'].includes(el.tagName);
  }
  deSerialization(obj) {
    
    let element = this.createElement(obj);
    if(obj.children.length!=0){
      obj.children.forEach((child) => {
        const el = this.deSerialization(child);
        if (!this.isFilterNode(el)) {
          element.appendChild(el);
        }
      });
    }
    
    return element;
    
  }
  createElement(obj,deep=false) {
    
    // let element =obj.tagName==='#text'? document.createTextNode(obj.textContent):document.createElement(obj.tagName)
    let element;
    if(obj.nodeType<3){
      element = document.createElement(obj.tagName)
    }
    if(obj.nodeType==3){
      element = document.createTextNode(obj.textContent)
    }
    // if(!element){
    //   element = document.createElement(obj.tagName.slice(1))
    // }
    if (obj.id) {
      this.idMap.set(obj.id, element); //ID为键，元素为值
    }
    for (const name in obj.attributes) {
      element.setAttribute(name, obj.attributes[name]);
    }
    // obj.textContent && (element.textContent = obj.textContent);
    if (element instanceof HTMLInputElement) {
      obj.value && (element.value = obj.value);
    }

    if(deep){
      console.log(obj.children,'xxxxxxxxxxxxxxxxdddddsss');
      if(obj.children.length>0){
        obj.children.forEach(child=>{
          element.appendChild(this.createElement(child),true)
        })
      }

    }

    return element;
  }
}

export default Vdom;
