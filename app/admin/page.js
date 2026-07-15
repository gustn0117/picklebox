// 관리자 대시보드 (Task 4.9에서 콘텐츠 카드로 확장 예정)
export const dynamic = "force-dynamic";

export default function AdminHome() {
  return (
    <div style={{ padding: 40, fontFamily: "'Pretendard Variable', Pretendard, sans-serif" }}>
      <h1 style={{ color: "#ff7a2f" }}>PICKLEBOX 관리자</h1>
      <p>로그인되었습니다.</p>
      <form action="/api/admin/logout" method="post">
        <button type="submit" style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer" }}>
          로그아웃
        </button>
      </form>
    </div>
  );
}
