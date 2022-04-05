import { FileServerFilesList } from './components/FileServerFilesList';
import { Filter } from './components/Filter';

export const Home = () => {
  return (
    <>
      <Filter />
      <FileServerFilesList />
    </>
  );
};
