<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOtp } from '@/composables/useOtp'
import { useAuthStore } from '@/stores/authStore'
import Modal from "@/components/modals/Modal.vue";
import {computed, ref} from "vue";

defineProps<{ show: boolean }>()
defineEmits(['close'])

const { requestOtp, verifyOtp, isOtpSent } = useOtp()
const authStore = useAuthStore()

const step = ref(1)

const schema = yup.object({
  email: yup.string().email('Email дұрыс емес').required('Email міндетті'),
  code: yup.string().when('$step', {
    is: 2,
    then: () => yup.string().required('Кодты енгізіңіз'),
    otherwise: () => yup.string().notRequired()
  })
})

const { handleSubmit, values, errors } = useForm({
  validationSchema: schema,
  initialValues: { email: '', code: '' },
  context: computed(() => ({ step: step.value }))
})

const onSubmit = handleSubmit(async (form) => {
  if (step.value === 1) {
    const sent = await requestOtp(form.email)
    if (sent) step.value = 2
  } else {
    const success = await verifyOtp(form.email, form.code)
    if (success) {
      await authStore.login(form.email)
      step.value = 1
      emit('close')
    }
  }
})
</script>

<template>
  <Modal :show="show" @close="$emit('close')">
    <div class="text-center space-y-6">
      <!-- Google Auth -->
      <button
          class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          @click="authStore.loginWithGoogle"
      >
        Google арқылы кіру
      </button>

      <div class="relative my-4">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300" />
        </div>
        <div class="relative text-sm text-gray-500 bg-white px-2">
          немесе
        </div>
      </div>

      <!-- Email / OTP -->
      <form @submit.prevent="onSubmit" class="space-y-4 text-left">
        <div>
          <label class="text-sm font-medium text-gray-700">Email</label>
          <input
              v-model="values.email"
              type="email"
              class="w-full border rounded px-3 py-2 mt-1"
              placeholder="example@mail.kz"
          />
          <div v-if="errors.email" class="text-red-500 text-sm mt-1">
            {{ errors.email }}
          </div>
        </div>

        <div v-if="step === 2">
          <label class="text-sm font-medium text-gray-700">Код</label>
          <input
              v-model="values.code"
              type="text"
              class="w-full border rounded px-3 py-2 mt-1"
              placeholder="123456"
          />
          <div v-if="errors.code" class="text-red-500 text-sm mt-1">
            {{ errors.code }}
          </div>
        </div>

        <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {{ step === 1 ? 'Код жіберу' : 'Кіру' }}
        </button>
      </form>
    </div>
  </Modal>
</template>
