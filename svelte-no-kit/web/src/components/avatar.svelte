<script lang="ts">
  import { userStore } from "~/lib/user";
</script>

<div>
  <div>
    name: {$userStore.name}
  </div>
  <div>
    email: {$userStore.email}
  </div>
</div>
