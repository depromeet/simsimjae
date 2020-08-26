import simsimReact from "./simsimReact";

class Counter extends simsimReact.Component {
	constructor(props) {
		super(props);

		this.state = {
			count: 0,
		};

		setInterval(() => {
			this.setState({
				count: this.state.count + 1,
			});
		}, 1000);
	}

	componentDidMount() {
		console.log("카운터 컴포넌트가 마운트 되었습니다.");
	}

	render() {
		return <p>Count: {this.state.count}</p>;
	}
}

export default Counter;
