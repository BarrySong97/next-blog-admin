import React, { FC } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
export interface ImageViewerProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  viewerWidth?: string;
  viewerHeight?: string;
}
const ImageViewer: FC<ImageViewerProps> = ({
  src,
  className = "",
  style,
  viewerHeight,
  viewerWidth = 720,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img src={src} style={style} className={className}></img>
      </DialogTrigger>
      <DialogContent
        className="p-0"
        style={{
          width: viewerWidth,
        }}
      >
        <img
          src={src}
          style={{
            width: 600,
          }}
          className={"w-full object-cover"}
        ></img>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;
