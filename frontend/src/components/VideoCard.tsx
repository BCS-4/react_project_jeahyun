import { FC } from "react";

interface VideoCardProps {
  desc: string;
  title: string;
  video: string;
}

const VideoCard: FC<VideoCardProps> = ({ desc, title, video }) => {
  return (
    <li >
      <video
        autoPlay
        loop
        muted
        playsInline
        // width="100%"
        // height="100%"
        z-10
      >
        <source src={`/images/${video}.mp4`} />
        {/* <div className="h-full flex flex-col justify-center ">
          <h3 className="text-[32px] font-bold">{title}</h3>
          <h5 className="text-[18px] mt-2 ab">{desc}</h5>
        </div> */}
      </video>
    </li>
  );
};

export default VideoCard;
