import electronLogo from "./assets/electron.svg";
import Versions from "./components/Versions";

import "../assets/defaultPage.css";

const DefaultPage = () => {
	const ipcHandle = () => window.electron.ipcRenderer.send("ping");

	return (
		<>
			<img
				alt="logo"
				className="logo"
				src={electronLogo}
			/>
			<div className="creator">Powered by electron-vite</div>
			<div className="text">
				Build an Electron app with <span className="react">React</span>
			</div>
			<p className="tip">
				Please try pressing <code>F12</code> to open the devTool
			</p>
			<div className="actions">
				<div className="action">
					<a
						href="https://electron-vite.org/"
						target="_blank"
						rel="noreferrer">
						Documentation
					</a>
				</div>
				<div className="action">
					<a
						target="_blank"
						rel="noreferrer"
						onClick={ipcHandle}>
						Send IPC
					</a>
					<a
						onClick={() => {
							console.log("hi");
						}}>
						Hi
					</a>
				</div>
			</div>
			<Versions></Versions>
		</>
	);
};

export default DefaultPage;
