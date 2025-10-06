import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { countries } from './countries.js';

export function usePhonePicker(options = {}) {
    const {
        initialValue = '',
        initialCountry = 'US',
        allowedCountries = null,
        sorting = 'alphabetic',
        customOrder = null,
        onchange = () => {}
    } = options;

    const baseCountryList = allowedCountries
        ? countries.filter(c => allowedCountries.includes(c.code))
        : countries;

    function sortCountries(list, sortType, customOrderList = null) {
        switch (sortType) {
            case 'numeric':
                return [...list].sort((a, b) => {
                    const numA = parseInt(a.dialCode.replace(/^\+/, '').replace(/[^\d]/g, ''));
                    const numB = parseInt(b.dialCode.replace(/^\+/, '').replace(/[^\d]/g, ''));
                    return numA - numB;
                });

            case 'custom':
                if (!customOrderList || !Array.isArray(customOrderList)) {
                    return [...list].sort((a, b) => a.name.localeCompare(b.name));
                }

                return [...list].sort((a, b) => {
                    const indexA = customOrderList.indexOf(a.code);
                    const indexB = customOrderList.indexOf(b.code);

                    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;

                    return indexA - indexB;
                });

            case 'alphabetic':
            default:
                return [...list].sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    let input = $state('');
    let dropdownOpen = $state(false);
    let fullValue = $state('');
    let isValid = $state(false);
    let inputElement = null;
    let currentSorting = $state(sorting);
    let currentCustomOrder = $state(customOrder);

    let countryList = $derived(sortCountries(baseCountryList, currentSorting, currentCustomOrder));
    let selectedCountry = $state(countryList.find(c => c.code === initialCountry) || countryList[0]);

    if (initialValue) {
        const parsed = parsePhoneNumberFromString(initialValue);
        if (parsed) {
            const found = countryList.find(c => c.code === parsed.country);
            if (found) selectedCountry = found;
            input = parsed.formatNational();
        } else {
            input = initialValue;
        }
    }

    function handleInput(e) {
        const cursorPos = e.target.selectionStart;
        const prevLength = input.length;
        input = e.target.value;

        const asYou = new AsYouType(selectedCountry.code);
        const formatted = asYou.input(input);
        const parsed = parsePhoneNumberFromString(formatted, selectedCountry.code);
        isValid = parsed ? parsed.isValid() : false;

        fullValue = parsed ? parsed.number : formatted;
        onchange({
            value: fullValue,
            valid: isValid,
            country: selectedCountry.code,
            formatted
        });

        requestAnimationFrame(() => {
            if (inputElement && formatted.length >= prevLength) {
                const lengthDiff = formatted.length - prevLength;
                inputElement.setSelectionRange(cursorPos + lengthDiff, cursorPos + lengthDiff);
            }
        });

        input = formatted;
    }

    function selectCountry(c) {
        selectedCountry = c;
        dropdownOpen = false;
        if (input) {
            const asYou = new AsYouType(c.code);
            input = asYou.input(input);
        }
    }

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function openDropdown() {
        dropdownOpen = true;
    }

    function closeDropdown() {
        dropdownOpen = false;
    }

    function bindInput(element) {
        inputElement = element;
    }

    function changeSorting(newSorting, newCustomOrder = null) {
        currentSorting = newSorting;
        currentCustomOrder = newCustomOrder;
    }

    return {
        get input() { return input; },
        set input(value) { input = value; },
        get selectedCountry() { return selectedCountry; },
        get dropdownOpen() { return dropdownOpen; },
        set dropdownOpen(value) { dropdownOpen = value; },
        get countryList() { return countryList; },
        get fullValue() { return fullValue; },
        get isValid() { return isValid; },
        get currentSorting() { return currentSorting; },
        get currentCustomOrder() { return currentCustomOrder; },
        handleInput,
        selectCountry,
        toggleDropdown,
        openDropdown,
        closeDropdown,
        bindInput,
        changeSorting
    };
}