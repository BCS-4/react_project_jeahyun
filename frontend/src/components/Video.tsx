import { FC, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import VideoCard from "./VideoCard";

const Banner: FC = () => {
  const [page, setPage] = useState(0);

  const sliderRef = useRef<any>(null);

  const bannerData = [
    {
      title: "1",
      desc: "11",
      video: "hamster",
    },
    {
      title: "2",
      desc: "22",
      video: "hamster3",
    },
    {
      title: "3",
      desc: "33",
      video: "hamster2",
    },
  ];
  const onClickNext = () => {
    sliderRef.current.slickNext();
  };
  const onClickPrev = () => {
    sliderRef.current.slickPrev();
  };

  const getCurrentPage = () => {
    setPage(sliderRef.current.innerSlider.state.currentSlide);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      getCurrentPage();
    }, 1000);

    return () => clearInterval(timer);
  });

  return (
    <div className="relative">
      <ul className="">
        <Slider
          ref={sliderRef}
          arrows={false}
          autoplay={true}
          autoplaySpeed={5000}
          fade={true}
        >
          {" "}
          {bannerData.map((v, i) => (
            <VideoCard key={i} title={v.title} desc={v.desc} video={v.video} />
          ))}
        </Slider>
      </ul>
      <div className=" flex justify-center">
        <div className="text-white text-bold bg-black bg-opacity-30 w-fit flex p-[5px] text-xs rounded-full gap-2 py-[5px] px-3">
          <button onClick={onClickPrev}>다음</button>
          <div>
            {page + 1} / {bannerData.length}
          </div>
          <button onClick={onClickNext}>이전</button>
        </div>
      </div>
    </div>
  );
};
export default Banner;
