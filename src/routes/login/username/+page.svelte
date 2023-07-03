<script lang="ts">
  import AuthCheck from "$lib/components/AuthCheck.svelte";
  import { db, user, userData } from "$lib/firebase";
  import { doc, getDoc, writeBatch } from "firebase/firestore";

  let username = "";
  let loading = false;
  let isAvailable = false;

  let debounceTimer: NodeJS.Timeout;

  const re = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

  $: isValid = username?.length >= 3 && username.length <= 20 && re.test(username);
  $: isTouched = username.length > 0;
  $: isTaken = isValid && !loading && !isAvailable;

  async function checkAvailability() {
    isAvailable = false;
    clearTimeout(debounceTimer);
    loading = true;

    debounceTimer = setTimeout(async () => {
      const ref = doc(db, "usernames", username);
      const exists = await getDoc(ref).then(doc => doc.exists());

      isAvailable = !exists;
      loading = false;
    }, 500);
  }

  async function confirmUsername() {
    const batch = writeBatch(db);
    batch.set(doc(db, "usernames", username), { uid: $user?.uid });
    batch.set(doc(db, "users", $user!.uid), {
      username,
      photoURL: $user?.photoURL ?? null,
      published: true,
      bio: "",
      links: []
    });

    await batch.commit();
  }
</script>

<AuthCheck>
  {#if $userData.username}
    <p class="text-lg">Your username is <span class="text-success font-bold">@{$userData.username}</span></p>
    <p class="text-sm">(Usernames can not be changed)</p>
    <a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
  {:else}
    <h2>Username</h2>
    <form class="w-2/5" on:submit|preventDefault={confirmUsername}>
      <input
        type="text"
        placeholder="Username"
        class="input w-full"
        bind:value={username}
        on:input={checkAvailability}
        class:input-error={isTouched && !isValid}
        class:input-warning={isTaken}
        class:input-success={!loading && isValid && isAvailable}
      />
      <div class="my-4 min-h-16 px-8 w-full">
        {#if loading}
          <p class="text-secondary">Checking availability of @{username}...</p>
        {/if}

        {#if isTouched && !isValid}
          <p class="text-error text-sm">must be 3-20 characters long, alphanumeric only</p>
        {/if}

        {#if !loading && isValid && !isAvailable}
          <p class="text-warning text-sm">@{username} is not available</p>
        {/if}

        {#if isValid && isAvailable}
          <button class="btn btn-success">Confirm username @{username}</button>
        {/if}
      </div>
    </form>
  {/if}
</AuthCheck>
