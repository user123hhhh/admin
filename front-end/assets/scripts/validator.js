function Validator(options) {
    let selectorRules = {};

    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    function validate(inputElement, rule) {
        let errorElement = getParent(
            inputElement,
            options.formGroupSelector,
        ).querySelector(options.errorSelector);
        let errorMessage;
        let rules = selectorRules[rule.selector];

        for (let i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);

            if (errorMessage) {
                break;
            }
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add(
                'invalid',
            );
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove(
                'invalid',
            );
        }

        return !errorMessage;
    }

    let formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();

            let isFormValid = true;

            options.rules.forEach((rule) => {
                let inputElement = formElement.querySelector(rule.selector);
                let isValid = validate(inputElement, rule);

                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {
                    let enableInputs = formElement.querySelectorAll('[name]');
                    let formValues = [...enableInputs].reduce(
                        (values, input) => {
                            values[input.name] = input.value;
                            return values;
                        },
                        {},
                    );
                    options.onSubmit(formValues, options.currentData);
                } else {
                    formElement.submit();
                }
            }
        };

        options.rules.forEach((rule) => {
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            let inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = () => {
                    validate(inputElement, rule);
                };

                inputElement.oninput = () => {
                    let errorElement = getParent(
                        inputElement,
                        options.formGroupSelector,
                    ).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    getParent(
                        inputElement,
                        options.formGroupSelector,
                    ).classList.remove('invalid');
                };
            }
        });
    }
}

Validator.isRequired = (selector) => ({
    selector,
    test(value) {
        return value.trim() ? undefined : 'Vui l??ng nh???p tr?????ng n??y';
    },
});

Validator.isEmail = (selector) => ({
    selector,
    test(value) {
        let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        return regex.test(value) ? undefined : 'Tr?????ng n??y ph???i l?? email';
    },
});

Validator.minLength = (selector, min) => ({
    selector,
    test(value) {
        return value.length >= min
            ? undefined
            : `Vui l??ng nh???p t???i thi???u ${min} k?? t???`;
    },
});

Validator.maxLength = (selector, max) => ({
    selector,
    test(value) {
        return value.length <= max
            ? undefined
            : `Vui l??ng nh???p ??t h??n ${max} k?? t???`;
    },
});

Validator.isConfirmed = (selector, getConfirmValue, message) => ({
    selector,
    test(value) {
        return value === getConfirmValue
            ? undefined
            : message || 'Gi?? tr??? nh???p v??o kh??ng ch??nh x??c';
    },
});

Validator.minValue = (selector, min, message) => ({
    selector,
    test(value) {
        return value >= min
            ? undefined
            : message || `Ph???i l???n h??n ${min}`;
    },
});

Validator.maxValue = (selector, max, message) => ({
    selector,
    test(value) {
        return value <= max
            ? undefined
            : message || `Ph???i b?? h??n ${max}`;
    },
});
