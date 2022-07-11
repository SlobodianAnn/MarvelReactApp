import ComicsList from '../comicsList/ComicsList';
import { Helmet } from 'react-helmet';
const ComicsPage = () => {
  return (
    <>
      <Helmet>
        <meta name="description" content="The page with comics list" />
        <title>Comics Page</title>
      </Helmet>

      <ComicsList />
    </>
  );
};

export default ComicsPage;
