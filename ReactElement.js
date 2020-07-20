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

// const hasValidRef = (config) => {
//   if (__DEV__) {
//     if (hasOwnProperty.call(config, "ref")) {
//       const getter = Object.getOwnPropertyDescriptor(config, "ref").get;
//       if (getter && getter.isReactWarning) {
//         return false;
//       }
//     }
//   }
//   return config.ref !== undefined;
// };

// const hasValidKey = (config) => {
//   if (__DEV__) {
//     if (hasOwnProperty.call(config, "key")) {
//       const getter = Object.getOwnPropertyDescriptor(config, "key").get;
//       if (getter && getter.isReactWarning) {
//         return false;
//       }
//     }
//   }
//   return config.key !== undefined;
// };

const REACT_ELEMENT_TYPE = Symbol("react.element");

const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    // XSS 공격을 막기 위한 공유 심볼 (https://simsimjae.tistory.com/466)
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // 이 엘리먼트를 생성한 컴포넌트를 기록 (https://www.sderosiaux.com/articles/2015/02/10/ownership-and-children-in-reactjs/)
    _owner: owner,
  };

  if (__DEV__) {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    // element._store = {};

    // // To make comparing ReactElements easier for testing purposes, we make
    // // the validation flag non-enumerable (where possible, which should
    // // include every environment we run tests in), so the test framework
    // // ignores it.
    // Object.defineProperty(element._store, "validated", {
    //   configurable: false,
    //   enumerable: false,
    //   writable: true,
    //   value: false,
    // });
    // // self and source are DEV only properties.
    // Object.defineProperty(element, "_self", {
    //   configurable: false,
    //   enumerable: false,
    //   writable: false,
    //   value: self,
    // });
    // // Two elements created in two different places should be considered
    // // equal for testing purposes and therefore we hide it from enumeration.
    // Object.defineProperty(element, "_source", {
    //   configurable: false,
    //   enumerable: false,
    //   writable: false,
    //   value: source,
    // });
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

const createElement = (type, config, children) => {
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
    // if (hasValidRef(config)) {
    //   ref = config.ref;

    //   if (__DEV__) {
    //     warnIfStringRefCannotBeAutoConverted(config);
    //   }
    // }
    // if (hasValidKey(config)) {
    //   key = "" + config.key;
    // }

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
    if (__DEV__) {
      if (Object.freeze) {
        Object.freeze(childArray); // 배열 수정 불가
      }
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

  //   if (__DEV__) {
  //     if (key || ref) {
  //       const displayName =
  //         typeof type === "function"
  //           ? type.displayName || type.name || "Unknown"
  //           : type;
  //       if (key) {
  //         defineKeyPropWarningGetter(props, displayName);
  //       }
  //       if (ref) {
  //         defineRefPropWarningGetter(props, displayName);
  //       }
  //     }
  //   }

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
};
