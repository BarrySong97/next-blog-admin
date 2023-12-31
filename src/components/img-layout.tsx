import { FC, useRef, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout, { Layout } from "react-grid-layout";
import { useQuery } from "react-query";
import { PhotosService } from "@/api/services/PhotosService";
import { SettingsService } from "@/api";
export interface TestProps {}

// fake data generator

const ImageLayout: FC<TestProps> = () => {
  const [layout, setLayout] = useState<Layout[]>();
  const requestNum = useRef<number>(0);
  const { data } = useQuery({
    queryKey: ["photos"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    queryFn: PhotosService.photosControllerFindRecent,
  });
  useQuery({
    queryKey: ["settings"],
    retry: false,
    refetchOnWindowFocus: false,
    structuralSharing: false,
    onSuccess(data) {
      setLayout(JSON.parse(data?.photoLayout ?? "[]"));
    },
    queryFn: SettingsService.settingsControllerFind,
  });
  const handleLayoutChange = async (layout: Layout[]) => {
    // console.log(layout);

    layout.forEach((item, i) => {
      item.i = i.toString();
    });
    if (requestNum.current !== 0) {
      await SettingsService.settingsControllerAddPhotoLayout(layout);
    } else {
      requestNum.current++;
    }
  };
  return (
    <GridLayout
      className="layout ml-[-10px] "
      layout={layout}
      cols={9}
      onLayoutChange={(layout) => handleLayoutChange(layout)}
      rowHeight={90}
      width={1102}
    >
      {data?.map((item, i) => {
        return (
          <div key={i}>
            <img src={item.url} alt="" className="h-full w-full object-cover" />
          </div>
        );
      })}
    </GridLayout>
  );
};

export default ImageLayout;
