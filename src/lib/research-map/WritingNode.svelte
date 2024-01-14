<script>
	import { Card, Input, Textarea, CloseButton, Label, Modal, Button } from 'flowbite-svelte';
	import { WindowRestoreOutline } from 'flowbite-svelte-icons';
	import { supabase } from '$lib/supabaseClient';

	export let section;

	// placeholder if there is no display obj attached
	if (!section.displayObj) {
		section.displayObj = {
			title: ''
		};
	}
	// Drag and drop nodes
	const onDragOver = (event) => {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}
	};

	// When display obj is dropped into card
	const onDrop = (event) => {
		event.preventDefault();
		if (!event.dataTransfer) {
			return null;
		}
		section.displayObj = JSON.parse(event.dataTransfer.getData('application/svelteflow'));
	};

	// Get preview
	const downloadResource = async (path) => {
		try {
			const { data, error } = await supabase.storage.from('resources').download(path);

			if (error) {
				throw error;
			}

			return URL.createObjectURL(data);
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message);
			}
		}
	};

	// Load the preview url into a var
	// to avoid rerendering when other properties of the object
	let previewUrl = section.displayObj.url;
	$: previewUrl = section.displayObj.url;
	let maximise = false,
		preview;

	$: preview = downloadResource(previewUrl);
</script>

{#if maximise}
	<div
		class="z-50 fixed top-0 left-0 w-screen h-screen flex
	items-center justify-center max-w-none"
	>
		<Modal
			bind:open={maximise}
			defaultClass="node relative bg-secondary-50 gap-y-2 w-3/4 h-3/4 m-10 max-w-none max-h-none"
		>
			<div class="">
				<Label class="text-black">Edit section</Label>
			</div>
			<div on:dragover={onDragOver} on:drop={onDrop} class="my-5 mx-3">
				<div class="flex">
					<section class="w-40 flex-auto">
						{#await preview}
							Loading...
						{:then preview}
							<img src={preview} alt="preview" class="w-full h-full object-contain" />
						{/await}
					</section>
					<section class="w-60 flex-auto p-5">
						<Label for="title" class="text-grey-200 mb-1">Title</Label>
						<Input
							id="title"
							type="text"
							class="text-black"
							placeholder="What is the title of this section"
							bind:value={section.title}
						/>
						<Label for="bodytext" class="text-grey-200 mb-1">Bodytext</Label>
						<Textarea
							id="bodytext"
							type="text"
							class="text-black h-80"
							placeholder="Bodytext"
							bind:value={section.bodytext}
						/>
					</section>
				</div>
			</div></Modal
		>
	</div>
{:else}
	<Card class="node relative bg-secondary-50 gap-y-2 p-0" padding="none">
		<div class="bg-secondary-100 w-full object-right">
			<Button class="p-1 absolute right-0" on:click={() => (maximise = true)}
				><WindowRestoreOutline class="w-3 h-3" /></Button
			>
		</div>
		<div on:dragover={onDragOver} on:drop={onDrop} class="px-3 pb-2">
			<Label for="title" class="text-grey-200 mb-1">Title</Label>
			<Input
				id="title"
				type="text"
				class="text-black"
				placeholder="What is the title of this section"
				bind:value={section.title}
			/>
			<Label for="bodytext" class="text-grey-200 mb-1">Bodytext</Label>
			<Textarea
				id="bodytext"
				type="text"
				class="text-grey-700"
				placeholder="Bodytext"
				bind:value={section.bodytext}
			/>
			<Input
				class="bg-primary-200 p-1"
				type="text"
				placeholder="Drag and drop an annotated obj here"
				name="displayObj"
				bind:value={section.displayObj.title}
			/>
		</div>
	</Card>
{/if}
