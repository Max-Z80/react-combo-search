'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactComboSelect = require('react-combo-select');

var _reactComboSelect2 = _interopRequireDefault(_reactComboSelect);

var _reactDatetime = require('react-datetime');

var _reactDatetime2 = _interopRequireDefault(_reactDatetime);

var _lodash = require('lodash.isequal');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.omit');

var _lodash4 = _interopRequireDefault(_lodash3);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _RadioGroup = require('./RadioGroup');

var _RadioGroup2 = _interopRequireDefault(_RadioGroup);

var _SmartButton = require('./SmartButton');

var _SmartButton2 = _interopRequireDefault(_SmartButton);

var _FilterBar = require('./FilterBar');

var _FilterBar2 = _interopRequireDefault(_FilterBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* added by Max to support formdata.entries on iceweasel */
require('formdata-polyfill');

var ComboSearch = function (_React$Component) {
    _inherits(ComboSearch, _React$Component);

    function ComboSearch(props) {
        _classCallCheck(this, ComboSearch);

        var _this = _possibleConstructorReturn(this, (ComboSearch.__proto__ || Object.getPrototypeOf(ComboSearch)).call(this, props));

        _this.removeFilter = function (data) {
            var filters = _this.state.appliedFilters;

            var newFilters = filters.filter(function (filter) {
                return !(0, _lodash2.default)(filter, data);
            });

            _this.props.onSearch(newFilters);
            _this.setState({ appliedFilters: newFilters });
        };

        _this.state = {
            criteria: _this.props.selectDefaultValue.value || _this.props.selectData[0] ? _this.props.selectData[0].value : '',
            rightSelectText: '',
            selectText: _this.props.selectDefaultValue.text || _this.props.selectData[0] ? _this.props.selectData[0].text : '',
            beforeOrAfter: 'before',
            inputText: undefined,
            inputTextError: undefined,
            date: undefined,
            appliedFilters: []
        };

        _this.changeCriteria = _this.changeCriteria.bind(_this);
        _this.changeRightSelectText = _this.changeRightSelectText.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.onInputChange = _this.onInputChange.bind(_this);
        _this.validateTextInput = _this.validateTextInput.bind(_this);
        _this.clearErrorMessage = _this.clearErrorMessage.bind(_this);
        _this.onDateChange = _this.onDateChange.bind(_this);
        _this.submitOnDateChange = _this.submitOnDateChange.bind(_this);
        _this.getFilters = _this.getFilters.bind(_this);
        return _this;
    }

    _createClass(ComboSearch, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (!(0, _lodash2.default)(this.props.selectData[0], nextProps.selectData[0])) {
                this.setState({
                    criteria: nextProps.selectDefaultValue ? nextProps.selectDefaultValue.value : nextProps.selectData[0].value,
                    selectText: nextProps.selectDefaultValue ? nextProps.selectDefaultValue.text : nextProps.selectData[0].text
                });
            }
        }
    }, {
        key: 'changeCriteria',
        value: function changeCriteria(value, text) {
            // Here we predefine a value for the select picker. This is a workaround to a bug of react-combo-select 
            // which prevents using the 'select among this list' kind of messages
            var preselectedValueOnSelectPicker = null;
            for (var selectPickDataProperty in this.props.selectPickerData) {
                if (selectPickDataProperty === value) {
                    if (this.props.selectPickerData[selectPickDataProperty] instanceof Array && this.props.selectPickerData[selectPickDataProperty].length != 0) {
                        if (typeof this.props.selectPickerData[selectPickDataProperty][0] === 'string') {
                            preselectedValueOnSelectPicker = this.props.selectPickerData[selectPickDataProperty][0];
                        } else {
                            if (this.props.selectPickerData[selectPickDataProperty][0].text) {
                                preselectedValueOnSelectPicker = this.props.selectPickerData[selectPickDataProperty][0].text;
                            }
                        }
                    }
                    break;
                }
            }

            this.setState({ criteria: value, rightSelectText: preselectedValueOnSelectPicker, selectText: text, inputText: undefined, date: undefined, momentDate: undefined });
            this.clearErrorMessage();
        }
    }, {
        key: 'changeRightSelectText',
        value: function changeRightSelectText(value, text) {
            this.setState({ rightSelectText: text, inputText: undefined, date: undefined, momentDate: undefined });

            if (!this.props.hasButton) {
                this.handleSubmit();
            }
            this.clearErrorMessage();
        }

        /**
         * Methods called upon emission of an event from any of the different html element composing the form
         * @param {*} event event causing this call.
         */

    }, {
        key: 'handleSubmit',
        value: function handleSubmit(event) {
            if (event) {
                event.preventDefault();
            }
            if (this.isFormValid() && !this.props.isInFetchingState) {
                var formData = new FormData(this.form);
                var data = {};
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var pair = _step.value;

                        data[pair[0]] = pair[1];
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                data.selectText = this.state.selectText;
                data.criteria = this.state.criteria;

                var filterAlreadyExists = this.state.appliedFilters.some(function (filter) {
                    return (0, _lodash2.default)((0, _lodash4.default)(filter, ['momentDate']), (0, _lodash4.default)(data, ['momentDate']));
                });
                if (this.state.momentDate) {
                    data.momentDate = this.state.momentDate;
                    data.date = this.state.date;
                }
                if (filterAlreadyExists) {
                    this.setState({
                        inputTextError: 'Filter already exists!',
                        datePickerError: 'Filter already exists!'
                    });
                } else {
                    if (this.props.simpleVersion) {
                        this.setState({ inputText: '' });
                        this.props.onSearch(data);
                    } else {
                        var filters = this.getFilters(data);
                        this.props.onSearch(filters);

                        this.setState({
                            appliedFilters: filters,
                            inputText: ''
                        });
                    }
                }
            }
        }
    }, {
        key: 'onDateChange',
        value: function onDateChange(momentDate) {
            this.setState({
                momentDate: momentDate,
                date: (0, _moment2.default)(momentDate).format(this.props.dateFormat)
            }, this.submitOnDateChange.bind(this));
        }
    }, {
        key: 'submitOnDateChange',
        value: function submitOnDateChange() {
            if (!this.props.hasButton) {
                this.handleSubmit();
            }
        }
    }, {
        key: 'validateTextInput',
        value: function validateTextInput(value) {
            if (this.props.validationCallback) {
                this.props.validationCallback(value);
            } else {
                return value && value.length >= 3;
            }
        }
    }, {
        key: 'isFormValid',
        value: function isFormValid() {
            if (this.textInput) {
                var isValidInput = this.validateTextInput(this.state.inputText);
                var isValidSelect = !!this.state.criteria;

                this.setState({
                    inputTextError: !isValidInput ? this.props.inputErrorMessage : undefined,
                    selectError: !isValidSelect ? this.props.selectErrorMessage : undefined
                });

                return isValidInput && isValidSelect;
            } else {
                return true;
            }
        }
    }, {
        key: 'clearErrorMessage',
        value: function clearErrorMessage() {
            this.setState({
                inputTextError: undefined,
                datePickerError: undefined
            });
        }
    }, {
        key: 'onInputChange',
        value: function onInputChange(event) {
            this.setState({
                inputText: event.target.value
            });
        }
    }, {
        key: 'getFilters',


        /**
         * Add a new filter to a filter list. When the filter already exists, it is not duplicated (the version in newFilter is used)
         * @param {*} newFilter new filter
         */
        value: function getFilters(newFilter) {
            var newFilters = this.state.appliedFilters.filter(function (filter) {
                return !((filter.search === 'before' || filter.search === 'after') && newFilter.search === filter.search);
            });
            newFilters.push(newFilter);

            return newFilters;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this,
                _props,
                _props2;

            var selectRenderFnArgs = this.props.selectRenderFnArgs ? this.props.selectRenderFnArgs : [];
            var datePickerRenderFnArgs = this.props.datePickerRenderFnArgs ? this.props.datePickerRenderFnArgs : [];
            var isDatePickerOpen = Array.isArray(this.props.datePickerCriteria) ? this.props.datePickerCriteria.includes(this.state.criteria) : this.props.datePickerCriteria === this.state.criteria;

            // check whether a select pciker is needed
            var isSelectPickerNeeded = false;
            var selectPickerOptions = null;

            if (this.props.selectPickerData) {
                for (var property in this.props.selectPickerData) {
                    if (property === this.state.criteria) {
                        if (Array.isArray(this.props.selectPickerData[property])) isSelectPickerNeeded = true;
                        selectPickerOptions = this.props.selectPickerData[property];
                        break;
                    }
                }
            }

            return _react2.default.createElement(
                'form',
                { onSubmit: this.handleSubmit, ref: function ref(el) {
                        return _this2.form = el;
                    }, 'data-automation': 'regionComboSearchForm' },
                _react2.default.createElement(
                    'div',
                    { className: this.props.classNames.wrapper },
                    _react2.default.createElement(
                        'div',
                        { className: 'ComboStyleOverride' },
                        this.props.selectRenderFn ? (_props = this.props).selectRenderFn.apply(_props, [this.props.selectData, this.state.selectText, this.state.criteria, this.changeCriteria].concat(_toConsumableArray(selectRenderFnArgs))) : _react2.default.createElement(_reactComboSelect2.default, _extends({
                            data: this.props.selectData,
                            onChange: this.changeCriteria,
                            text: this.state.selectText,
                            value: this.state.criteria,
                            name: 'criteria',
                            order: 'off',
                            sort: 'off',
                            disabled: this.props.selectData.length === 0
                        }, this.props.additionalSelectProps)),
                        this.state.selectError ? _react2.default.createElement(
                            'span',
                            { className: 'ComboSearch__formError' },
                            this.state.selectError
                        ) : false
                    ),
                    isDatePickerOpen ? _react2.default.createElement(
                        'div',
                        { className: this.props.classNames.datePickerRadioWrapper },
                        _react2.default.createElement(
                            'div',
                            { className: this.props.classNames.radioGroupWrapper },
                            this.props.showRadioButtons ? _react2.default.createElement(_RadioGroup2.default, {
                                name: 'search',
                                defaultChecked: 'before',
                                data: [{
                                    label: 'Before',
                                    value: 'before'
                                }, {
                                    label: 'After',
                                    value: 'after'
                                }],
                                classNames: this.props.radioGroupClassNames
                            }) : null
                        ),
                        _react2.default.createElement(
                            'div',
                            { className: this.props.classNames.datePickerWrapper },
                            this.props.datePickerRenderFn ? (_props2 = this.props).datePickerRenderFn.apply(_props2, [this.onDateChange].concat(_toConsumableArray(datePickerRenderFnArgs))) : _react2.default.createElement(_reactDatetime2.default, _extends({
                                onChange: this.onDateChange,
                                dateFormat: this.props.dateFormat,
                                timeFormat: false,
                                isValidDate: this.props.validDateFilter,
                                closeOnSelect: true,
                                onBlur: this.clearErrorMessage,
                                inputProps: {
                                    name: 'date',
                                    disabled: this.props.isInFetchingState,
                                    readOnly: true,
                                    className: 'Datepicker__input js-datepickerInput Input',
                                    'data-automation': 'fieldComboSearchDatePicker'
                                }
                            }, this.props.additionalDatePickerProps)),
                            _react2.default.createElement(
                                'i',
                                { className: 'Datepicker__icon' },
                                ' '
                            ),
                            this.state.datePickerError ? _react2.default.createElement(
                                'span',
                                { className: 'ComboSearch__formError' },
                                this.state.datePickerError
                            ) : false
                        )
                    ) : isSelectPickerNeeded ? _react2.default.createElement(
                        'div',
                        { className: 'ComboSearch__inputWrapper' },
                        _react2.default.createElement(
                            'div',
                            { className: 'ComboStyleOverride' },
                            _react2.default.createElement(_reactComboSelect2.default, _extends({
                                data: selectPickerOptions //no update based on change of this prop. this is a bug reported https://github.com/gogoair/react-combo-select/issues/47
                                , onChange: this.changeRightSelectText,
                                text: this.state.rightSelectText,
                                name: 'search',
                                order: 'off',
                                sort: 'off',
                                disabled: this.props.selectPickerData.length === 0
                            }, this.props.additionalSelectProps))
                        )
                    ) : _react2.default.createElement(
                        'div',
                        { className: 'ComboSearch__inputWrapper' },
                        _react2.default.createElement('span', { className: 'ComboSearch__inputIcon' }),
                        _react2.default.createElement('input', {
                            type: 'text',
                            name: 'search',
                            id: 'search',
                            ref: function ref(el) {
                                return _this2.textInput = el;
                            },
                            value: this.state.inputText || '',
                            className: this.props.classNames.textInput,
                            placeholder: this.state.selectText,
                            onChange: this.onInputChange,
                            onBlur: this.clearErrorMessage,
                            'data-automation': 'fieldComboSearchTextInput'
                        }),
                        this.state.inputTextError ? _react2.default.createElement(
                            'span',
                            { className: 'ComboSearch__formError' },
                            this.state.inputTextError
                        ) : false
                    ),
                    this.props.hasButton ? _react2.default.createElement(_SmartButton2.default, {
                        text: 'Apply',
                        type: 'submit',
                        className: this.props.classNames.button,
                        isDisabled: !this.isFormValid() || this.props.isInFetchingState || !this.state.inputText,
                        isInPendingState: this.props.isInFetchingState,
                        pendingText: this.props.buttonPendingText || 'Loading...',
                        dataAutomation: 'buttonComboSearchApply'
                    }) : false,
                    !this.props.simpleVersion ? _react2.default.createElement(_FilterBar2.default, {
                        filters: this.state.appliedFilters,
                        removeFilter: this.removeFilter,
                        disabled: this.props.isInFetchingState,
                        classNames: this.props.filterBarClassNames
                    }) : false
                )
            );
        }
    }]);

    return ComboSearch;
}(_react2.default.Component);

