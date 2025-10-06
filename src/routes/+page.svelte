<script>
    import PhonePickerDefault from '$lib/examples/PhonePickerDefault.svelte';
    import phonePickerDefaultCode from '$lib/examples/PhonePickerDefault.svelte?raw';

    import PhonePickerAlphabetic from '$lib/examples/PhonePickerAlphabetic.svelte';
    import phonePickerAlphabeticCode from "$lib/examples/PhonePickerAlphabetic.svelte?raw";

    import PhonePickerAllowCountries from "$lib/examples/PhonePickerAllowCountries.svelte";
    import phonePickerAllowCountriesCode from "$lib/examples/PhonePickerAllowCountries.svelte?raw";

    import {Badge} from "$lib/components/ui/badge/index.js";
    import {PMCommand} from "$lib/components/ui/pm-command/index.js";
    import PreviewCodeTabs from "$lib/PreviewCodeTabs.svelte";
    import { Phone, Info } from "@lucide/svelte";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as Code from '$lib/components/ui/code';
    import * as Toc from '$lib/components/ui/toc';
    import * as Alert from "$lib/components/ui/alert/index.js";
    import {UseToc} from "$lib/hooks/use-toc.svelte.js";


    const toc = new UseToc();

    // --- State for Default PhonePicker ---
    let phoneValueDefault = $state('');
    let phoneCountryDefault = $state('US');
    let resultDefault = $state({});
    function handleChangeDefault(data) { resultDefault = data; }

    // --- State for Alphabetic PhonePicker ---
    let phoneValueAlphabetic = $state('');
    let phoneCountryAlphabetic = $state('DE');
    let resultAlphabetic = $state({});
    function handleChangeAlphabetic(data) { resultAlphabetic = data; }

    // --- State for Allow Countries PhonePicker ---
    let phoneValueAllowCountries = $state('');
    let phoneCountryAllowCountries = $state('US');
    let resultAllowCountries = $state({});
    function handleChangeAllowCountries(data) { resultAllowCountries = data; }
</script>

<svelte:head>
    <title>svelte-o-phone</title>
</svelte:head>

<main class="max-w-2xl mx-auto p-4 mt-20" bind:this={toc.ref}>
    <div class="space-y-4">
        <h1 class="text-4xl font-bold flex items-center gap-2 justify-between w-full">
            svelte-o-phone
            <Phone />
        </h1>
        <p class="text-lg text-muted-foreground flex items-center gap-2">
            A flexible, headless phone number input component with country selection, formatting, and validation.
        </p>
        <div class="flex gap-2">
            <Badge variant="secondary">Svelte 5</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Headless</Badge>
            <Badge variant="secondary">Accessible</Badge>
        </div>
    </div>


    <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-4" id="usage">Basic Usage</h2>
        <p class="text-muted-foreground mb-4">The basic setup for a phone number picker.</p>
        <PreviewCodeTabs code={phonePickerDefaultCode} class="mt-5">
            {#snippet preview()}
                <PhonePickerDefault
                        bind:value={phoneValueDefault}
                        bind:country={phoneCountryDefault}
                        onchange={handleChangeDefault}
                />
            {/snippet}
        </PreviewCodeTabs>

        <Item.Root class="mt-5" variant="muted">
            <Item.Content>
                <Item.Header class="font-bold text-base">Output</Item.Header>
                <Code.Root variant="secondary" class="bg-white" code={JSON.stringify(resultDefault, null, 2)}></Code.Root>
            </Item.Content>
        </Item.Root>
    </div>

    <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-4" id="installation">Installation</h2>
        <Alert.Root class="mt-4">
            <Info />
            <Alert.Title>More package managers coming soon...</Alert.Title>
        </Alert.Root>
        <PMCommand class="mt-2" command="add" args={['@kevwpl/svelte-o-phone']} agents={['npm']} />

        <p class="text-muted-foreground my-4">
            This component relies on <span class="font-mono">libphonenumber-js</span> for phone number parsing, formatting, and validation.
            This package will be installed automatically when you install <span class="font-mono">svelte-o-phone</span>.
        </p>

    </div>


    <div class="mt-8 space-y-3">
        <h2 class="text-2xl font-semibold mb-4" id="more-examples">More Examples</h2>
        <p class="text-muted-foreground">Explore different customizations and features.</p>

        <div class="space-y-4 mt-8">
            <h3 class="text-xl font-semibold">Alphabetic Sorting</h3>
            <p class="text-muted-foreground">Sorts countries alphabetically by name.</p>
            <PreviewCodeTabs code={phonePickerAlphabeticCode} class="mt-5">
                {#snippet preview()}
                    <PhonePickerAlphabetic
                            bind:value={phoneValueAlphabetic}
                            bind:country={phoneCountryAlphabetic}
                            onchange={handleChangeAlphabetic}
                    />
                {/snippet}
            </PreviewCodeTabs>
        </div>

        <div class="space-y-4 mt-8">
            <h3 class="text-xl font-semibold">Allowed Countries</h3>
            <p class="text-muted-foreground">Limits the country selection to a specified list.</p>
            <PreviewCodeTabs code={phonePickerAllowCountriesCode} class="mt-5">
                {#snippet preview()}
                    <PhonePickerAllowCountries
                            bind:value={phoneValueAllowCountries}
                            bind:country={phoneCountryAllowCountries}
                            onchange={handleChangeAllowCountries}
                    />
                {/snippet}
            </PreviewCodeTabs>
        </div>
    </div>
</main>

<div class="fixed top-20 left-10">
    <Toc.Root toc={toc.current}/>
</div>