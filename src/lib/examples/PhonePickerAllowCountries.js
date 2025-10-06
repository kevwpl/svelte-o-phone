export const phonePickerAllowCountries = `import { PhonePicker } from '<script>
    import { usePhonePicker } from '$lib/svelte-o-phone/usePhonePicker.svelte.js';
    import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
    import * as Select from "$lib/components/ui/select/index.js";
    import {Input} from "$lib/components/ui/input/index.js";

    let {
        value = $bindable(''),
        country = $bindable(null),
        placeholder = 'Phone number',
        onchange = () => {}
    } = $props();

    const picker = usePhonePicker({
        initialValue: value,
        initialCountry: country || 'US',
        sorting: 'numeric',
        allowedCountries: ['US', 'CA', 'GB', 'AT'],
        onchange: (data) => {
            value = data.value;
            country = data.country;
            onchange(data);
        }
    });
</script>


<ButtonGroup.Root>
    <Select.Root open={picker.dropdownOpen} type="single">
        <Select.Trigger onclick={() => picker.toggleDropdown()}>
            <span>{picker.selectedCountry.flag}</span>
            <span>{picker.selectedCountry.dialCode}</span>
        </Select.Trigger>
        <Select.Content>
            {#each picker.countryList as c}
                <li
                        class="flex gap-2 items-center p-2 cursor-pointer"
                        role="option"
                        onclick={() => picker.selectCountry(c)}>
                    <span class="flag">{c.flag}</span>
                    <span class="name">{c.name}</span>
                    <span class="code">{c.dialCode}</span>
                </li>
            {/each}
        </Select.Content>
    </Select.Root>
    <Input
            type="tel"
            {placeholder}
            bind:value={picker.input}
            oninput={picker.handleInput}
            aria-label="Phone number input"
    />
</ButtonGroup.Root>`;