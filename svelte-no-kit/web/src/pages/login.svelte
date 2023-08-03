<script lang="ts">
  import Layout from "~/components/layout.svelte";
  import Navbar from "~/components/navbar.svelte";
  import { z } from "zod";

  import { userStore } from "~/lib/user";

  const schema = z.object({
    name: z.string().nonempty("required"),
    email: z.string().email().nonempty(),
  });

  function submit(event: SubmitEvent) {
    const data = schema.parse(
      Object.fromEntries(new FormData(event.target as HTMLFormElement))
    );

    console.log(data);

    $userStore.name = data.name;
    $userStore.email = data.email;
  }
</script>

<Navbar />
<Layout>
  <h1>LOGIN</h1>
  <p>Questa e` la pagina di login</p>

  <form
    on:submit|preventDefault={submit}
    class="flex flex-col mt-6 gap-2 max-w-md"
  >
    <label class="flex justify-between">
      <span>Name</span>
      <input type="text" name="name" class="text-black" />
    </label>
    <label class="flex justify-between">
      <span>Email</span>
      <input type="text" name="email" class="text-black" />
    </label>
    <button type="submit" class="btn w-64 mx-auto"> Aggiorna utente </button>
  </form>
</Layout>
