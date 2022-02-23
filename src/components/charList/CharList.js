import './charList.scss';

import { Component } from 'react/cjs/react.production.min';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

class CharList extends Component {
  state = {
    characters: {},
    loading: true,
    error: false,
  };

  MarvelService = new MarvelService();

  onCharactersloaded = (characters) => {
    this.setState({ characters, loading: false });
  };

  componentDidMount() {
    this.MarvelService.getAllCharacters()
      .then(this.onCharactersloaded)
      .catch(this.onError);
  }
  onError = () => {
    this.setState({ loading: false, error: true });
  };

  render() {
    const { characters, loading, error } = this.state;
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
        <button className="button button__main button__long">
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

export default CharList;
