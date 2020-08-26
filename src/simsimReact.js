import { h } from "snabbdom/build/package/h";
import simsimReactDom from "./simsimReactDom";

class Component {
	constructor() {}

	componentDidMount() {}

	setState(partialState) {
		this.state = {
			...this.state,
			...partialState,
		};
		simsimReactDom.__updater(this);
	}

	render() {}
}

Component.prototype.isSimsimReactClassComponent = true; // 클래스형 컴포넌트와 함수형 컴포넌트를 구분하기 위해 static 속성을 추가합니다.

const simsimReact = {
	createElement: (type, props = {}, ...children) => {
		if (type.prototype && type.prototype.isSimsimReactClassComponent) {
			const componentInstance = new type(props);
			componentInstance.__vNode = componentInstance.render();
			return componentInstance.__vNode;
		}

		if (typeof type === "function") {
			return type(props);
		}

		return h(type, { props }, children);
	},
	Component,
};

export default simsimReact;
