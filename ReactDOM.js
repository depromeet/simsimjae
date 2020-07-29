import { isValidHTMLTag } from "./HtmlTagNames";

const isFuntionalElement = (element) => typeof element.type === "function";
const isTextElement = (element) => element.type === "TEXT_ELEMENT";

const toArray = (arg) => {
  if (!Array.isArray(arg)) return (arg = [arg]);
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
  ReactDOM.render(createdElement, container);
};

const parseTextElement = (element, container) => {
  const textNode = document.createTextNode(element.props.children);
  container.appendChild(textNode);
};

const ReactDOM = {
  render: (element, container) => {
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

    element.props.children = toArray(element.props.children);

    const subContainer = document.createElement(element.type); // <div></div>
    container.appendChild(subContainer);

    if (element.props.children && Array.isArray(element.props.children)) {
      element.props.children.map((child) => {
        ReactDOM.render(child, subContainer);
      });
      return;
    }
  },
};

export default ReactDOM;
