import React from 'react';
import PropTypes from 'prop-types';
import ComboSelect from 'react-combo-select';
import DateTimeField from 'react-datetime';
import isEqual from 'lodash.isequal';
import omit from 'lodash.omit';
import moment from 'moment';

import RadioGroup from './RadioGroup';
import SmartButton from './SmartButton';
import FilterBar from './FilterBar';

/* added by Max to support formdata.entries on iceweasel */
require('formdata-polyfill')

export default class ComboSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            criteria: this.props.selectDefaultValue.value || this.props.selectData[0] ? this.props.selectData[0].value : '',
            selectPickerText: '',
            selectText: this.props.selectDefaultValue.text || this.props.selectData[0] ? this.props.selectData[0].text : '',
            beforeOrAfter: 'before',
            inputText: undefined,
            inputTextError: undefined,
            date: undefined,
            appliedFilters: [],
        };

        this.changeCriteria = :: this.changeCriteria;
        this.changeRightSelectText = :: this.changeRightSelectText;
        this.handleSubmit = :: this.handleSubmit;
        this.onInputChange = :: this.onInputChange;
        this.validateTextInput = :: this.validateTextInput;
        this.clearErrorMessage = :: this.clearErrorMessage;
        this.onDateChange = :: this.onDateChange;
        this.submitOnDateChange = :: this.submitOnDateChange;
        this.getFilters = :: this.getFilters;
    }

    static defaultProps = {
        classNames: {
            wrapper: 'ComboSearch',
            datePickerRadioWrapper: 'ComboSearch__datePicker',
            radioGroupWrapper: 'ComboSearch__RadioWrapper',
            datePickerWrapper: 'ComboSearch__datePickerWrapper',
            textInput: 'ComboSearch__input Input',
            button: 'Button Button--action',
        },
        radioGroupClassNames: {
            wrapper: 'RadioGroup',
            label: 'RadioGroup__label',
            fakeRadio: 'RadioGroup__fakeRadio',
            fakeRadioInner: 'RadioGroup__fakeRadioInner',
        },
        filterBarClassNames: {
            wrapper: 'FilterBar',
            filter: 'FilterBar__filter',
            removeButton: 'FilterBar__filterClose',
            text: 'FilterBar__filterText',
        },
        dateFormat: 'DD MMM YYYY',
        showRadioButtons: true,
        inputErrorMessage: 'This field is required and should be at least 3 characters long',
        selectErrorMessage: 'Select an option',
        selectDefaultValue: {},
    };

    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        selectData: PropTypes.array,
        selectPickerData: PropTypes.object,
        selectRenderFn: PropTypes.func,
        selectRenderFnArgs: PropTypes.array,
        datePickerRenderFn: PropTypes.func,
        datePickerRenderFnArgs: PropTypes.array,
        simpleVersion: PropTypes.bool,
        showRadioButtons: PropTypes.bool,
        hasButton: PropTypes.bool,
        buttonPendingText: PropTypes.string,
        isInFetchingState: PropTypes.bool,
        selectDefaultValue: PropTypes.object,
        datePickerCriteria: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        classNames: PropTypes.object,
        inputErrorMessage: PropTypes.string,
        selectErrorMessage: PropTypes.string,
        validationCallback: PropTypes.func,
        dateFormat: PropTypes.string,
        validDateFilter: PropTypes.func,
        additionalSelectProps: PropTypes.object,
        additionalDatePickerProps: PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.selectData[0], nextProps.selectData[0])) {
            this.setState({
                criteria: nextProps.selectDefaultValue
                    ? nextProps.selectDefaultValue.value
                    : nextProps.selectData[0].value,
                selectText: nextProps.selectDefaultValue
                    ? nextProps.selectDefaultValue.text
                    : nextProps.selectData[0].text,
            });
        }
    }

    changeCriteria(value, text) {
        // Here we predefine a value for the select picker. This is a workaround to a bug of react-combo-select 
        // which prevents using the 'select among this list' kind of messages
        let preselectedTextOnSelectPicker = '';
        for (let selectPickDataProperty in this.props.selectPickerData) {
            if (selectPickDataProperty === value) {
                if (this.props.selectPickerData[selectPickDataProperty] instanceof Array && this.props.selectPickerData[selectPickDataProperty].length != 0) {
                    if (typeof this.props.selectPickerData[selectPickDataProperty][0] === 'string') {
                        preselectedTextOnSelectPicker = this.props.selectPickerData[selectPickDataProperty][0];
                    }
                    else {
                        if (this.props.selectPickerData[selectPickDataProperty][0].text) {
                            preselectedTextOnSelectPicker = this.props.selectPickerData[selectPickDataProperty][0].text;
                        }
                    }
                }
                break;
            }
        }

        this.setState({
            criteria: value,
            selectPickerText: preselectedTextOnSelectPicker,
            selectText: text,
            inputText: undefined,
            date: undefined,
            momentDate: undefined
        });
        this.clearErrorMessage();
    }

    changeRightSelectText(value, text) {
        // This is a trick to pass text and values in the form when a selectPicker is used. This enables to use 
        // these values in handleSubmit() as we can not use the component states to pass these values because 
        // setstate may finish at any time. We do that because react-combo-select only pass the selectPickerText 
        // in its value and the selectPickerValue is not available using formData.
        this.form.selectPickerText = text;
        this.form.selectPickerValue = value;

        this.setState({
            selectPickerText: text //updates text shown in selectPicker after selection
        });

        if (!this.props.hasButton) {
            this.handleSubmit();
        }
        this.clearErrorMessage();
    }

    /**
     * Methods called upon emission of an event from any of the different html element composing the form
     * @param {*} event event causing this call.
     */
    handleSubmit(event) {
        if (event) {
            event.preventDefault();
        }
        if (this.isFormValid() && !this.props.isInFetchingState) {
            let data = {};
            if (this.form.selectPickerValue) {
                // the form contains a selectPicker filter
                data.search = this.form.selectPickerValue;
                data.selectPickerText = this.form.selectPickerText;

                // reset these values in case further filters are used
                this.form.selectPickerText = null;
                this.form.selectPickerValue = null;
            } else {
                const formData = new FormData(this.form);
                for (let pair of formData.entries()) {
                    data[pair[0]] = pair[1];
                }
            }

            data.criteria = this.state.criteria;
            data.selectText = this.state.selectText;

            const filterAlreadyExists = this.state.appliedFilters.some(filter => {
                return isEqual(omit(filter, ['momentDate']), omit(data, ['momentDate']));
            });
            if (this.state.momentDate) {
                data.momentDate = this.state.momentDate;
                data.date = this.state.date;
            }
            if (filterAlreadyExists) {
                this.setState({
                    inputTextError: 'Filter already exists!',
                    datePickerError: 'Filter already exists!',
                });
            } else {
                if (this.props.simpleVersion) {
                    this.setState({ inputText: '' });
                    this.props.onSearch(data);
                } else {
                    const filters = this.getFilters(data);
                    this.props.onSearch(filters);
                    this.setState({
                        appliedFilters: filters,
                        inputText: ''
                    });
                }
            }
        }
    };

    onDateChange(momentDate) {
        this.setState({
            momentDate,
            date: moment(momentDate).format(this.props.dateFormat)
        }, this.submitOnDateChange.bind(this));
    };

    submitOnDateChange() {
        if (!this.props.hasButton) {
            this.handleSubmit();
        }
    };

    removeFilter = data => {
        let filters = this.state.appliedFilters;

        const newFilters = filters.filter(filter => {
            return !isEqual(filter, data);
        });

        this.props.onSearch(newFilters);
        this.setState({ appliedFilters: newFilters });
    };

    validateTextInput(value) {
        if (this.props.validationCallback) {
            this.props.validationCallback(value);
        } else {
            return value && value.length >= 3;
        }
    };

    isFormValid() {
        if (this.textInput) {
            const isValidInput = this.validateTextInput(this.state.inputText);
            const isValidSelect = !!this.state.criteria;

            this.setState({
                inputTextError: !isValidInput ? this.props.inputErrorMessage : undefined,
                selectError: !isValidSelect ? this.props.selectErrorMessage : undefined,
            });

            return isValidInput && isValidSelect;
        } else {
            return true;
        }
    }

    clearErrorMessage() {
        this.setState({
            inputTextError: undefined,
            datePickerError: undefined,
        });
    };

    onInputChange(event) {
        this.setState({
            inputText: event.target.value,
        });
    };

    /**
     * Add a new filter to a filter list. When the filter already exists, it is not duplicated (the version in newFilter is used)
     * @param {*} newFilter new filter
     */
    getFilters(newFilter) {
        let newFilters = this.state.appliedFilters.filter((filter) => {
            return !((filter.search === 'before' || filter.search === 'after') && newFilter.search === filter.search);
        });
        newFilters.push(newFilter);

        return newFilters;
    };

    render() {
        const selectRenderFnArgs = this.props.selectRenderFnArgs ? this.props.selectRenderFnArgs : [];
        const datePickerRenderFnArgs = this.props.datePickerRenderFnArgs ? this.props.datePickerRenderFnArgs : [];
        const isDatePickerOpen = Array.isArray(this.props.datePickerCriteria)
            ? this.props.datePickerCriteria.includes(this.state.criteria)
            : this.props.datePickerCriteria === this.state.criteria;

        // check whether a select pciker is needed
        let isSelectPickerNeeded = false;
        let selectPickerOptions = null;

        if (this.props.selectPickerData) {
            for (let property in this.props.selectPickerData) {
                if (property === this.state.criteria) {
                    if (Array.isArray(this.props.selectPickerData[property]))
                        isSelectPickerNeeded = true;
                    selectPickerOptions = this.props.selectPickerData[property];
                    break;
                }
            }
        }

        return (
            <form onSubmit={this.handleSubmit} ref={el => (this.form = el)} data-automation="regionComboSearchForm">
                <div className={this.props.classNames.wrapper}>
                    <div className="ComboStyleOverride">
                        {this.props.selectRenderFn
                            ? this.props.selectRenderFn(
                                this.props.selectData,
                                this.state.selectText,
                                this.state.criteria,
                                this.changeCriteria,
                                ...selectRenderFnArgs
                            ) : <ComboSelect
                                data={this.props.selectData}
                                onChange={this.changeCriteria}
                                text={this.state.selectText}
                                value={this.state.criteria}
                                name="criteria"
                                order="off"
                                sort="off"
                                disabled={this.props.selectData.length === 0}
                                {...this.props.additionalSelectProps}
                            />}
                        {this.state.selectError ? (
                            <span className="ComboSearch__formError">{this.state.selectError}</span>
                        ) : (
                                false
                            )}
                    </div>
                    {isDatePickerOpen ? (
                        <div className={this.props.classNames.datePickerRadioWrapper}>
                            <div className={this.props.classNames.radioGroupWrapper}>
                                {this.props.showRadioButtons
                                    ? <RadioGroup
                                        name="search"
                                        defaultChecked="before"
                                        data={[
                                            {
                                                label: 'Before',
                                                value: 'before',
                                            },
                                            {
                                                label: 'After',
                                                value: 'after',
                                            },
                                        ]}
                                        classNames={this.props.radioGroupClassNames}
                                    /> : null}
                            </div>
                            <div className={this.props.classNames.datePickerWrapper}>
                                {this.props.datePickerRenderFn
                                    ? this.props.datePickerRenderFn(
                                        this.onDateChange,
                                        ...datePickerRenderFnArgs
                                    )
                                    : <DateTimeField
                                        onChange={this.onDateChange}
                                        dateFormat={this.props.dateFormat}
                                        timeFormat={false}
                                        isValidDate={this.props.validDateFilter}
                                        closeOnSelect={true}
                                        onBlur={this.clearErrorMessage}
                                        inputProps={{
                                            name: 'date',
                                            disabled: this.props.isInFetchingState,
                                            readOnly: true,
                                            className: 'Datepicker__input js-datepickerInput Input',
                                            'data-automation': 'fieldComboSearchDatePicker',
                                        }}
                                        {...this.props.additionalDatePickerProps}
                                    />}
                                <i className="Datepicker__icon"> </i>
                                {this.state.datePickerError ? (
                                    <span className="ComboSearch__formError">{this.state.datePickerError}</span>
                                ) : (
                                        false
                                    )}
                            </div>
                        </div>
                    ) : (isSelectPickerNeeded
                        ? (
                            <div className="ComboSearch__inputWrapper">
                                <div className="ComboStyleOverride">
                                    <ComboSelect
                                        data={selectPickerOptions} //no update based on change of this prop. this is a bug reported https://github.com/gogoair/react-combo-select/issues/47
                                        onChange={this.changeRightSelectText}
                                        text={this.state.selectPickerText}
                                        name="search"
                                        order="off"
                                        sort="off"
                                        disabled={this.props.selectPickerData.length === 0}
                                        {...this.props.additionalSelectProps}
                                    />
                                </div>
                            </div>)
                        : (<div className="ComboSearch__inputWrapper">
                            <span className="ComboSearch__inputIcon" />
                            <input
                                type="text"
                                name="search"
                                id="search"
                                ref={el => (this.textInput = el)}
                                value={this.state.inputText || ''}
                                className={this.props.classNames.textInput}
                                placeholder={this.state.selectText}
                                onChange={this.onInputChange}
                                onBlur={this.clearErrorMessage}
                                data-automation="fieldComboSearchTextInput"
                            />
                            {this.state.inputTextError ? (
                                <span className="ComboSearch__formError">{this.state.inputTextError}</span>
                            ) : (
                                    false
                                )}
                        </div>)
                        )}

                    {this.props.hasButton ? (
                        <SmartButton
                            text="Apply"
                            type="submit"
                            className={this.props.classNames.button}
                            isDisabled={!this.isFormValid() || this.props.isInFetchingState || !this.state.inputText}
                            isInPendingState={this.props.isInFetchingState}
                            pendingText={this.props.buttonPendingText || 'Loading...'}
                            dataAutomation="buttonComboSearchApply"
                        />
                    ) : (
                            false
                        )}
                    {!this.props.simpleVersion ? (
                        <FilterBar
                            filters={this.state.appliedFilters}
                            removeFilter={this.removeFilter}
                            disabled={this.props.isInFetchingState}
                            classNames={this.props.filterBarClassNames}
                        />
                    ) : (
                            false
                        )}
                </div>
            </form>
        );
    }
}