<script lang="ts">
    import {LinearProgress} from "nunui";

    export let title = '', my = 0, total = 0;
</script>

<div>
    <p><span style="font-size: 1.2em">{title}</span> {my}<span style="font-size: 0.8em">/{total}학점</span></p>
    <LinearProgress progress={my / total}/>
</div>

<style lang="scss">
  p {
    margin: 0 0 4px 0;
  }

  div:not(:last-child) {
    margin-bottom: 8px;
  }
</style>