import simsimReact from "./simsimReact";

class Counter extends simsimReact.Component {
	constructor(props) {
		super(props);

		this.state = {
			count: 0,
		};
	}

	componentDidMount() {
		console.log("카운터 컴포넌트가 마운트 되었습니다.");
	}

	render() {
		return (
			<div>
				<p>Count: {this.state.count}</p>
				<button
					onClick={() =>
						this.setState({
							count: this.state.count + 1,
						})
					}
				>
					Increment
				</button>
			</div>
		);
	}
}

export default Counter;
