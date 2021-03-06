import simsimReact from "./simsimReact";
import simsimReactDom from "./simsimReactDom";
import Counter from "./counter";

const App = (
	<div>
		<h1 className="primary">simsimreact</h1>
		<p>100줄 이하의 자바스크립트로 리액트 코어를 클론해봅시다.</p>
		<Counter />
	</div>
);

simsimReactDom.render(App, document.getElementById("root"));
