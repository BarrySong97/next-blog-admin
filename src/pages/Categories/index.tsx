import { FC } from "react";
import { useTranslation } from "react-i18next";
export interface HomeProps {}
const Home: FC<HomeProps> = () => {
  const { t } = useTranslation();
  return (
    <div className="text-4xl h-screen flex justify-center items-center">
    {t('home.hero')}
    </div>
  );
};

export default Home;
