const ENOUGH_TIME = 1; // milliseconds

function getRoot(fiber) {
	let node = fiber;
	while (node.parent) {
		node = node.parent;
	}
	return node;
}

// 다음 작업 단위 재설정
function resetNextUnitOfWork() {
	const update = updateQueue.shift();
	if (!update) {
		return;
	}

	// 업데이트 페이로드에서 해당 파이버로 setState 매개 변수 복사
	if (update.partialState) {
		update.instance.__fiber.partialState = update.partialState;
	}

	const root = update.from === HOST_ROOT ? update.dom._rootContainerFiber : getRoot(update.instance.__fiber);

	nextUnitOfWork = {
		tag: HOST_ROOT,
		stateNode: update.dom || root.stateNode,
		props: update.newProps || root.props,
		alternate: root,
	};
}

// 데드라인까지 작업을 수행하고 그 다음 작업을 스케쥴링
function performWork(deadline) {
	workLoop(deadline);
	if (nextUnitOfWork || updateQueue.length > 0) {
		requestIdleCallback(performWork);
	}
}

// 데드라인까지 계속 작업을 수행함.
// 데드라인은 브라우저가 제공하는 가이드이기 떄문에 약간은 초과해도 상관없다.
function workLoop(deadline) {
	if (!nextUnitOfWork) {
		resetNextUnitOfWork();
	}
	while (nextUnitOfWork && deadline.timeRemaining() > ENOUGH_TIME) {
		nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
	}
	if (pendingCommit) {
		commitAllWork(pendingCommit);
	}
}
