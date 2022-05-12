import './charList.scss';

import React from 'react/cjs/react.production.min';
import { useState, useEffect, useRef } from 'react';
import propTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharList = (props) => {
  const { loading, error, getAllCharacters } = useMarvelService();
  const myRef = useRef();

  const [characters, setCharacters] = useState([]);
  const [newItemLoading, setItemLoading] = useState(false);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const onCharactersloaded = (newCharacters) => {
    let ended = false;

    if (newCharacters.length < 9) {
      ended = true;
    }
    setCharacters((characters) => [...characters, ...newCharacters]);
    setItemLoading(false);
    setOffset((offset) => offset + 9);
    setCharEnded(ended);
  };

  useEffect(() => {
    onRequest(offset, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRequest = (offset, initial) => {
    initial ? setItemLoading(false) : setItemLoading(true);
    getAllCharacters(offset).then(onCharactersloaded);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading && !newItemLoading ? <Spinner /> : null;

  return (
    <div className="char__list">
      <ul className="char__grid">
        {errorMessage}
        {spinner}
        <CharItem
          onCharSelected={props.onCharSelected}
          characters={characters}
          ref={myRef}
        />
      </ul>
      <button
        className="button button__main button__long"
        disabled={newItemLoading}
        onClick={() => onRequest(offset)}
        style={{ display: charEnded ? 'none' : 'block' }}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

const CharItem = (props) => {
  const myRef = useRef([]);

  const activeChar = (e) => {
    const clickedItem = e.currentTarget;

    myRef.current.forEach((item) => {
      item.classList.remove('char__item_selected');
      if (clickedItem === item) {
        item.classList.add('char__item_selected');
      }
    });
  };

  const { characters, onCharSelected } = props;

  return characters.map((item, i) => {
    let imgStyle = { objectFit: 'cover' };

    if (
      item.thumbnail ===
      'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
    ) {
      imgStyle = { objectFit: 'unset' };
    }

    return (
      <li
        key={item.id}
        onClick={(e) => {
          onCharSelected(item.id);
          activeChar(e);
        }}
        className={'char__item'}
        ref={(el) => (myRef.current[i] = el)}
      >
        <img style={imgStyle} src={item.thumbnail} alt="abyss" />
        <div className="char__name">{item.name}</div>
      </li>
    );
  });
};

CharList.propTypes = {
  onCharSelected: propTypes.func,
};

export default CharList;
