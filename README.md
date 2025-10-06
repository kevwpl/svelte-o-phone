# 📞 svelte-o-phone

A flexible, headless phone number input component for Svelte 5 (with runes), powered by `libphonenumber-js`.

[![npm version](https://img.shields.io/npm/v/svelte-o-phone?style=flat-square)](https://www.npmjs.com/package/svelte-o-phone)
[![npm downloads](https://img.shields.io/npm/dm/svelte-o-phone?style=flat-square)](https://www.npmjs.com/package/svelte-o-phone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Svelte 5](https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte)](https://svelte.dev/blog/runes)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 🚀 Installation

Install the package and its peer dependency.

```bash
npm install svelte-o-phone libphonenumber-js
# or pnpm
pnpm add svelte-o-phone libphonenumber-js
# or yarn
yarn add svelte-o-phone libphonenumber-js
```

### Peer Dependencies

`svelte-o-phone` requires `svelte@^5.0.0-next.0` as a peer dependency. Ensure you have Svelte 5 installed in your project.

## 💡 Usage

`svelte-o-phone` provides a headless hook, `usePhonePicker`, for maximum flexibility, and a basic pre-styled `PhonePicker` component (if included in your package exports) for quick setup.

### The Headless `usePhonePicker` Hook

This is the recommended way to integrate for full UI control.

```svelte
<script>
  import { usePhonePicker } from 'svelte-o-phone';
  import { Input } from '$lib/components/ui/input'; // Example Shadcn-Svelte Input
  import { Button } from '$lib/components/ui/button'; // Example Shadcn-Svelte Button
  // ... import other UI components (Popover, Command, Check, ChevronDown etc.)

  let phoneNumber = $state('');
  let countryCode = $state('US'); // Can be dynamically changed or bound

  const picker = usePhonePicker({
    initialValue: phoneNumber,
    initialCountry: countryCode,
    sorting: 'alphabetic', // 'numeric' | 'custom'
    // allowedCountries: ['US', 'GB', 'DE'], // Optional: filter countries
    // customOrder: ['US', 'DE'],          // Optional: for 'custom' sorting
    onchange: (data) => {
      // data: { value: string, valid: boolean, country: string, formatted: string }
      phoneNumber = data.value;
      countryCode = data.country;
      console.log('Current phone state:', data);
    }
  });

  // For refocusing button after selection (accessibility)
  let triggerButtonRef = $state(null); 
  function closeAndFocusTrigger() {
    picker.closeDropdown();
    if (triggerButtonRef) {
      triggerButtonRef.focus();
    }
  }

  // Reactive state for Command.Input search
  let searchValue = $state('');
  const filteredCountryList = $derived(() => {
    if (!searchValue) return picker.countryList;
    const lowerSearch = searchValue.toLowerCase();
    return picker.countryList.filter(c => 
      c.name.toLowerCase().includes(lowerSearch) ||
      c.dialCode.includes(searchValue)
    );
  });
</script>

<!-- Example UI using Shadcn-Svelte components -->
<div class="flex gap-2">
  <Popover.Root bind:open={picker.dropdownOpen}>
    <Popover.Trigger bind:ref={triggerButtonRef} asChild>
      <Button
        variant="outline"
        class="w-[120px] justify-between"
        role="combobox"
        aria-expanded={picker.dropdownOpen}
        aria-label="Select country"
      >
        <div class="flex items-center gap-2 overflow-hidden">
          <span class="text-lg">{picker.selectedCountry.flag}</span>
          <span class="whitespace-nowrap overflow-hidden text-ellipsis">
            {picker.selectedCountry.dialCode}
          </span>
        </div>
        <ChevronDown class="ml-2 size-4 shrink-0 opacity-50" />
      </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[var(--radix-popover-trigger-width)] p-0">
      <Command.Root>
        <Command.Input
          placeholder="Search country..."
          bind:value={searchValue}
        />
        <Command.List>
          <Command.Empty>No country found.</Command.Empty>
          <Command.Group>
            {#each filteredCountryList as c (c.code)}
              <Command.Item
                value={c.name}
                onSelect={() => {
                  picker.selectCountry(c);
                  closeAndFocusTrigger();
                  searchValue = ''; // Clear search after selection
                }}
              >
                <Check
                  class={cn(
                    "mr-2 size-4",
                    c.code !== picker.selectedCountry.code && "text-transparent"
                  )}
                />
                <span class="flag text-lg">{c.flag}</span>
                <span class="name flex-1 ml-2">{c.name}</span>
                <span class="code text-muted-foreground">{c.dialCode}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>

  <Input
    use:picker.bindInput
    type="tel"
    placeholder="Phone number"
    value={picker.input}
    oninput={picker.handleInput}
    aria-label="Phone number input"
    class="flex-1"
  />
</div>

<p>Full Value: {phoneNumber}</p>
<p>Country Code: {countryCode}</p>
<p>Is Valid: {picker.isValid ? 'Yes' : 'No'}</p>
```

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