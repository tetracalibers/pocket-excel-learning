<script lang="ts">
  import { onMount } from "svelte"
</script>

<button type="button">
  <slot />
</button>

<style>
  button {
    border: none;
    background: none;
    appearance: none;
    box-sizing: border-box;

    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);

    background-color: var(--excel__header_cell__background-color);
    padding: 8px;
    width: 100%;
  }
</style>
