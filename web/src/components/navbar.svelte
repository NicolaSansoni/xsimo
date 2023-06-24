<script lang="ts">
  import { Link } from "svelte-routing";
  import Avatar from "./avatar.svelte";
</script>

<div
  class="flex items-center justify-between border-b-2 border-slate-700 bg-slate-900 text-white px-4 py-2"
>
  <nav>
    <Link class="btn" to="/">Home</Link>
    <Link class="btn" to="/login">Login</Link>
  </nav>
  <Avatar />
</div>
