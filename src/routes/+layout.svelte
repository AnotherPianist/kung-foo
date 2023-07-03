<script>
  import "../app.css";
  import { user, userData } from "$lib/firebase.js";

  $user;
  $userData;
</script>

<div class="min-h-screen flex flex-col">
  <slot />
</div>
