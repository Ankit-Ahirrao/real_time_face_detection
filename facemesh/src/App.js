import React, { useRef, useEffect } from "react";
import "./App.css";

import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const runFacemesh = async () => {
    
      await tf.setBackend("webgl");
      await tf.ready();

      const net = await facemesh.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });

      setInterval(() => {
        detect(net);
      }, 100);
    };

    runFacemesh();
  }, []);

  const detect = async (net) => {
    if (
      webcamRef.current &&
      webcamRef.current.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      video.width = videoWidth;
      video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });
    }
  };

  return (
    <div className="App">
      <Webcam
  ref={webcamRef}
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9,
  }}
  width={640}
  height={480}
/>

      <canvas
  ref={canvasRef}
  style={{
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9,
  }}
/>
    </div>
  );
}

export default App;
