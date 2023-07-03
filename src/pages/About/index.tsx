import { FC } from "react";
import { useTranslation } from "react-i18next";
export interface AboutProps {}
const About: FC<AboutProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="text-4xl flex items-center justify-center h-screen">
      {t("about.hero")}
    </div>
  );
};

export default About;
