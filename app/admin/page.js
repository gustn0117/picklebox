import Link from "next/link";
import { db } from "../lib/db";
import { MODEL_LIST } from "../lib/adminModels";
import AdminTopbar from "./components/AdminTopbar";
import Icon from "./components/Icon";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const counts = {};
  for (const m of MODEL_LIST) {
    try { counts[m.slug] = await db[m.prisma].count(); } catch { counts[m.slug] = 0; }
  }
  return (
    <>
      <AdminTopbar />
      <div className="admin-wrap">
        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 10 }}>콘텐츠 관리</h1>
        <p style={{ color: "#8a8a95", marginTop: 6 }}>관리할 항목을 선택하세요. 저장하면 실제 사이트에 바로 반영됩니다.</p>
        <div className="a-cards">
          {MODEL_LIST.map((m) => (
            <Link key={m.slug} href={`/admin/${m.slug}`} className="a-card">
              <div className="a-card__icon"><Icon name={m.icon} size={28} /></div>
              <div className="a-card__label">{m.label}</div>
              <div className="a-card__count">{counts[m.slug]}개 항목</div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
