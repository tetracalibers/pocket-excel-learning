<script lang="ts">
  export let value: string
</script>

<textarea type="text" bind:value={value} />

<style>
  textarea {
    resize: none;
  }
</style>
