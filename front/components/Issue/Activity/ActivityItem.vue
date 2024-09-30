<script setup lang="ts">
import type {Activity, User} from "~/types/global";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

interface Props {
  activity: Activity
}
const props = defineProps<Props>()
const user = ref<User>()

onMounted(async () => {
  dayjs.extend(relativeTime);
  const {data: fetchedUser} = await useCustomFetch<User>(`users/${props.activity.user}`)
  if(fetchedUser) user.value = fetchedUser.value as User
})

</script>

<template>
  <div v-if="user">
    {{ user.username }} - {{ useCapitalize(activity.content) }} - {{ dayjs().to(dayjs(activity.updated_at)) }}
  </div>

</template>

<style scoped>

</style>


