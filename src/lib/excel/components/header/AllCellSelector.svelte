<script lang="ts">
</script>

<button type="button">
  <span class="triangle"></span>
</button>

<style>
  button {
    border: none;
    background: none;
    appearance: none;
    padding: 0;
    box-sizing: border-box;

    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);

    background-color: var(--excel__header_cell__background-color);
    width: 100%;
    height: 100%;
    display: grid;
  }

  .triangle {
    display: block;
    background-color: rgb(183, 183, 183);
    padding: 1em;
    clip-path: polygon(100% 100%, 100% 0, 0 100%, 100% 100%);
  }
</style>
