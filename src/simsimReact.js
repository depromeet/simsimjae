const simsimReact = {
	createElement: (type, props = {}, ...children) => {
		console.log(type, props, children);
	},
};

export default simsimReact;