ComboSearch.defaultProps = {
    classNames: {
        wrapper: 'ComboSearch',
        datePickerRadioWrapper: 'ComboSearch__datePicker',
        radioGroupWrapper: 'ComboSearch__RadioWrapper',
        datePickerWrapper: 'ComboSearch__datePickerWrapper',
        textInput: 'ComboSearch__input Input',
        button: 'Button Button--action'
    },
    radioGroupClassNames: {
        wrapper: 'RadioGroup',
        label: 'RadioGroup__label',
        fakeRadio: 'RadioGroup__fakeRadio',
        fakeRadioInner: 'RadioGroup__fakeRadioInner'
    },
    filterBarClassNames: {
        wrapper: 'FilterBar',
        filter: 'FilterBar__filter',
        removeButton: 'FilterBar__filterClose',
        text: 'FilterBar__filterText'
    },
    dateFormat: 'DD MMM YYYY',
    showRadioButtons: true,
    inputErrorMessage: 'This field is required and should be at least 3 characters long',
    selectErrorMessage: 'Select an option',
    selectDefaultValue: {}
};
ComboSearch.propTypes = {
    onSearch: _propTypes2.default.func.isRequired,
    selectData: _propTypes2.default.array,
    selectPickerData: _propTypes2.default.object,
    selectRenderFn: _propTypes2.default.func,
    selectRenderFnArgs: _propTypes2.default.array,
    datePickerRenderFn: _propTypes2.default.func,
    datePickerRenderFnArgs: _propTypes2.default.array,
    simpleVersion: _propTypes2.default.bool,
    showRadioButtons: _propTypes2.default.bool,
    hasButton: _propTypes2.default.bool,
    buttonPendingText: _propTypes2.default.string,
    isInFetchingState: _propTypes2.default.bool,
    selectDefaultValue: _propTypes2.default.object,
    datePickerCriteria: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.array]),
    classNames: _propTypes2.default.object,
    inputErrorMessage: _propTypes2.default.string,
    selectErrorMessage: _propTypes2.default.string,
    validationCallback: _propTypes2.default.func,
    dateFormat: _propTypes2.default.string,
    validDateFilter: _propTypes2.default.func,
    additionalSelectProps: _propTypes2.default.object,
    additionalDatePickerProps: _propTypes2.default.object
};
exports.default = ComboSearch;