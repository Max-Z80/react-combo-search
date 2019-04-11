'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FilterBar = function FilterBar(props) {
    var destroyFilter = function destroyFilter(filter) {
        if (!props.disabled) {
            props.removeFilter(filter);
        } else {
            return undefined;
        }
    };

    var capitalize = function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    return _react2.default.createElement(
        'div',
        { className: props.classNames.wrapper },
        props.filters.map(function (filter, i) {
            return _react2.default.createElement(
                'div',
                {
                    className: !props.disabled ? props.classNames.filter : props.classNames.filter + ' ' + props.classNames.filter + '--disabled',
                    key: filter.criteria + filter.search + i,
                    'data-automation': 'regionComboSearchFilterBar'
                },
                _react2.default.createElement('span', { className: props.classNames.removeButton, onClick: destroyFilter.bind(null, filter), 'data-automation': 'actionComboSearchDestroyFilter' }),
                _react2.default.createElement(
                    'p',
                    { className: props.classNames.text, 'data-automation': 'textComboSearchFilterCriteria' },
                    filter.selectText
                ),
                filter.date ? _react2.default.createElement(
                    'p',
                    { className: props.classNames.text, 'data-automation': 'textComboSearchFilterSearchDate' },
                    filter.search ? capitalize(filter.search) : '',
                    ' ',
                    filter.date
                ) : _react2.default.createElement(
                    'p',
                    { className: props.classNames.text, 'data-automation': 'textComboSearchFilterSearchText' },
                    filter.search
                )
            );
        })
    );
};

FilterBar.propTypes = {
    filters: _propTypes2.default.array,
    removeFilter: _propTypes2.default.func,
    disabled: _propTypes2.default.bool
};

exports.default = FilterBar;