import './SearchComponent';

import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const SearchComponent = () => {
  const { loading, error, getCharacterByName, clearError } = useMarvelService();
  const [character, setCharacter] = useState('null');
  const [link, setShowLink] = useState(false);

  const onCharacterLoaded = (char) => {
    setCharacter(char);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: (values) => {
      setCharacter(getCharacterByName(values.name).then(onCharacterLoaded));
      setShowLink(true);
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Please type not less then 2 characters').required('Required field'),
    }),
  });

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(loading || error || !link || !character) ? <LinkedChar char={character[0].wiki} /> : null;

  return (
    <form onSubmit={formik.handleSubmit}>
      <input id="name" name="name" type="text" {...formik.getFieldProps('name')} />
      {formik.errors.name && formik.touched.name ? <div className="error">{formik.errors.name}</div> : null}
      <button type="submit">Submit</button>
      {errorMessage}
      {spinner}
      {content}
    </form>
  );
};

const LinkedChar = (char) => {
  return (
    <div>
      We found you char,{' '}
      <a target="_blank" href={char.char}>
        click here
      </a>
    </div>
  );
};

export default SearchComponent;
