import { isValidHTMLTag } from "./HtmlTagNames";

const isFuntionalElement = (element) => typeof element.type === "function";
const isTextElement = (element) => element.type === "TEXT_ELEMENT";

const toArray = (arg) => {
  if (!Array.isArray(arg) && arg) return (arg = [arg]);
  else return arg;
};

const validateHTMLTag = (tag) => {
  if (!isValidHTMLTag(tag)) {
    throw new Error(`${tag}은 유효하지 않은 HTML Tag입니다.`);
  }
};

const parseFunctionalElement = (element, container) => {
  const functionalComponent = element.type;
  const createdElement = functionalComponent();
  ReactDOM.renderVirtualDOMToContainer(createdElement, container);
};

const parseTextElement = (element, container) => {
  const textNode = document.createTextNode(element.props.children);
  container.appendChild(textNode);
};

const ReactDOM = {
  currentVirtualDOM: null,
  renderVirtualDOMToContainer: (element, container) => {
    if (isFuntionalElement(element)) {
      parseFunctionalElement(element, container);
      return;
    }
    if (isTextElement(element)) {
      parseTextElement(element, container);
      return;
    }

    try {
      validateHTMLTag(element.type);
    } catch (e) {
      console.error(e.message);
    }

    const subContainer = document.createElement(element.type); // <div></div>
    for (const propName in element.props) {
      if (propName !== "children") {
        // 가상돔의 props들을 리얼돔의 props로 옮김
        if (propName.slice(0, 2) === "on") {
          const eventName = propName.slice(2).toLowerCase();
          subContainer.addEventListener(eventName, element.props[propName]);
          continue;
        }
        subContainer[propName] = element.props[propName];
      }
    }
    container.appendChild(subContainer);

    const childs = toArray(element.props.children);
    if (childs) {
      childs.map((child) => {
        if (typeof child === "function") ReactDOM.renderVirtualDOMToContainer(child(), subContainer);
        else ReactDOM.renderVirtualDOMToContainer(child, subContainer);
      });
    }
  },
  detectTagChanges: (currentVirtualDOM, nextVirtualDOM, node, childIdx = 0) => {
    const differences = [];
    // CASE 1 - 이전 가상돔엔 없었는데 다음 가상돔엔 있는 경우 - 노드를 새로 생성해야함.
    if (!currentVirtualDOM && nextVirtualDOM) {
      differences.push({
        type: "create-node",
        vdom: nextVirtualDOM,
        domContextNode: node,
      });
    }
    // CASE 2 - 이전 가상돔엔 있는데 다음 가상돔엔 없는 경우 - 노드가 제거되어야 함.
    if (currentVirtualDOM && !nextVirtualDOM) {
      differences.push({
        type: "remove-node",
        vdom: nextVirtualDOM,
        domContextNode: node.childNodes[childIdx],
      });
    }

    // 두 가상돔에서 모두 존재하지만 타입이 변경되었거나 텍스트인 경우
    if (currentVirtualDOM && nextVirtualDOM) {
      // CASE 3 - 타입이 변경된 경우
      const areDifferentTypes = typeof currentVirtualDOM === "object" && typeof nextVirtualDOM === "object" && currentVirtualDOM.type !== nextVirtualDOM.type;

      // CASE 4 - 텍스트가 변경된 경우
      const areDifferentStrings = typeof currentVirtualDOM === "string" && typeof nextVirtualDOM === "string" && currentVirtualDOM !== nextVirtualDOM;

      // CASE 5 - props가 변경된 경우, TODO

      if (areDifferentTypes || areDifferentStrings) {
        differences.push({
          type: "replace-node",
          domContextNode: node.childNodes[childIdx],
          vdom: nextVirtualDOM,
        });
      }
    }

    return differences;
  },
  // 두 가상DOM(virtualDOM, anotherVirtualDOM)을 비교해서 변경된 부분을 찾아냄
  virtualDOMDiff: (currentVirtualDOM, nextVirtualDOM, node) => {
    const differences = [];
    differences.push(...ReactDOM.detectTagChanges(currentVirtualDOM, nextVirtualDOM, node));
    return differences;
  },
  // change 객체에 적힌 내용을 해석해서 실제 Real DOM을 업데이트한다.
  updateDOM: (change) => {
    switch (change.type) {
      case "create-node":
        ReactDOM.renderVirtualDOMToContainer(change.vdom, change.domContextNode);
        break;
      case "remove-node":
        change.domContextNode.removeChild(change.node);
        break;
      case "change-prop":
        change.domContextNode.setAttribute(change.prop, change.value);
        break;
      case "remove-prop":
        change.domContextNode.removeAttribute(change.prop);
        break;
      default:
        break;
    }
  },
  render: (nextVirtualDOM, node) => {
    if (!ReactDOM.currentVirtualDOM) {
      node.innnerHTML = null; // 첫번째 렌더링시 컨테이너를 비운다.
    }

    // 두개의 가상DOM을 비교하며 변경사항을 JSON Array 형태로 모은다.
    const changes = ReactDOM.virtualDOMDiff(ReactDOM.currentVirtualDOM, nextVirtualDOM, node);
    // 변경사항들을 순회하면서 Real DOM을 업데이트한다.

    changes.forEach(ReactDOM.updateDOM);
    ReactDOM.currentVirtualDOM = nextVirtualDOM;
  },
};

export default ReactDOM;
