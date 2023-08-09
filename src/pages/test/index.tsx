import React, { FC, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout from "react-grid-layout";
export interface TestProps {}

// fake data generator

const Test: FC<TestProps> = () => {
  const layout = [
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 1, maxW: 4, minH: 1, maxH: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 },
  ];
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      onLayoutChange={(layout) => console.log(layout)}
      rowHeight={30}
      width={1200}
    >
      <div key="a" className="">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="b">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="c">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="d">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="e">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="f">
        <img
          src="https://images-1253529509.cos.ap-chengdu.myqcloud.com/1691555736817.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div key="g">b</div>
      <div key="h">b</div>
    </GridLayout>
  );
};

export default Test;
