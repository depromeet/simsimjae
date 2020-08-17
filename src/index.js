import { createElement } from "./ReactElement.js";
import ReactDOM from "./ReactDOM.js";

const virtualDOM = {
  type: "div",
  props: {
    id: "id1",
    className: "abc",
    children: {
      type: "div",
      props: {
        className: "child",
        onClick: () => {
          ReactDOM.render(anotherVirtualDOM, document.getElementById("root"));
        },
        children: {
          type: "TEXT_ELEMENT",
          props: {
            children: "첫번째 virtualDOM, 이 텍스트를 클릭시 state가 변경되어 리렌더링이 일어난다고 가정합니다.",
          },
        },
      },
    },
  },
};

const anotherVirtualDOM = {
  type: "div",
  props: {
    id: "id2",
    className: "xyz abc",
    children: {
      type: "p",
      props: {
        className: "child",
        children: {
          type: "TEXT_ELEMENT",
          props: {
            children: "변경된 virtualDOM",
          },
        },
      },
    },
  },
};

ReactDOM.render(virtualDOM, document.getElementById("root"));
