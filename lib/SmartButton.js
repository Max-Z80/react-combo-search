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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SmartButton = function (_React$Component) {
    _inherits(SmartButton, _React$Component);

    function SmartButton() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, SmartButton);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = SmartButton.__proto__ || Object.getPrototypeOf(SmartButton)).call.apply(_ref, [this].concat(args))), _this), _this._generatePendingOperationContent = function () {
            return _react2.default.createElement(
                'span',
                null,
                _react2.default.createElement(
                    'i',
                    { className: 'fa fa-spinner fa-pulse' },
                    ' '
                ),
                ' ',
                _this.props.pendingText
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(SmartButton, [{
        key: 'render',
        value: function render() {
            var _props = this.props,
                onClickCallback = _props.onClickCallback,
                isInPendingState = _props.isInPendingState,
                isDisabled = _props.isDisabled,
                text = _props.text,
                className = _props.className,
                dataAutomation = _props.dataAutomation,
                type = _props.type,
                title = _props.title,
                onMouseOver = _props.onMouseOver,
                other = _objectWithoutProperties(_props, ['onClickCallback', 'isInPendingState', 'isDisabled', 'text', 'className', 'dataAutomation', 'type', 'title', 'onMouseOver']);

            var content = isInPendingState ? this._generatePendingOperationContent() : text;
            var classNameFinal = typeof className !== 'undefined' ? className : 'Button Button--small h-marginL--xs';

            return _react2.default.createElement(
                'button',
                {
                    style: this.props.style ? this.props.style : {},
                    className: classNameFinal,
                    disabled: isInPendingState || isDisabled === true,
                    onClick: onClickCallback,
                    'data-dismiss': other['data-dismiss'] || 'modal',
                    type: type,
                    title: title,
                    'data-tip': other['data-tip'],
                    onMouseOver: onMouseOver,
                    'data-automation': dataAutomation
                },
                content
            );
        }
    }]);

    return SmartButton;
}(_react2.default.Component);

SmartButton.propTypes = {
    isInPendingState: _propTypes2.default.bool,
    isDisabled: _propTypes2.default.bool,
    onClickCallback: _propTypes2.default.func,
    text: _propTypes2.default.any.isRequired,
    pendingText: _propTypes2.default.any,
    className: _propTypes2.default.string,
    dataAutomation: _propTypes2.default.string,
    style: _propTypes2.default.any
};
SmartButton.defaultProps = {
    pendingText: ''
};
exports.default = SmartButton;