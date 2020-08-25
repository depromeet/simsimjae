import { h } from 'snabbdom/build/package/h';

const simsimReact = {
	createElement: (type, props = {}, ...children) => {
		return h(type, { props }, children);
	},
};

export default simsimReact;
