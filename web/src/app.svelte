<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "~/pages/home.svelte";
  import Login from "~/pages/login.svelte";
</script>

<Router>
  <Route path="/login" component={Login} />
  <Route path="/" component={Home} />
</Router>
