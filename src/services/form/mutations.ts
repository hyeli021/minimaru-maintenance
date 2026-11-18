import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { formAtom, lastSavedAtAtom } from '@/stores';
import type { Form } from '@/types/form';
import { getErrorMessage } from '@/utils/error';
import { toSubmitRequest } from '@/utils/form';
import { postForm, postProfile, putDraft } from './api';

export const useSaveDraftMutation = () => {
  const setForm = useSetAtom(formAtom);
  const setLastSavedAt = useSetAtom(lastSavedAtAtom);

  return useMutation({
    mutationFn: (form: Form) => putDraft(form),
    onSuccess: ({ form, savedAt }) => {
      setForm(form);
      setLastSavedAt(savedAt);
    },
    onError: (error) => alert(getErrorMessage(error, '임시저장에 실패했습니다.')),
  });
};

export const useSubmitFormMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (form: Form) => postForm(toSubmitRequest(form)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formStatus'] });
      router.push('/form/complete');
    },
    onError: () => alert('제출에 실패했습니다. 잠시 후 다시 시도해주세요.'),
  });
};

export const useUploadProfileMutation = () =>
  useMutation({
    mutationFn: (file: File) => postProfile(file),
    onError: (error) => alert(getErrorMessage(error, '사진 업로드에 실패했습니다.')),
  });
