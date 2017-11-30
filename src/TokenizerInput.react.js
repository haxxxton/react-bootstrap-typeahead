import cx from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import AutosizeInput from 'react-input-autosize-fixes';

import Token from './Token.react';

import getOptionLabel from './utils/getOptionLabel';
import {BACKSPACE} from './utils/keyCode';

/**
 * TokenizerInput
 *
 * Accepts multiple selections from a Typeahead component and renders them as
 * tokens within an input.
 */
class TokenizerInput extends React.Component {
  displayName = 'TokenizerInput';

  constructor(props) {
    super(props);

    this._handleBlur = this._handleBlur.bind(this);
    this._handleChange = this._handleChange.bind(this);
    this._handleInputFocus = this._handleInputFocus.bind(this);
    this._handleKeydown = this._handleKeydown.bind(this);
    this._renderToken = this._renderToken.bind(this);

    this.state = {
      isFocused: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      onComponentUpdate,
    } = this.props;
    if (onComponentUpdate) {
      onComponentUpdate(prevProps, prevState, this.props, this.state);
    }
  }

  render() {
    const {
      bsSize,
      disabled,
      hasAux,
      placeholder,
      selected,
      styles,
      tabIndex,
      value,
    } = this.props;

    return (
      <div
        className={cx(
          'bootstrap-tokenizer',
          'clearfix',
          'form-control',
          {
            'focus': this.state.isFocused,
            'has-aux': hasAux,
            'input-lg': bsSize === 'large' || bsSize === 'lg',
            'input-sm': bsSize === 'small' || bsSize === 'sm',
          }
        )}
        disabled={disabled}
        onClick={this._handleInputFocus}
        onFocus={this._handleInputFocus}
        style={{
          cursor: 'text',
          height: 'auto',
          ...styles.tokenizer,
        }}
        tabIndex={-1}>
        {selected.map(this._renderToken)}
        <AutosizeInput
          className="bootstrap-tokenizer-input"
          disabled={disabled}
          inputClassName="bootstrap-typeahead-input-main"
          inputStyle={{
            backgroundColor: 'inherit',
            border: 0,
            boxShadow: 'none',
            cursor: 'inherit',
            outline: 'none',
            padding: 0,
            ...styles.input,
          }}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this.props.onFocus}
          onKeyDown={this._handleKeydown}
          placeholder={selected.length ? null : placeholder}
          ref="input"
          tabIndex={0 + tabIndex}
          type="text"
          value={value}
        />
      </div>
    );
  }

  blur() {
    this.refs.input.blur();
  }

  focus() {
    this._handleInputFocus();
  }

  _renderToken(option, idx) {
    const {
      disabled,
      labelKey,
      onRemove,
      renderToken,
      styles,
      tabIndex,
    } = this.props;
    const onRemoveWrapped = () => onRemove(option);

    if (renderToken) {
      return renderToken(option, onRemoveWrapped, idx);
    }

    return (
      <Token
        disabled={disabled}
        key={idx}
        onRemove={onRemoveWrapped}
        styles={styles}
        tabIndex={tabIndex}>
        {getOptionLabel(option, labelKey)}
      </Token>
    );
  }

  _handleBlur(e) {
    this.setState({isFocused: false});
    this.props.onBlur(e);
  }

  _handleChange(e) {
    this.props.onChange(e.target.value);
  }

  _handleKeydown(e) {
    switch (e.keyCode) {
      case BACKSPACE:
        const inputNode = findDOMNode(this.refs.input);
        if (
          inputNode &&
          inputNode.contains(document.activeElement) &&
          !this.props.value
        ) {
          // If the input is selected and there is no text, select the last
          // token when the user hits backspace.
          let sibling = inputNode.previousSibling;
          sibling && sibling.focus();

          // Prevent browser "back" action.
          e.preventDefault();
        }
        break;
    }

    this.props.onKeyDown(e);
  }

  _handleInputFocus(e) {
    if (this.props.disabled) {
      if (e) {
        e.target.blur();
      }
      return;
    }

    // If the user clicks anywhere inside the tokenizer besides a token,
    // focus the input.
    this.refs.input.focus();
    this.setState({isFocused: true});
  }
}

/**
 * In addition to the propTypes below, the following props are automatically
 * passed down by `Typeahead`:
 *
 *  - activeIndex
 *  - hasAux
 *  - labelKey
 *  - onAdd
 *  - onBlur
 *  - onChange
 *  - onClick
 *  - onFocus
 *  - onKeydown
 *  - onRemove
 *  - options
 *  - selected
 *  - value
 */
TokenizerInput.propTypes = {
  /**
   * Whether to disable the input and all selections.
   */
  disabled: PropTypes.bool,
  /**
   * Placeholder text for the input.
   */
  placeholder: PropTypes.string,
  /**
   * Provides a hook for customized rendering of tokens when multiple
   * selections are enabled.
   */
  renderToken: PropTypes.func,
};

TokenizerInput.defaultProps = {
  styles: {},
};

export default TokenizerInput;
