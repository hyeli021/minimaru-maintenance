import dayjs from 'dayjs';
import { SEMESTERS, SUBJECTS } from '@/constants/form';
import type { AchievementLevel, Form, Semester, Subject } from '@/types/form';
import { calculateTotalScore } from './grade';

const createSubjectRecord = <T>(value: T) =>
  Object.fromEntries(SUBJECTS.map((subject) => [subject, value])) as Record<Subject, T>;

export const createInitialForm = (): Form => ({
  applicant: {
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: '',
    phoneNumber: '',
    profileUrl: '',
  },
  guardian: {
    name: '',
    relation: '',
    phoneNumber: '',
    zoneCode: '',
    address: '',
    detailAddress: '',
  },
  education: {
    graduationType: '',
    schoolName: '',
    schoolCode: '',
    graduationYear: '',
  },
  type: {
    category: '',
    specialType: '',
  },
  grade: {
    subjects: Object.fromEntries(
      SEMESTERS.map((semester) => [semester, createSubjectRecord<AchievementLevel>('-')]),
    ) as Record<Semester, Record<Subject, AchievementLevel>>,
    gedScores: createSubjectRecord(''),
    attendance: {
      absenceCount: '0',
      latenessCount: '0',
      earlyLeaveCount: '0',
      classAbsenceCount: '0',
    },
    volunteerHours: '0',
  },
  document: {
    coverLetter: '',
    studyPlan: '',
  },
});

export const formatBirthday = ({ birthYear, birthMonth, birthDay }: Form['applicant']) =>
  dayjs(`${birthYear}-${birthMonth}-${birthDay}`).format('YYYY-MM-DD');

export const toSubmitRequest = (form: Form) => {
  const { name, gender, phoneNumber, profileUrl } = form.applicant;

  return {
    applicant: {
      name,
      gender,
      phoneNumber,
      profileUrl,
      birthday: formatBirthday(form.applicant),
    },
    guardian: form.guardian,
    education: form.education,
    type: form.type,
    grade: form.grade,
    score: calculateTotalScore(form),
    document: form.document,
  };
};

export type SubmitFormRequest = ReturnType<typeof toSubmitRequest>;

export const getDocumentLength = (value: string) =>
  value.replace(/\r\n|\r|\n/g, '\r\n').length;
