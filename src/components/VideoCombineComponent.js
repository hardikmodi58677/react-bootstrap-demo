import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
const regex = new RegExp(/.mp4$/)

export function VideoCombineComponent() {
	const [videosData, setVideosData] = useState([])
	const [isBtnDisabled, setIsBtnDisabled] = useState(true)

	const [resultVideo, setResultVideo] = useState("")
	const [videoHeight, setVideoHeight] = useState("")
	const [videoWidth, setVideoWidth] = useState("")
	// Api call

	const handleUpdateVideo = (e, index) => {
		const { name, value } = e.target
		const video = videosData[index]
		const updatedVideo = {
			...video,
			[name]: value,
		}
		setVideosData((videosData) => {
			return videosData.map((video, videoIndex) => {
				if (videoIndex === index) {
					return updatedVideo
				}
				return video
			})
		})
	}

	const handleAddVideo = () => {
		console.log("handle add video called")
		setVideosData((videosData) => {
			return [...videosData, { videoUrl: "", startDuration: "", endDuration: "" }]
		})
	}

	const handleDeleteVideo = (index) => {
		console.log("handle delete video called")
		setVideosData((videosData) => {
			return videosData.filter((video, videoIndex) => videoIndex !== index)
		})
	}

	useEffect(() => {
		const isDurationValid = videosData.every((video) => {
			return video.startDuration < video.endDuration
		})
		const isVideoUrlValid = videosData.every((video) => {
			return !!video.videoUrl && regex.test(video.videoUrl)
		})

		console.log({ isDurationValid, isVideoUrlValid })

		if (videosData.length && isDurationValid && isVideoUrlValid) {
			setIsBtnDisabled(false)
		} else {
			setIsBtnDisabled(true)
		}
	}, [videosData])

	const handleCombineVideos = useCallback(async () => {
		const apiUrl = process.env.REACT_APP_API_URL
		const result = await fetch(`${apiUrl}/api/combine-video`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				segments: videosData.map((video) => ({
					video_url: video.videoUrl,
					start: +video.startDuration,
					end: +video.endDuration,
				})),
				width: +videoWidth,
				height: +videoHeight,
			}),
		})
		const data = await result.json()
		setResultVideo(data.url)
	}, [videoHeight, videoWidth, videosData])

	return (
		<Container>
			<section>
				<h1>Combine Video</h1>
				<Form>
					<Button variant="primary" type="button" onClick={handleAddVideo} className="mt-3 mb-3 add-video">
						Add video
					</Button>

					<Container>
						{!!videosData.length &&
							videosData.map((video, index) => (
								<>
									<Row className="mb-2">
										<Col>
											<Form.Group key={video.videoUrl} controlId="combineVideos">
												<Form.Control
													className={`combine-video-${index + 1}`}
													type="text"
													name="videoUrl"
													placeholder="Enter video link"
													value={video.videoUrl}
													onChange={(e) => handleUpdateVideo(e, index)}
												/>
											</Form.Group>
										</Col>

										<Col>
											<Form.Group key={video.videoUrl} controlId="combineVideos">
												<Form.Control
													className={`combine-video-range-duration-start-${index + 1}`}
													type="numeric"
													name="startDuration"
													placeholder="Start duration(in seconds)"
													value={video.startDuration}
													onChange={(e) => handleUpdateVideo(e, index)}
												/>
											</Form.Group>
										</Col>

										<Col>
											<Form.Group key={video.videoUrl} controlId="combineVideos">
												<Form.Control
													className={`combine-video-range-duration-end-${index + 1}`}
													type="numeric"
													name="endDuration"
													placeholder="End duration(in seconds)"
													value={video.endDuration}
													onChange={(e) => handleUpdateVideo(e, index)}
												/>
											</Form.Group>
										</Col>

										<Col>
											<Button
												variant="secondary	"
												type="button"
												onClick={() => {
													handleDeleteVideo(index)
												}}
												className={`delete-combine-video-range-duration-${index + 1}`}
											>
												Delete
											</Button>
										</Col>
									</Row>
								</>
							))}
						{!!videosData.length && (
							<Row>
								<Col>
									<Form.Group key={"video-height"} controlId="combineVideos">
										<Form.Control
											className={`video-height`}
											type="numeric"
											placeholder="Enter Video Height"
											value={videoHeight}
											onChange={(e) => setVideoHeight(e.target.value)}
										/>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group key={`video-width`} controlId="combineVideos">
										<Form.Control
											className={`video-width`}
											type="numeric"
											placeholder="Enter Video Width"
											value={videoWidth}
											onChange={(e) => setVideoWidth(e.target.value)}
										/>
									</Form.Group>
								</Col>
							</Row>
						)}
					</Container>
					<br />
					<Button
						variant="primary"
						type="button"
						onClick={handleCombineVideos}
						className="mt-2 combine-video"
						disabled={isBtnDisabled}
					>
						Combine Video(s)
					</Button>
				</Form>

				{resultVideo && (
					<video width={320} height={240} key={resultVideo?.video_url || ""} className={`combined-video`} controls>
						<source className={`combined-video-source`} src={resultVideo?.video_url || ""} type="video/mp4" />
					</video>
				)}
			</section>
			{/* Code for combining videos */}
		</Container>
	)
}
