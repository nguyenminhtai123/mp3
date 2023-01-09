// Đối tượng

function Validator(options) {

    var selectorRules = {}

    function validate (inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        
        // Lấy ra các rules của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rules và kiểm tra
        // Nếu có lỗi thì dừng vc kiểm tra
        for (var i = 0; i < rules.length; ++i) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function (rule) {
            var inputElement = formElement.querySelector(rule.selector);

            // Lưu lại các rules cho input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            if (inputElement) {
                // Xử lí khi user blur khỏi input element
                inputElement.onblur = function () {
                    validate(inputElement, rule)
                }

                // Xử lí khi user nhập vào input element
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector('.form-msg');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}

// Rule Definition

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : message || 'Trường này phải là Email'
        }
    }
}

Validator.minLength = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue () ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}