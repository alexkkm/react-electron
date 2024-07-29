import "./darktheme.css";

const MessageBoard = (parameters) => {
	return (
		<div class="darkThemePage">
			<div class="messageBoard">
				<div class="pad">
					<div class="pad__body">
						<h4 class="text-heading3 undefined">{parameters.title}</h4>
						{parameters.textList.map((text) => {
							return <p>{text}</p>;
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

const DarkThemePage = () => {
	return (
		<div>
			<MessageBoard
				title="Testing Title"
				textList={[
					"It is the first paragraph of the message",
					"Then it is the 2nd line",
				]}
			/>
		</div>
	);
};

export default DarkThemePage;
