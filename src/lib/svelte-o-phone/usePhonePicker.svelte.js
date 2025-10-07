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
    let internalInputElement = null; // Internal storage for the DOM element
    let currentSorting = $state(sorting);
    let currentCustomOrder = $state(customOrder);
    let ref = $state(null); // Exposed ref variable for binding

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
        const rawValue = e.target.value;

        const asYou = new AsYouType(selectedCountry.code);
        const formatted = asYou.input(rawValue);
        const parsed = parsePhoneNumberFromString(formatted, selectedCountry.code);
        isValid = parsed ? parsed.isValid() : false;

        fullValue = parsed ? parsed.number : formatted;
        onchange({
            value: fullValue,
            valid: isValid,
            country: selectedCountry.code,
            formatted
        });

        input = formatted;

        setTimeout(() => {
            console.log("HAALLLOOO22222")
            if (internalInputElement) {
                const endPos = formatted.length;
                internalInputElement.focus();
                internalInputElement.setSelectionRange(endPos, endPos);
                console.log("HAALLLOOO")
            }
        }, 0);
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

    // Internal bind function - called when ref is set
    function internalBindInput(element) {
        if (element && element.setSelectionRange) {
            internalInputElement = element;
            console.log('Bound input element from ref:', element);
        }
    }

    function changeSorting(newSorting, newCustomOrder = null) {
        currentSorting = newSorting;
        currentCustomOrder = newCustomOrder;
    }

    return {
        get input() { return input; },
        get selectedCountry() { return selectedCountry; },
        set selectedCountry(value) { selectedCountry = value; },
        get selectedCountryCode() { return selectedCountry.code; },
        set selectedCountryCode(value) { selectedCountry = countryList.find(c => c.code === value) || countryList[0]; },
        get dropdownOpen() { return dropdownOpen; },
        get countryList() { return countryList; },
        get fullValue() { return fullValue; },
        get isValid() { return isValid; },
        get currentSorting() { return currentSorting; },
        get currentCustomOrder() { return currentCustomOrder; },
        get ref() { return ref; }, // Expose the ref variable for binding
        set ref(value) { ref = value; internalBindInput(value); }, // Auto-bind when set
        handleInput,
        selectCountry,
        toggleDropdown,
        openDropdown,
        closeDropdown,
        changeSorting
    };
}