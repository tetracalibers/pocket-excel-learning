<script lang="ts">
  import { onMount } from "svelte"

  export let value = ""
</script>

<button type="button">
  {value}
</button>

<style>
  button {
    border: none;
    background: none;
    appearance: none;
    box-sizing: border-box;

    font-family: var(--font-excel);
    font-weight: var(--font-weight-excel);
    font-size: var(--font-size-excel);

    background-color: #cbd5e1;
    padding: 8px;
    width: 100%;
  }
</style>
