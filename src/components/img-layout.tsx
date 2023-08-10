import { FC, useState } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GridLayout, { Layout } from "react-grid-layout";
import { useQuery } from "react-query";
import { PhotosService } from "@/api/services/PhotosService";
import { SettingsService } from "@/api";
export interface TestProps {}

// fake data generator

const ImageLayout: FC<TestProps> = () => {
  const [layout, setLayout] = useState<Layout[]>("");
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
        console.log(data);
        
      setLayout(JSON.parse(data?.photoLayout ?? "[]"));
    },
    queryFn: SettingsService.settingsControllerFind,
  });
  const handleLayoutChange = async (layout: Layout[]) => {
    const response = await SettingsService.settingsControllerAddPhotoLayout(
      layout
    );
    // setLayout(JSON.parse(response.photoLayout));
  };
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={9}
      onLayoutChange={(layout) => handleLayoutChange(layout)}
      rowHeight={90}
      width={792}
    >
      {data?.map((item) => {
        return (
          <div key={item.id}>
            <img src={item.url} alt="" className="h-full w-full object-cover" />
          </div>
        );
      })}
    </GridLayout>
  );
};

export default ImageLayout;
