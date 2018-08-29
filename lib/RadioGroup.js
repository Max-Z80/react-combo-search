'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadioGroup = function (_React$Component) {
    _inherits(RadioGroup, _React$Component);

    function RadioGroup(props) {
        _classCallCheck(this, RadioGroup);

        var _this = _possibleConstructorReturn(this, (RadioGroup.__proto__ || Object.getPrototypeOf(RadioGroup)).call(this, props));

        _this.checkInput = function (event) {
            _this.setState({
                checked: event.target.value
            });
        };

        _this.state = {
            checked: _this.props.defaultChecked || undefined
        };
        return _this;
    }

    _createClass(RadioGroup, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { className: this.props.classNames.wrapper },
                this.props.data.map(function (item) {
                    return _react2.default.createElement(
                        'label',
                        {
                            key: item.value,
                            className: _this2.state.checked === item.value ? _this2.props.classNames.label + ' ' + _this2.props.classNames.label + '--checked' : _this2.props.classNames.label
                        },
                        _react2.default.createElement(
                            'span',
                            {
                                className: _this2.state.checked === item.value ? _this2.props.classNames.fakeRadio + ' ' + _this2.props.classNames.fakeRadio + '--checked' : _this2.props.classNames.fakeRadio
                            },
                            _react2.default.createElement('span', { className: _this2.props.classNames.fakeRadioInner })
                        ),
                        _react2.default.createElement('input', {
                            type: 'radio',
                            name: _this2.props.name,
                            value: item.value,
                            checked: _this2.state.checked === item.value,
                            onChange: _this2.checkInput,
                            disabled: _this2.props.isInFetchingState,
                            'data-automation': 'fieldComboSearchRadio'
                        }),
                        _react2.default.createElement(
                            'span',
                            null,
                            item.label
                        )
                    );
                })
            );
        }
    }]);

    return RadioGroup;
}(_react2.default.Component);

RadioGroup.propTypes = {
    defaultChecked: _propTypes2.default.string.isRequired,
    name: _propTypes2.default.string.isRequired,
    data: _propTypes2.default.array.isRequired,
    disabled: _propTypes2.default.bool
};
exports.default = RadioGroup;