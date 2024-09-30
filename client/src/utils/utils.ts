// 날짜 포맷팅 함수
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// 문자열 자르기 함수
export const truncateString = (str: string, num: number): string => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

// 숫자 포맷팅 함수 (예: 1000 -> 1,000)
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 기타 유틸리티 함수들을 여기에 추가할 수 있습니다.
