import { init } from "snabbdom/build/package/init";
import { propsModule } from "snabbdom/build/package/modules/props";

const reconcile = init([propsModule]);

const simsimReactDom = {
	render: (virtualDom, realDom) => {
		reconcile(realDom, virtualDom);
	},
	__updater: (componentInstance) => {
		const oldVNode = componentInstance.__vNode;
		const newVNode = componentInstance.render();

		componentInstance.__vNode = reconcile(oldVNode, newVNode);
	},
};

export default simsimReactDom;
