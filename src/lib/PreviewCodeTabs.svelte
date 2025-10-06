<script>
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as Code from '$lib/components/ui/code';
    import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { ClipboardIcon } from "@lucide/svelte";
    import { CopyButton } from '$lib/components/ui/copy-button';

    let {
        code = '',
        lang = 'svelte',
        height = 'h-[300px]',
        defaultValue = 'preview',
        class: className = '',
        preview,
        children = null
    } = $props();
</script>

<Tabs.Root value={defaultValue} class={className}>
    <Tabs.List class="flex w-full justify-between">
        <span>
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </span>
        <Button variant="ghost" size="icon">
            <CopyButton text={code}>
                {#snippet icon()}
                    <ClipboardIcon />
                {/snippet}
            </CopyButton>
        </Button>
    </Tabs.List>
    <Tabs.Content value="preview">
        <ScrollArea class="w-full border p-2 rounded-md {height}">
            <div class="flex w-full justify-center items-center h-full">
                {#if preview}
                    {@render preview()}
                {:else if children}
                    {@render children()}
                {/if}
            </div>
        </ScrollArea>
    </Tabs.Content>
    <Tabs.Content value="code">
        <div class="w-full border p-2 rounded-md {height}">
            <Code.Root {code} {lang} variant="secondary" class="w-full bg-white overflow-hidden" />
        </div>
    </Tabs.Content>
</Tabs.Root>