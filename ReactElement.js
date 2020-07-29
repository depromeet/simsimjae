const __DEV__ = true;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true,
};

/**
 * current owner란 현재 생성되고 있는 컴포넌트를 소유하고 있는 컴포넌트를 의미합니다.
 */
const ReactCurrentOwner = {
  current: null,
};

const REACT_ELEMENT_TYPE = Symbol.for("react.element");

function ReactElement(type, key, ref, self, source, owner, props) {
  const element = {
    // XSS 공격을 막기 위한 공유 심볼 (https://simsimjae.tistory.com/466)
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element. ()
    _owner: owner,
  };
  return element;
}

function hasValidRef(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, "ref")) {
      const getter = Object.getOwnPropertyDescriptor(config, "ref").get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (__DEV__) {
    if (hasOwnProperty.call(config, "key")) {
      const getter = Object.getOwnPropertyDescriptor(config, "key").get;
      // config 내부에는 key라는 property가 들어있다.
      // 이 key라는 property는 propertyDescriptor에 getter 함수를 갖고 있는데,
      // 이 getter에 isReactWarning이라고 하는 boolean변수가 true가 되어있는 경우엔 (리액트 라이브러리의 다른 어떤 부분에서 조건에 따라 참/거짓이 세팅될듯)
      // 유효하지 않은 키로 판단한다.
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

export function createElement(type, config, children) {
  let propName;

  // parameter의 config는 정규화 되지 않은 props
  // 아래에 선언된 props는 정규화 된 props만 모을 객체
  const props = {};

  // 예약된 props들
  let key = null;
  let ref = null;
  let self = null;
  let source = null;

  // 1. props 정규화
  if (config != null) {
    if (hasValidKey(config)) {
      key = "" + config.key;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
    }
    // self = config.__self === undefined ? null : config.__self;
    // source = config.__source === undefined ? null : config.__source;

    // React.createElement(type, props, children) 중 props에 전달된 객체의 property 중에서 예약된 props(key, ref, __self, __source)를 제거해주는 부분.
    for (propName in config) {
      // config 객체의 enumerable한 property를 순회
      if (
        hasOwnProperty.call(config, propName) && // 객체 자기 자신의 propName이며
        !RESERVED_PROPS.hasOwnProperty(propName) // propName이 예약어가 아닌 것들만
      ) {
        props[propName] = config[propName]; // 추려서 props객체에 넣음.
      }
    }
  }

  /**
   * 컴포넌트의 JSX가 <Parent x="y">asdf{a}qwer</Parent>인 경우
   * React.createElement(Parent, {x: 'y'}, 'asdf', a, 'qwer')
   * 2번쨰 인자부터 children을 나타냄.
   */
  const childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children; // 단일 자식인경우
  } else if (childrenLength > 1) {
    const childArray = Array(childrenLength);
    for (let i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray; // React.createElement의 3번째 인자로 넘어온 children을 props의 children으로 넣어줌.
  }

  /* 
	Component.defaultProps = {
		children: 'hello, world!';
	};
	와 같이 defaultProps를 넘기곤하는데 컴포넌트의 이름이 type으로 넘어옴.
  */
  if (type && type.defaultProps) {
    const defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      // props에 없는 기본값이면
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  /**
   * ReactCurrentOwner (https://bit.ly/3jloBNv)
   * 렌더링 되기 직전에 현재 컴포넌트로 설정됨.
   */
  return ReactElement(
    type,
    key,
    ref,
    self,
    source,
    ReactCurrentOwner.current,
    props
  );
}
