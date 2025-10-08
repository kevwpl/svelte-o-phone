import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js';
import { countries } from './countries.js';

export function usePhonePicker(options = {}) {
    const {
        initialValue = '',
        initialCountry = 'US',
        allowedCountries = null,
        sorting = 'alphabetic',
        customOrder = null,
        autoDetectCountry = true,
        detectInitialCountry = false,
        detectionPriority = ['language', 'ip'],
        onchange = () => {}
    } = options;

    const baseCountryList = allowedCountries
        ? countries.filter(c => allowedCountries.includes(c.code))
        : countries;

    function sortCountries(list, sortType, customOrderList = null) {
        switch (sortType) {
            case 'numeric':
                return [...list].sort((a, b) => {
                    const numA = parseInt(a.dialCode.replace(/\D/g, ''));
                    const numB = parseInt(b.dialCode.replace(/\D/g, ''));
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
    let internalInputElement = null;
    let currentSorting = $state(sorting);
    let currentCustomOrder = $state(customOrder);
    let ref = $state(null);

    let countryList = $derived(sortCountries(baseCountryList, currentSorting, currentCustomOrder));
    let selectedCountry = $state(countryList.find(c => c.code === initialCountry) || countryList[0]);

    $effect(() => {
        if (!detectInitialCountry) return;

        const detectors = {
            language: () => {
                if (typeof navigator === 'undefined' || !navigator.language) return null;
                const langCode = navigator.language.split('-').pop()?.toUpperCase();
                return countryList.find(c => c.code === langCode) || null;
            },
            ip: async () => {
                try {
                    const response = await fetch('https://ipinfo.io/json');
                    if (!response.ok) return null;
                    const data = await response.json();
                    return countryList.find(c => c.code === data.country) || null;
                } catch (error) {
                    return null;
                }
            }
        };

        (async () => {
            for (const method of detectionPriority) {
                if (detectors[method]) {
                    const country = await detectors[method]();
                    if (country) {
                        selectCountry(country);
                        return;
                    }
                }
            }
        })();
    });

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
        if (!internalInputElement) return;

        const rawValue = e.target.value;
        const cursorPos = internalInputElement.selectionStart;

        if (autoDetectCountry && rawValue.startsWith('+')) {
            let matchedCountry = null;
            const potentialCodeDigits = rawValue.replace(/\D/g, '');
            const possibleMatches = countryList.filter(c => {
                const countryCodeDigits = c.dialCode.replace(/\D/g, '');
                return potentialCodeDigits.startsWith(countryCodeDigits);
            });
            if (possibleMatches.length > 0) {
                matchedCountry = possibleMatches.reduce((longest, current) => {
                    return current.dialCode.length > longest.dialCode.length ? current : longest;
                });
            }
            if (matchedCountry && matchedCountry.code !== selectedCountry.code) {
                selectedCountry = matchedCountry;
            }
        }

        const digitsBeforeCursor = rawValue.substring(0, cursorPos).replace(/\D/g, '').length;
        const startsWithPlus = rawValue.startsWith('+');
        const digitsOnly = rawValue.replace(/\D/g, '');

        if (rawValue === '+') {
            input = '+';
            setTimeout(() => {
                if (internalInputElement) internalInputElement.setSelectionRange(1, 1);
            }, 0);
            return;
        }

        const asYou = new AsYouType(selectedCountry.code);
        let formatted = '';
        if (startsWithPlus) {
            formatted = asYou.input(rawValue);
        } else {
            for (const digit of digitsOnly) {
                formatted = asYou.input(digit);
            }
        }

        const parsed = parsePhoneNumberFromString(formatted, selectedCountry.code);
        isValid = parsed ? parsed.isValid() : false;
        fullValue = parsed ? parsed.number : formatted;
        onchange({ value: fullValue, valid: isValid, country: selectedCountry.code, formatted });
        input = formatted;

        let newCursorPos = 0;
        let digitCount = 0;
        for (let i = 0; i < formatted.length; i++) {
            if (/\d/.test(formatted[i])) digitCount++;
            if (digitCount >= digitsBeforeCursor) {
                newCursorPos = i + 1;
                break;
            }
        }
        if (digitCount < digitsBeforeCursor) newCursorPos = formatted.length;
        if (startsWithPlus && cursorPos <= 1 && newCursorPos === 0) newCursorPos = 1;

        setTimeout(() => {
            if (internalInputElement && document.activeElement === internalInputElement) {
                internalInputElement.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    }

    function selectCountry(c) {
        selectedCountry = c;
        dropdownOpen = false;
        if (input) {
            const digitsOnly = input.replace(/\D/g, '');
            const asYou = new AsYouType(c.code);
            let formatted = '';
            for (const digit of digitsOnly) {
                formatted = asYou.input(digit);
            }
            input = formatted;
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

    function internalBindInput(element) {
        if (element && element.setSelectionRange) {
            internalInputElement = element;
        }
    }

    function changeSorting(newSorting, newCustomOrder = null) {
        currentSorting = newSorting;
        currentCustomOrder = newCustomOrder;
    }

    return {
        get input() { return input; },
        get selectedCountry() { return selectedCountry; },
        get dropdownOpen() { return dropdownOpen; },
        get countryList() { return countryList; },
        get fullValue() { return fullValue; },
        get isValid() { return isValid; },
        get currentSorting() { return currentSorting; },
        get currentCustomOrder() { return currentCustomOrder; },
        get ref() { return ref; },
        set ref(value) { ref = value; internalBindInput(value); },
        handleInput,
        selectCountry,
        toggleDropdown,
        openDropdown,
        closeDropdown,
        changeSorting
    };
}