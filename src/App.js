import "./App.css"
import { Container } from "react-bootstrap"
import { VideoCombineComponent, VideoSegmentComponent } from "./components"

function App() {
	return (
		<Container>
			<VideoSegmentComponent />
			<VideoCombineComponent />
		</Container>
	)
}

export default App
