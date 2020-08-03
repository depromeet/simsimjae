import { createElement } from "./ReactElement.js";
import ReactDOM from "./ReactDOM.js";

const firstChildComponent = () => {
  return createElement(
    "div",
    { className: "first-child" },
    createElement("TEXT_ELEMENT", null, "첫번째 자식")
  );
};

const secondChildComponent = () => {
  return createElement(
    "div",
    { className: "second-child" },
    createElement("TEXT_ELEMENT", null, "두번째 자식")
  );
};

const parentComponent = () => {
  return createElement(
    "div",
    { className: "parent", style: "border: 1px solid black" },
    firstChildComponent,
    secondChildComponent
  );
};

ReactDOM.render(
  createElement(parentComponent, null),
  document.getElementById("root")
);
