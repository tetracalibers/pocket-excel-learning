<script lang="ts">
  export let colNumber: number
</script>

<button type="button">
  {String.fromCharCode("A".charCodeAt(0) + colNumber - 1)}
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

    padding: 8px;
    width: 100%;
  }
</style>
