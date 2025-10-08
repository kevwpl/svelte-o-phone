# 📞 svelte-o-phone

A flexible, headless phone number input component for Svelte, powered by `libphonenumber-js`.

[![npm version](https://img.shields.io/npm/v/svelte-o-phone?style=flat-square)](https://www.npmjs.com/package/@kevwpl/svelte-o-phone)
[![npm downloads](https://img.shields.io/npm/dm/svelte-o-phone?style=flat-square)](https://www.npmjs.com/package/@kevwpl/svelte-o-phone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev/blog/runes)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 🚀 Installation

Install the package and its peer dependency.

```bash
npm install svelte-o-phone libphonenumber-js
```

### Peer Dependencies

`svelte-o-phone` requires `svelte@^5.0.0-next.0` as a peer dependency. Ensure you have Svelte 5 installed in your project.

## 💡 Usage

`svelte-o-phone` provides a headless hook, `usePhonePicker`, for maximum flexibility, and a basic pre-styled `PhonePicker` component (if included in your package exports) for quick setup.

## 📚 API Reference

### `usePhonePicker` Options

| Property        | Type                                                       | Default        | Description                                                                                                                                                                                                        |
| :-------------- | :--------------------------------------------------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `initialValue`  | `string`                                                   | `''`           | The initial full phone number string (e.g., `'+12125551234'`).                                                                                                                                                     |
| `initialCountry`| `string`                                                   | `'US'`         | The initial 2-letter ISO country code (e.g., `'DE'`).                                                                                                                                                               |
| `allowedCountries`| `string[] \| null`                                       | `null`         | An array of 2-letter ISO country codes to limit the selectable countries. If `null`, all countries are allowed.                                                                                                    |
| `sorting`       | `'alphabetic' \| 'numeric' \| 'custom'`                    | `'alphabetic'` | Determines the sort order of the country list. <ul><li>`'alphabetic'`: Sorts by country name (A-Z).</li><li>`'numeric'`: Sorts by dial code (e.g., +1, +7, +20).</li><li>`'custom'`: Uses the order provided in `customOrder`.</li></ul> |
| `customOrder`   | `string[] \| null`                                       | `null`         | An array of 2-letter ISO country codes defining a custom sort order. Countries not in this list will be sorted alphabetically at the end. Only effective when `sorting` is set to `'custom'`.                  |
| `onchange`      | `(data: { value: string, valid: boolean, country: string, formatted: string }) => void` | `() => {}`     | A callback function triggered on every input change or country selection, providing the current state of the phone number.                                                                                             |

### Returned Properties & Methods

| Property      | Type                                                       | Description                                                                                                                                                                                                    |
| :------------ | :--------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `input`       | `string`                                                   | The currently formatted phone number string for display in the input field.                                                                                                                                    |
| `selectedCountry`| `{ code: string; name: string; dialCode: string; flag: string; }` | The currently selected country object.                                                                                                                                                                         |
| `dropdownOpen`| `boolean`                                                  | A reactive boolean indicating if the country dropdown is currently open. Supports `bind:` for external control.                                                                                                  |
| `countryList` | `Array<{ code: string; name: string; dialCode: string; flag: string; }>` | The array of available countries, sorted according to the current `sorting` option.                                                                                                                              |
| `fullValue`   | `string`                                                   | The full international phone number in E.164 format (e.g., `'+12125551234'`) or the formatted number if not yet valid.                                                                                        |
| `isValid`     | `boolean`                                                  | A boolean indicating whether the `fullValue` is a valid phone number.                                                                                                                                          |
| `currentSorting`| `string`                                                 | The current sorting method applied to `countryList`.                                                                                                                                                           |
| `currentCustomOrder`| `string[] \| null`                                   | The current custom order array used when `sorting` is `'custom'`.                                                                                                                                              |
| **Methods**   | **Parameters**                                             | **Description**                                                                                                                                                                                                |
| `handleInput` | `event: Event`                                             | Event handler to be passed directly to the `oninput` event of the `<input type="tel">` element.                                                                                                                |
| `selectCountry`| `country: { code: string; name: string; dialCode: string; flag: string; }` | Selects a specific country. Pass the country object (e.g., from `countryList`).                                                                                                                                 |
| `toggleDropdown`| `-`                                                      | Toggles the `dropdownOpen` state.                                                                                                                                                                              |
| `openDropdown`| `-`                                                      | Sets `dropdownOpen` to `true`.                                                                                                                                                                                 |
| `closeDropdown`| `-`                                                      | Sets `dropdownOpen` to `false` .                                                                                                                                                                               |
| `bindInput`   | `element: HTMLInputElement`                                | A custom action to be used with `use:picker.bindInput` to bind the input element reference for cursor positioning.                                                                                             |
| `changeSorting`| `newSorting: string, newCustomOrder?: string[] \| null`  | Dynamically changes the sorting method of the
