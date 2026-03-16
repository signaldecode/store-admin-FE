export interface FormFieldDef {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
}

export const adminFormFields: FormFieldDef[] = [
  {
    name: "email",
    label: "이메일",
    type: "email",
    placeholder: "admin@example.com",
    required: true,
  },
  {
    name: "name",
    label: "이름",
    type: "text",
    placeholder: "관리자 이름",
    required: true,
  },
  {
    name: "password",
    label: "비밀번호",
    type: "password",
    placeholder: "비밀번호 입력",
    required: false,
  },
  {
    name: "role",
    label: "역할",
    type: "select",
    required: true,
  },
];
