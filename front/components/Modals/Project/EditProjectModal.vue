<script setup lang="ts">
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {Project} from "~/types/global";
import {reactive, watch} from "vue";

const showModal = defineModel()
const {isRefresh} = useRefreshData()

interface Props {
  project: Project
}

const props = defineProps<Props>()

type formType = {
  name: string,
  description: string,
  thumbnail: File | null,
  status: string
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
    }
  })
})

onMounted(() => {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      showModal.value = false
      resetForm()
    }
  })
})

const resetForm = () => {
  data.name = ''
  data.description = ''
  data.thumbnail = null
  data.status = ''
  error.name = ''
  error.description = ''
  error.thumbnail = ''
}

const data = reactive<formType>({
  name: '',
  description: '',
  thumbnail: null,
  status: ''
})

const error = reactive({
  name: '',
  description: '',
  thumbnail: '',

})

const handleSetThumb = (e: Event) => {
  const target = e.target
  if (target instanceof HTMLInputElement && target.files) {
    data.thumbnail = target.files?.[0]
  }
}

watch(() => showModal.value, (newVal) => {
  if (newVal) {
    data.name = props.project.name
    data.description = props.project.description
  }
})

const handleEdit = async () => {
  const formData = new FormData()
  formData.append('name', data.name)
  formData.append('description', data.description)
  formData.append('thumbnail', data.thumbnail as Blob || '')

  const res = await useCustomFetch(`/projects/${props.project.id}/`, {
    method: 'PATCH',
    body: formData
  })
  if (res.data.value !== null) {
    showModal.value = false
    isRefresh.value = true
  }
  if (res.error.value !== null) {
    console.log(res.error)
    if (res.error.value.data?.name) error.name = res.error.value.data?.name[0]
    if (res.error.value.data?.description) error.description = res.error.value.data?.description[0]
    if (res.error.value.data?.thumbnail) error.thumbnail = res.error.value.data?.thumbnail[0]
  }
}
</script>

<template>
  <div :class="{'is-active': showModal}" class="modal">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box edit-box">
        <h3>Update Project</h3>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" name="name" v-model="data.name"/>
            <span class="error">{{ error.name }}</span>
          </div>
        </div>
        <div class="field">
          <label class="label">Description</label>
          <div class="control">
            <textarea class="textarea" name="description" v-model="data.description"></textarea>
            <span class="error">{{ error.description }}</span>
          </div>
        </div>
        <div class="field">
          <div class="file is-small">
            <label class="file-label">
              <input class="file-input" type="file" name="resume" @input="handleSetThumb($event)"/>
              <span class="file-cta">
                <span class="file-icon">
                    <font-awesome-icon icon="fa-solid fa-upload"/>
                </span>
                <span class="file-label" v-if="data.thumbnail">{{ data.thumbnail?.name }}</span>
                <span v-else class="file-label">Thumbnail..</span>
            </span>
              <span class="error">{{ error.thumbnail }}</span>
            </label>
          </div>
        </div>
        <div class="field">
          <div class="control">
            <button class="button" @click="showModal=false; resetForm()">
              Cancel
            </button>
            <button class="button is-dark" @click="handleEdit">
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
