<script lang="ts">
  export let value: string
</script>

<textarea type="text" bind:value={value} />

<style>
  textarea {
    padding: 0.25em 0.56em;
    resize: none;
    border-color: var(--excel__cell__border-color);
    border-radius: 5px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.04);
    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);
  }
</style>
