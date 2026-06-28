export type AuthorEducation = {
  label: string;
};

export const author = {
  name: "정대영",
  title: "대표 변호사",
  summary: "총 법조 경력 약 19년 · 송무 500건 이상",
  bio: "사법연수원 제36기 출신으로 약 19년간 공익법무관·로펌·대표변호사를 거치며 500건 이상의 송무를 수행했습니다. 민사·행정 전문변호사이자 공인중개사로서 부동산 분쟁과 민사집행 분야에 특화되어 있습니다.",
  affiliation: "법률사무소 엘루션",
  badges: ["민사법 전문변호사", "행정법 전문변호사", "공인중개사"],
  education: [
    "고려대학교 법학과 졸업 (2003)",
    "제46회 사법시험 합격 (2004)",
    "사법연수원 제36기 수료 (2007)",
  ],
  certifications: [
    "변호사 등록 — 대한변호사협회 (2010~)",
    "민사법 전문변호사 등록 (2019~)",
    "행정법 전문변호사 등록 (2019~)",
    "공인중개사 자격 취득 — 서울특별시 (2021~)",
  ],
  profileUrl: "https://www.lawfirm.ellution.co.kr/",
} as const;
