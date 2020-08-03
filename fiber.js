let fiber = {
	// HOST_COMPONENT(DOM NODE), HOST_ROOT(ROOT DOM_NODE), CLASS_COMPONENT
	tag: HOST_COMPONENT,
	type: "div",
	// fiber는 부모 자식 형제에 대한 참조를 가지고 있다. (연결리스트)
	parent: parentFiber,
	child: childFiber,
	sibling: null,
	// fiber는 작업중 fiber와 현재 fiber 2가지 종류가 있다.
	// 현재 fiber는 작업중 fiber의 작업이 완료되면 대체된다.
	// 따라서 현재 fiber와 작업중 fiber는 같은 tag, type, stateNode를 공유한다.
	alternate: currentFiber,
	// fiber와 1:1로 대응하는 DOM element 또는 클래스 인스턴스 (메모리에 올라가있는 Node)
	stateNode: document.createElement("div"),
	props: { children: [], className: "foo" },
	partialState: null,
	// 해당 fiber에 어떤 side effect가 필요한지? PLACEMENT, UPDATE, DELETE
	effectTag: PLACEMENT,
	// 하위 트리의 모든 effectTag를 수집.
	effects: [],
};
