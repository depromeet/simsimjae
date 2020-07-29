import { createElement } from "./ReactElement.js";
import ReactDOM from "./ReactDOM.js";
// const Component = () => {
//   return <span className="2depth">hello, depromeet!</span>;
// };

// const Depromeet = () => {
//   return (
//     <div>
//       <span className="1depth">
//         <Component />
//       </span>
//       <span className="1depth">1depth-child</span>
//     </div>
//   );
// };

const Component = () => {
  return createElement(
    "span",
    {
      className: "2depth",
    },
    createElement("TEXT_ELEMENT", null, "hello, depromeet!")
  );
};

const Depromeet = () => {
  return createElement(
    "div",
    null,
    createElement(
      "p",
      {
        key: 1,
        className: "1depth",
      },
      createElement(Component, null)
    ),
    createElement(
      "p",
      { key: 2, className: "1depth" },
      createElement("TEXT_ELEMENT", null, "this is children")
    )
  );
};

ReactDOM.render(
  createElement(Depromeet, null),
  document.getElementById("root")
);
