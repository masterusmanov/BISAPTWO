import { ref, reactive } from 'vue';

export function useModal(maxFiles = 20) {
  const open = ref(false);
  const type = ref('');
  const isSubmitting = ref(false);
  const formData = reactive({ answare: '' });
  const fileState = reactive({ files: [], maxFiles });

  const show = (modalType) => {
    type.value = modalType;
    open.value = true;
    reset();
  };

  const close = () => {
    open.value = false;
    type.value = '';
    reset();
  };

  const reset = () => {
    formData.answare = '';
    fileState.files = [];
  };

  const handleFileUpload = (event, toast) => {
    const selectedFiles = Array.from(event.target.files);
    if (fileState.files.length + selectedFiles.length > fileState.maxFiles) {
      toast.error(`Maksimal ${fileState.maxFiles} ta fayl yuklash mumkin!`, { autoClose: 2000 });
      return;
    }
    selectedFiles.forEach(file => {
      fileState.files.push({
        id: Date.now() + Math.random(),
        file: file,
        name: file.name,
        size: file.size,
        uploading: false,
        uploaded: false
      });
    });
    event.target.value = '';
  };

  return {
    open, type, isSubmitting, formData, fileState, show, close, reset, handleFileUpload
  };
} 