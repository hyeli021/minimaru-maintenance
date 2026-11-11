'use client';
import { getDocumentLength } from '@/utils/form';
import styled from '@emotion/styled';
import { DOCUMENT_MAX_LENGTH } from '@/constants/form';
import { useFormSection } from '@/hooks/useFormSection';
import type { FieldErrors } from '@/schemas/form';
import color from '@/styles/color';
import font from '@/styles/font';
import type { FormDocument } from '@/types/form';
import { Description, ErrorText, FieldGroup, FieldLabel, StepSection, StepTitle } from '../styles';

const FIELDS: { key: keyof FormDocument; label: string; placeholder: string }[] = [
  {
    key: 'coverLetter',
    label: '자기소개서',
    placeholder: '지원 동기와 소프트웨어 분야에 관심을 갖게 된 계기를 작성해주세요.',
  },
  {
    key: 'studyPlan',
    label: '학업계획서',
    placeholder: '입학 후 3년 동안의 학업 계획과 졸업 후 진로를 작성해주세요.',
  },
];

const DocumentStep = ({ errors }: { errors: FieldErrors }) => {
  const { section: document, update } = useFormSection('document');

  return (
    <StepSection>
      <StepTitle>자기소개서</StepTitle>
      <Description>각 항목은 공백 포함 {DOCUMENT_MAX_LENGTH}자 이내로 작성해주세요. 줄바꿈은 2자로 계산합니다.</Description>
      {FIELDS.map(({ key, label, placeholder }) => (
        <FieldGroup key={key}>
          <FieldLabel>{label}</FieldLabel>
          <TextArea
            placeholder={placeholder}
            maxLength={DOCUMENT_MAX_LENGTH}
            value={document[key]}
            onChange={(e) => update(key, e.target.value)}
            hasError={Boolean(errors[key])}
            aria-invalid={Boolean(errors[key])}
          />
          <Footer>
            {errors[key] ? <ErrorText>{errors[key]}</ErrorText> : <span />}
            <Count>
              {getDocumentLength(document[key])} / {DOCUMENT_MAX_LENGTH}
            </Count>
          </Footer>
        </FieldGroup>
      ))}
    </StepSection>
  );
};

export default DocumentStep;

const TextArea = styled.textarea<{ hasError: boolean }>`
  ${font.p2};
  height: 280px;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid ${({ hasError }) => (hasError ? color.red : color.gray400)};
  resize: vertical;
  outline: none;

  &:focus {
    border-color: ${color.maruDefault};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Count = styled.span`
  ${font.caption};
  color: ${color.gray600};
`;
