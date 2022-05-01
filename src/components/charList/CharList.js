import './charList.scss';

import { Component } from 'react/cjs/react.production.min';
import propTypes from 'prop-types';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
  state = {
    characters: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 1548,
    charEnded: false,
  };

  MarvelService = new MarvelService();

  onCharactersloaded = (newCharacters) => {
    let ended = false;

    if (newCharacters.length < 9) {
      ended = true;
    }

    this.setState(({ offset, characters }) => ({
      characters: [...characters, ...newCharacters],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.MarvelService.getAllCharacters(offset)
      .then(this.onCharactersloaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemLoading: true,
    });
  };

  onError = () => {
    this.setState({ loading: false, error: true });
  };

  render() {
    const { characters, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? (
      <CharItem
        onCharSelected={this.props.onCharSelected}
        characters={characters}
      />
    ) : null;
    return (
      <div className="char__list">
        <ul className="char__grid">
          {errorMessage}
          {spinner}
          {content}
        </ul>
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          onClick={() => this.onRequest(offset)}
          style={{ display: charEnded ? 'none' : 'block' }}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const CharItem = ({ characters, onCharSelected }) => {
  return characters.map((item) => {
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
        onClick={() => onCharSelected(item.id)}
        className="char__item"
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
