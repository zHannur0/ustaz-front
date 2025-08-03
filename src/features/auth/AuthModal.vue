<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOtp } from '@/composables/useOtp'
import { useAuthStore } from '@/stores/authStore'
import Modal from "@/components/modals/Modal.vue"
import { computed, ref, watch } from "vue"

// Types
interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

// Component setup
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const { requestOtp, verifyOtp, isLoading: isOtpLoading } = useOtp()
const authStore = useAuthStore()

// Reactive state
const step = ref<1 | 2>(1)
const isSubmitting = ref(false)
const countdown = ref(0)
const countdownTimer = ref<NodeJS.Timeout | null>(null)

// Validation schema
const validationSchema = computed(() => {
  const baseSchema = {
    email: yup
        .string()
        .email('Электрондық пошта форматы дұрыс емес')
        .required('Электрондық пошта міндетті өріс')
  }

  if (step.value === 2) {
    return yup.object({
      ...baseSchema,
      code: yup
          .string()
          .matches(/^\d{6}$/, 'Код 6 цифрдан тұруы керек')
          .required('Растау коды міндетті')
    })
  }

  return yup.object(baseSchema)
})

// Form setup
const { handleSubmit, errors, resetForm, setFieldError } = useForm({
  validationSchema,
  initialValues: { email: '', code: '' }
})

const { value: email, errorMessage: emailError } = useField<string>('email')
const { value: code, errorMessage: codeError } = useField<string>('code')

// Methods
const startCountdown = () => {
  countdown.value = 60
  countdownTimer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value!)
      countdownTimer.value = null
    }
  }, 1000)
}

const handleEmailSubmit = async () => {
  try {
    isSubmitting.value = true
    const success = await requestOtp(email.value)

    if (success) {
      step.value = 2
      startCountdown()
    } else {
      setFieldError('email', 'Код жіберу кезінде қате орын алды')
    }
  } catch (error) {
    setFieldError('email', 'Қосылу қатесі. Қайталап көріңіз')
  } finally {
    isSubmitting.value = false
  }
}

const handleCodeSubmit = async () => {
  try {
    isSubmitting.value = true
    const success = await verifyOtp(email.value, code.value)

    if (success) {
      await authStore.login(email.value)
      emit('success')
      handleClose()
    } else {
      setFieldError('code', 'Код дұрыс емес немесе мерзімі өтіп кетті')
    }
  } catch (error) {
    setFieldError('code', 'Растау кезінде қате орын алды')
  } finally {
    isSubmitting.value = false
  }
}

const onSubmit = handleSubmit(async () => {
  if (step.value === 1) {
    await handleEmailSubmit()
  } else {
    await handleCodeSubmit()
  }
})

const handleGoogleAuth = async () => {
  try {
    await authStore.loginWithGoogle()
    emit('success')
    handleClose()
  } catch (error) {
    console.error('Google authentication failed:', error)
  }
}

const resendCode = async () => {
  if (countdown.value > 0) return

  try {
    const success = await requestOtp(email.value)
    if (success) {
      startCountdown()
    }
  } catch (error) {
    console.error('Failed to resend code:', error)
  }
}

const handleClose = () => {
  step.value = 1
  resetForm()
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
    countdownTimer.value = null
  }
  countdown.value = 0
  emit('close')
}

const goBack = () => {
  step.value = 1
  code.value = ''
}

// Watch for modal close to cleanup
watch(() => props.show, (newVal) => {
  if (!newVal) {
    handleClose()
  }
})
</script>

<template>
  <Modal :show="show" @close="handleClose">
    <div class="w-full max-w-md mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {{ step === 1 ? 'Жүйеге кіру' : 'Кодты растау' }}
        </h2>
        <p class="text-gray-600 text-sm">
          {{ step === 1
            ? 'Өз аккаунтыңызға қауіпсіз кіріңіз'
            : `${email} адресіне жіберілген кодты енгізіңіз`
          }}
        </p>
      </div>

      <!-- Google Auth (only on step 1) -->
      <div v-if="step === 1" class="mb-6">
        <button
            type="button"
            @click="handleGoogleAuth"
            class="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium group"
        >
          <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google арқылы кіру
        </button>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500 font-medium">немесе</span>
          </div>
        </div>
      </div>

      <!-- Back button for step 2 -->
      <div v-if="step === 2" class="mb-4">
        <button
            type="button"
            @click="goBack"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Артқа қайту
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="space-y-5">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
            Электрондық пошта
          </label>
          <div class="relative">
            <input
                id="email"
                v-model="email"
                type="email"
                :disabled="step === 2"
                class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
                :class="{
                'border-red-300 focus:ring-red-500 focus:border-red-500': emailError,
                'border-gray-200': !emailError
              }"
                placeholder="example@mail.kz"
                autocomplete="email"
            />
            <div v-if="step === 2" class="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div v-if="emailError" class="mt-2 text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ emailError }}
          </div>
        </div>

        <!-- Code Input (Step 2) -->
        <div v-if="step === 2" class="space-y-3">
          <label for="code" class="block text-sm font-semibold text-gray-700">
            Растау коды
          </label>
          <input
              id="code"
              v-model="code"
              type="text"
              maxlength="6"
              class="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-center text-lg font-mono tracking-widest"
              :class="{
              'border-red-300 focus:ring-red-500 focus:border-red-500': codeError,
              'border-gray-200': !codeError
            }"
              placeholder="000000"
              autocomplete="one-time-code"
          />
          <div v-if="codeError" class="text-sm text-red-600 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ codeError }}
          </div>

          <!-- Resend Code -->
          <div class="text-center">
            <button
                type="button"
                @click="resendCode"
                :disabled="countdown > 0"
                class="text-sm font-medium transition-colors"
                :class="countdown > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-800'"
            >
              {{ countdown > 0
                ? `Қайта жіберу (${countdown}с)`
                : 'Кодты қайта жіберу'
              }}
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
            type="submit"
            :disabled="isSubmitting || isOtpLoading"
            class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg
              v-if="isSubmitting || isOtpLoading"
              class="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ isSubmitting || isOtpLoading
            ? 'Күте тұрыңыз...'
            : (step === 1 ? 'Код жіберу' : 'Кіру')
          }}
        </button>
      </form>

      <!-- Footer -->
      <div class="mt-6 text-center text-xs text-gray-500">
        Жүйеге кіру арқылы сіз біздің
        <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">қызмет шарттарымызбен</a>
        келісесіз
      </div>
    </div>
  </Modal>
</template>

<style scoped>
input:focus {
  outline: none;
}

* {
  transition-property: color, background-color, border-color, transform, box-shadow, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced button hover effects */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
}
</style>