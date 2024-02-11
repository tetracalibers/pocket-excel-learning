<script lang="ts">
  import { onMount } from "svelte"

  export let value = ""
  export let setAsActiveCell: () => void

  let editMode: boolean = false
</script>

<div class="auto-resizer container">
  <input
    type="text"
    bind:value={value}
    on:click={() => {
      setAsActiveCell()
      editMode = true
    }}
    on:blur={() => {
      editMode = false
    }}
    readonly={!editMode}
  />
  <div class="fake" aria-hidden="true">{value}</div>
</div>

<style>
  /** ref: https://css-tricks.com/auto-growing-inputs-textareas/#aa-other-ideas */
  .auto-resizer {
    display: grid;
    grid-template-columns: minmax(max-content, 100%);
    width: 100%;
    box-sizing: border-box;
  }

  .fake,
  input {
    width: auto;
    min-width: 1em;
    padding: 8px;
    grid-column: 1 / 1;
    border: none;
    background: none;
    appearance: none;
    box-sizing: border-box;
    font-family: var(--excel__font);
    font-weight: var(--excel__font-weight);
    font-size: var(--excel__font-size);
  }

  .fake {
    visibility: hidden;
    height: 0;
    padding-block: 0;
  }

  input {
    outline: none;
  }

  .container:focus-within {
    outline: 2px solid var(--excel__cell__highlight-color);
    outline-offset: -1px;
  }
</style>
