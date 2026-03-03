<template>
  <div :class="markdown()" v-html="sanitizedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { tv } from 'tailwind-variants'

const props = defineProps<{
  content: string
}>()

marked.setOptions({
  gfm: true,
  breaks: true,
})

const sanitizedHtml = computed(() =>
  DOMPurify.sanitize(marked.parse(props.content) as string),
)

const styles = tv({
  slots: {
    markdown: ['ai-markdown text-inherit'],
  },
})

const { markdown } = styles()
</script>

<style scoped>
.ai-markdown :deep(p),
.ai-markdown :deep(ul),
.ai-markdown :deep(ol),
.ai-markdown :deep(pre),
.ai-markdown :deep(blockquote) {
  margin: 0 0 0.45rem;
}

.ai-markdown :deep(p:last-child),
.ai-markdown :deep(ul:last-child),
.ai-markdown :deep(ol:last-child),
.ai-markdown :deep(pre:last-child),
.ai-markdown :deep(blockquote:last-child) {
  margin-bottom: 0;
}

.ai-markdown :deep(ul),
.ai-markdown :deep(ol) {
  padding-left: 1rem;
}

.ai-markdown :deep(ul) {
  list-style: disc;
}

.ai-markdown :deep(ol) {
  list-style: decimal;
}

.ai-markdown :deep(code) {
  border-radius: 0.25rem;
  background: rgba(15, 23, 42, 0.85);
  padding: 0.1rem 0.3rem;
  font-size: 0.9em;
}

.ai-markdown :deep(pre) {
  overflow-x: auto;
  border-radius: 0.45rem;
  background: rgba(15, 23, 42, 0.95);
  padding: 0.5rem 0.65rem;
}

.ai-markdown :deep(pre code) {
  background: transparent;
  padding: 0;
}

.ai-markdown :deep(a) {
  color: rgb(167 243 208 / 1);
  text-decoration: underline;
}

.ai-markdown :deep(blockquote) {
  border-left: 2px solid rgba(148, 163, 184, 0.4);
  padding-left: 0.6rem;
  color: rgba(226, 232, 240, 0.9);
}
</style>
