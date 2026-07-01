import { redirect } from "next/navigation";

/** 회원가입은 로그인 페이지에서 처리합니다. */
export default function RegisterPage() {
  redirect("/login?signup=1");
}
