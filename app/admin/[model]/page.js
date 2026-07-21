import { notFound } from "next/navigation";
import { db } from "../../lib/db";
import { getModel } from "../../lib/adminModels";
import AdminList from "../components/AdminList";
import AdminTopbar from "../components/AdminTopbar";

export const dynamic = "force-dynamic";

export default async function ModelAdmin({ params }) {
  const { model } = await params;
  const cfg = getModel(model);
  if (!cfg) notFound();

  const orderBy = cfg.ordered ? [{ sortOrder: "asc" }, { id: "asc" }] : [{ id: "asc" }];
  const rows = await db[cfg.prisma].findMany({ where: cfg.canDelete ? { deletedAt: null } : {}, orderBy });

  // 클라이언트로 넘길 직렬화 가능 config
  const clientCfg = {
    slug: cfg.slug, label: cfg.label, icon: cfg.icon,
    ordered: cfg.ordered, hasVisible: cfg.hasVisible, grouped: !!cfg.grouped,
    canCreate: cfg.canCreate, canDelete: cfg.canDelete,
    titleKey: cfg.titleKey, subKey: cfg.subKey, fields: cfg.fields,
  };

  return (
    <>
      <AdminTopbar back="/admin" />
      <div className="admin-wrap">
        <AdminList slug={cfg.slug} config={clientCfg} initialRows={JSON.parse(JSON.stringify(rows))} />
      </div>
    </>
  );
}
