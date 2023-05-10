import { Button, Container, Form } from "react-bootstrap"
import { useCallback, useEffect, useState } from "react"

export function VideoSegmentComponent() {
	const [isBtnDisabled, setIsBtnDisabled] = useState(true)
	const [videoLink, setVideoLink] = useState("")
	const [videoDuration, setVideoDuration] = useState("")
	const [selectedSegmentSetting, setSelectedSegmentSetting] = useState("")
	const [videoSources] = useState([])

	// Api call
	const handleSegmentVideo = useCallback(async () => {
		const apiUrl = process.env.REACT_APP_API_URL
		try {
			const result = await fetch(`${apiUrl}/api/process-interval`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					video_link: videoLink,
					interval_duration: +videoDuration,
				}),
			})

			const data = await result.json()
			console.log(data)
		} catch (err) {
			console.error(err)
			alert("Something went wrong. Please try again later.")
		}

		// Reset form
		setVideoLink("")
		setVideoDuration(0)
		setSelectedSegmentSetting("")
	}, [videoLink, videoDuration])

	useEffect(() => {
		// Regex check to check if video link ends with .mp4
		const regex = new RegExp(/.mp4$/)
		if (regex.test(videoLink) && selectedSegmentSetting && videoDuration) {
			setIsBtnDisabled(false)
			return
		}
		setIsBtnDisabled(true)
	}, [videoLink, selectedSegmentSetting, videoDuration])

	const handleVideoLinkChange = (e) => {
		setVideoLink(e.target.value)
		setIsBtnDisabled(!e.target.value || !selectedSegmentSetting || !videoDuration)
	}

	const handleSegmentSettingChange = (e) => {
		setSelectedSegmentSetting(e.target.value)
		setIsBtnDisabled(!e.target.value || !videoLink || !videoDuration)
	}

	const handleChangeVideoDuration = (e) => {
		setVideoDuration(e.target.value)
		console.log(e.target.value)
		setIsBtnDisabled(!e.target.value || !videoLink || !selectedSegmentSetting)
	}

	return (
		<Container>
			<section>
				<h1>Segment Video</h1>
				<Form>
					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Video Link</Form.Label>
						<Form.Control
							className="video-link"
							type="text"
							placeholder="Enter Video Link"
							value={videoLink}
							onChange={handleVideoLinkChange}
						/>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label>Select segment</Form.Label>
						<Form.Select
							value={selectedSegmentSetting}
							onChange={handleSegmentSettingChange}
							aria-label="Select segment settings"
							className="segment-setting"
							placeholder="Select Segment Settings"
						>
							<option value="" disabled>
								Select Segment Settings
							</option>
							<option value="Interval-Duration">Interval Duration</option>
						</Form.Select>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicEmail">
						<Form.Label>Interval Duration(in seconds)</Form.Label>
						<Form.Control
							className="interval-duration"
							type="numeric"
							value={videoDuration}
							onChange={handleChangeVideoDuration}
							placeholder="Enter interval duration"
						/>
					</Form.Group>

					<Button
						variant="primary"
						type="button"
						onClick={handleSegmentVideo}
						className="mt-2 process-video"
						disabled={isBtnDisabled}
					>
						Segment Video
					</Button>
				</Form>
			</section>{" "}
			<section className="mt-3">
				<div className="video-wrapper d-flex justify-content-around">
					{videoSources.length
						? videoSources.map(({ video_url: videoUrl }, index) => {
								return (
									<video width={320} height={240} key={videoUrl} className={`segmented-video-${index + 1}`} controls>
										<source className={`segmented-video-source-${index}`} src={videoUrl} type="video/mp4" />
									</video>
								)
						  })
						: null}
				</div>
			</section>
			{/* Code for combining videos */}
		</Container>
	)
}
