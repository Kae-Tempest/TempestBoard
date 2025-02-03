<script setup lang="ts">

const route = useRoute()

onMounted(() => {
  setTimeout(async () => {
    await useCustomFetch(`/accept/`, {
      method: 'POST',
      body: {token: route.query.token}
    })
    navigateTo('/project')
  }, 5000)
})


</script>

<template>
  <h1 class="title is-1">You have successfully joined the project!</h1>
</template>