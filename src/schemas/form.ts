import { getDocumentLength } from '@/utils/form';
import { z } from 'zod';
import { DOCUMENT_MAX_LENGTH, SUBJECTS } from '@/constants/form';
import type { Form } from '@/types/form';

const message = '잘못된 입력입니다.';

const phoneNumber = z.string().regex(/^01[016789]\d{7,8}$/, message);
const count = z.coerce.number({ message }).int(message).min(0, message);

export const applicantSchema = z.object({
  name: z.string().trim().min(2, message).max(20, message),
  birthYear: z.coerce.number({ message }).int(message).min(2005, message).max(2015, message),
  birthMonth: z.coerce.number({ message }).int(message).min(1, message).max(12, message),
  birthDay: z.coerce.number({ message }).int(message).min(1, message).max(31, message),
  gender: z.enum(['MALE', 'FEMALE'], { message }),
  phoneNumber,
  profileUrl: z.string().min(1, message),
});

export const guardianSchema = z.object({
  name: z.string().trim().min(2, message).max(20, message),
  relation: z.string().trim().min(1, message),
  phoneNumber,
  zoneCode: z.string().min(1, message),
  address: z.string().min(1, message),
  detailAddress: z.string().trim().min(1, message),
});

export const educationSchema = z
  .object({
    graduationType: z.enum(['EXPECTED', 'GRADUATED', 'QUALIFICATION_EXAMINATION'], { message }),
    schoolName: z.string(),
    schoolCode: z.string(),
    graduationYear: z.coerce.number({ message }).int(message).min(2020, message).max(2028, message),
  })
  .superRefine((value, ctx) => {
    if (value.graduationType !== 'QUALIFICATION_EXAMINATION' && !value.schoolCode) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['schoolName'], message });
    }
  });

export const typeSchema = z
  .object({
    category: z.enum(['REGULAR', 'SPECIAL'], { message }),
    specialType: z.string(),
  })
  .superRefine((value, ctx) => {
    if (value.category === 'SPECIAL' && !value.specialType) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['specialType'], message });
    }
  });

export const gradeSchema = z.object({
  attendance: z.object({
    absenceCount: count,
    latenessCount: count,
    earlyLeaveCount: count,
    classAbsenceCount: count,
  }),
  volunteerHours: count,
});

export const gedScoreSchema = z.object(
  Object.fromEntries(
    SUBJECTS.map((subject) => [
      subject,
      z.coerce.number({ message }).min(0, message).max(100, message),
    ]),
  ),
);

const documentTextSchema = z
  .string()
  .refine((value) => value.trim().length > 0, { message })
  .refine((value) => getDocumentLength(value) <= DOCUMENT_MAX_LENGTH, {
    message: `줄바꿈을 2자로 계산하여 ${DOCUMENT_MAX_LENGTH}자 이내로 작성해주세요.`,
  });

export const documentSchema = z.object({
  coverLetter: documentTextSchema,
  studyPlan: documentTextSchema,
});

export type FieldErrors = Record<string, string>;

const toFieldErrors = (
  result: z.SafeParseReturnType<unknown, unknown>,
  prefix = '',
): FieldErrors => {
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [`${prefix}${issue.path.join('.')}`, issue.message]),
  );
};

export const validateStep = (step: number, form: Form): FieldErrors => {
  switch (step) {
    case 0:
      return toFieldErrors(applicantSchema.safeParse(form.applicant));
    case 1:
      return toFieldErrors(guardianSchema.safeParse(form.guardian));
    case 2:
      return toFieldErrors(educationSchema.safeParse(form.education));
    case 3:
      return toFieldErrors(typeSchema.safeParse(form.type));
    case 4:
      if (form.education.graduationType === 'QUALIFICATION_EXAMINATION') {
        return toFieldErrors(gedScoreSchema.safeParse(form.grade.gedScores), 'gedScores.');
      }
      return toFieldErrors(gradeSchema.safeParse(form.grade));
    case 5:
      return toFieldErrors(documentSchema.safeParse(form.document));
    default:
      return {};
  }
};
