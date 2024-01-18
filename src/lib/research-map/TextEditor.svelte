<script>
	import StarterKit from '@tiptap/starter-kit';
	import { Editor } from '@tiptap/core';
	import { onMount } from 'svelte';

	import TextBold from 'virtual:icons/carbon/text-bold';
	import TextItalic from 'virtual:icons/carbon/text-italic';
	import TextStrikeThrough from 'virtual:icons/carbon/text-strikethrough';
	import TextUnderline from 'virtual:icons/carbon/text-underline';
	import Code from 'virtual:icons/carbon/code';
	import TextAlignLeft from 'virtual:icons/carbon/text-align-left';
	import TextAlignCenter from 'virtual:icons/carbon/text-align-center';
	import TextAlignRight from 'virtual:icons/carbon/text-align-right';
	import TextAlignJustify from 'virtual:icons/carbon/text-align-justify';
	import Quotes from 'virtual:icons/carbon/quotes';
	import Paragraph from 'virtual:icons/carbon/paragraph';
	import Undo from 'virtual:icons/carbon/undo';
	import Redo from 'virtual:icons/carbon/redo';

	let element;
	let editor;
	export let content;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: content,
			onTransaction: () => {
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			}
		});
	});

	$: if (editor) {
		content = editor.getHTML();
	}
</script>

<div class="bg-gray-100 rounded-lg min-h-[50vh]">
	{#if editor}
		<div class="bg-gray-200 rounded-lg py-2 px-2">
			<div class="inline-flex flex-wrap gap-x-1">
				<button
					on:click={() => console.log && editor.chain().focus().toggleBold().run()}
					disabled={!editor.can().chain().focus().toggleBold().run()}
					class={editor.isActive('bold') ? 'is-active' : ''}
				>
					<TextBold />
				</button>
				<button
					on:click={() => editor.chain().focus().toggleItalic().run()}
					disabled={!editor.can().chain().focus().toggleItalic().run()}
					class={editor.isActive('italic') ? 'is-active' : ''}
				>
					<TextItalic />
				</button>
				<button
					on:click={() => editor.chain().focus().toggleStrike().run()}
					disabled={!editor.can().chain().focus().toggleStrike().run()}
					class={editor.isActive('strike') ? 'is-active' : ''}
				>
					<TextStrikeThrough />
				</button>
				<button
					on:click={() => editor.chain().focus().toggleCode().run()}
					disabled={!editor.can().chain().focus().toggleCode().run()}
					class={editor.isActive('code') ? 'is-active' : ''}
				>
					<Code />
				</button>

				<button
					on:click={() => editor.chain().focus().setParagraph().run()}
					class={editor.isActive('paragraph') ? 'is-active' : ''}
				>
					<Paragraph />
				</button>
				<button
					on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
					class={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
				>
					h1
				</button>
				<button
					on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					class={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
				>
					h2
				</button>
				<button
					on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
					class={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
				>
					h3
				</button>
				<button
					on:click={() => editor.chain().focus().toggleBulletList().run()}
					class={editor.isActive('bulletList') ? 'is-active' : ''}
				>
					bullet list
				</button>
				<button
					on:click={() => editor.chain().focus().toggleOrderedList().run()}
					class={editor.isActive('orderedList') ? 'is-active' : ''}
				>
					ordered list
				</button>
				<button
					on:click={() => editor.chain().focus().toggleCodeBlock().run()}
					class={editor.isActive('codeBlock') ? 'is-active' : ''}
				>
					<Code />
				</button>
				<button
					on:click={() => editor.chain().focus().toggleBlockquote().run()}
					class={editor.isActive('blockquote') ? 'is-active' : ''}
				>
					<Quotes />
				</button>
				<button on:click={() => editor.chain().focus().setHorizontalRule().run()}>
					horizontal rule
				</button>
				<button on:click={() => editor.chain().focus().setHardBreak().run()}> hard break </button>
				<button
					on:click={() => editor.chain().focus().undo().run()}
					disabled={!editor.can().chain().focus().undo().run()}
				>
					<Undo />
				</button>
				<button
					on:click={() => editor.chain().focus().redo().run()}
					disabled={!editor.can().chain().focus().redo().run()}
				>
					<Redo />
				</button>
			</div>
		</div>
	{/if}
	<div class=" p-3 rounded-lg overflow-y-scroll h-full" bind:this={element} />
</div>

<style global>
	button {
		padding: 0.1em 0.3em;
		height: fit;
		background-color: lightgray;
		color: black;
		vertical-align: middle;
		margin-bottom: 0.2em;
	}

	/* Basic editor styles */
	.tiptap > * + * {
		margin-top: 0.75em;
		font: sans-serif;
	}
	.tiptap ul,
	.tiptap ol {
		padding: 0 1rem;
	}
	.tiptap h1,
	.tiptap h2,
	.tiptap h3,
	.tiptap h4,
	.tiptap h5,
	.tiptap h6 {
		line-height: 1.1;
	}
	:global(.tiptap code) {
		background-color: rgba(97, 97, 97, 0.1);
		color: #616161;
	}
	.tiptap pre {
		background: #0d0d0d;
		color: #fff;
		font-family: 'JetBrainsMono', monospace;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
	}
	.tiptap pre code {
		color: inherit;
		padding: 0;
		background: gray;
		font-size: 0.8rem;
	}
	.tiptap img {
		max-width: 100%;
		height: auto;
	}
	.tiptap blockquote {
		padding-left: 1rem;
		border-left: 2px solid rgba(13, 13, 13, 0.1);
	}
	.tiptap hr {
		border: none;
		border-top: 2px solid rgba(13, 13, 13, 0.1);
		margin: 2rem 0;
	}
</style>
