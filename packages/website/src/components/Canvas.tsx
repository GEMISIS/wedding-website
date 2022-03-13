import { cleanup } from '@testing-library/react';
import { useEffect, useRef } from 'react';

export enum CanvasType {
  CameraFeed,
  UploadedImage
}

export interface CanvasProps {
  canvasType: CanvasType;
  className?: string;
}

export function Canvas(props: CanvasProps) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const showCamera = props.canvasType === CanvasType.CameraFeed;

  useEffect(() => {
    if (canvasRef.current !== null) {
      const context = (canvasRef.current as HTMLCanvasElement).getContext('2d');
      if (context !== null) {
        context.fillStyle = '#FF0000'
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        context.fillStyle = '#000000'
        context.beginPath()
        context.arc(50, 100, 20, 0, 2 * Math.PI)
        context.fill()
      }
    }

    if (videoRef.current !== null) {
      const video = videoRef.current as HTMLVideoElement;

      navigator.mediaDevices.getUserMedia({
        video: {}
      }).then((stream: MediaStream) => {
        video.srcObject = stream;
      });

      return () => {
        if (video.srcObject !== null && video.srcObject instanceof MediaStream) {
          (video.srcObject as MediaStream).getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
      }
    }
  }, [videoRef, canvasRef, props.canvasType]);

  return (
    <div>
      {showCamera
      ? <video autoPlay ref={videoRef} className={props.className} />
        : <canvas ref={canvasRef} className={props.className} />}
    </div>
  )

}