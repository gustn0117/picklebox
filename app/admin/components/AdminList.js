"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";

const api = (slug, path = "") => `/api/admin/${slug}${path}`;

function emptyForm(fields) {
  const f = {};
  for (const fl of fields) f[fl.key] = fl.type === "checkbox" ? false : "";
  return f;
}
// DB 레코드 → 폼 값
function rowToForm(fields, row) {
  const f = {};
  for (const fl of fields) {
    if (fl.type === "checkbox") f[fl.key] = !!row[fl.key];
    else if (fl.type === "videoIds") {
      try { f[fl.key] = JSON.parse(row[fl.key] || "[]").join("\n"); } catch { f[fl.key] = ""; }
    } else f[fl.key] = row[fl.key] ?? "";
  }
  return f;
}

export default function AdminList({ slug, config, initialRows }) {
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState(null); // "new" | id | null
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function reload() {
    const r = await fetch(api(slug));
    const d = await r.json();
    setRows(d.rows || []);
  }

  function startNew() { setEditing("new"); setForm(emptyForm(config.fields)); setErr(""); }
  function startEdit(row) { setEditing(row.id); setForm(rowToForm(config.fields, row)); setErr(""); }
  function cancel() { setEditing(null); setErr(""); }
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true); setErr("");
    const isNew = editing === "new";
    const r = await fetch(isNew ? api(slug) : api(slug, `/${editing}`), {
      method: isNew ? "POST" : "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    if (r.ok) { setEditing(null); await reload(); }
    else { const d = await r.json().catch(() => ({})); setErr(d.error || "저장에 실패했습니다."); }
    setBusy(false);
  }

  async function toggle(row) {
    await fetch(api(slug, `/${row.id}`), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "toggle" }) });
    reload();
  }
  async function move(row, dir) {
    await fetch(api(slug, `/${row.id}`), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "move", dir }) });
    reload();
  }
  async function remove(row) {
    if (!confirm("정말 삭제할까요? 되돌릴 수 없습니다.")) return;
    await fetch(api(slug, `/${row.id}`), { method: "DELETE" });
    reload();
  }

  return (
    <div>
      <div className="a-head">
        <h1>{config.icon} {config.label}</h1>
        {config.canCreate && editing !== "new" && (
          <button className="a-btn a-btn--primary" onClick={startNew}>+ 새로 추가</button>
        )}
      </div>

      {editing === "new" && (
        <FormCard title="새 항목" fields={config.fields} form={form} setField={setField} onSave={save} onCancel={cancel} busy={busy} err={err} />
      )}

      <div className="a-list">
        {rows.length === 0 && editing !== "new" && <div className="a-empty">아직 항목이 없습니다. “새로 추가”를 눌러 등록하세요.</div>}
        {rows.map((row, i) => (
          <div key={row.id}>
            {editing === row.id ? (
              <FormCard title="수정" fields={config.fields} form={form} setField={setField} onSave={save} onCancel={cancel} busy={busy} err={err} />
            ) : (
              <div className={`a-row${config.hasVisible && !row.visible ? " a-row--hidden" : ""}`}>
                {row.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="a-thumb" src={row.imageUrl} alt="" />
                ) : (
                  <div className="a-thumb a-thumb--empty">{config.icon}</div>
                )}
                <div className="a-row__body">
                  <div className="a-row__title">{row[config.titleKey] || "(제목 없음)"}</div>
                  {config.subKey && row[config.subKey] ? <div className="a-row__sub">{String(row[config.subKey])}</div> : null}
                </div>
                <div className="a-row__actions">
                  {config.hasVisible && (
                    <button className="a-icon" title={row.visible ? "노출 중(끄기)" : "숨김(켜기)"} onClick={() => toggle(row)}>
                      {row.visible ? "👁️" : "🚫"}
                    </button>
                  )}
                  {config.ordered && (
                    <>
                      <button className="a-icon" title="위로" onClick={() => move(row, "up")} disabled={i === 0}>▲</button>
                      <button className="a-icon" title="아래로" onClick={() => move(row, "down")} disabled={i === rows.length - 1}>▼</button>
                    </>
                  )}
                  <button className="a-btn" onClick={() => startEdit(row)}>수정</button>
                  {config.canDelete && <button className="a-btn a-btn--danger" onClick={() => remove(row)}>삭제</button>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FormCard({ title, fields, form, setField, onSave, onCancel, busy, err }) {
  return (
    <div className="a-form">
      <div className="a-form__title">{title}</div>
      {fields.map((f) => (
        <div className="a-field" key={f.key}>
          {f.type === "image" ? (
            <ImageUpload name={f.key} label={f.label} value={form[f.key]} onChange={(url) => setField(f.key, url)} />
          ) : (
            <>
              <label>{f.label}</label>
              {f.type === "textarea" || f.type === "videoIds" ? (
                <textarea rows={f.type === "videoIds" ? 3 : 3} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} placeholder={f.placeholder || ""} />
              ) : f.type === "select" ? (
                <select value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)}>
                  <option value="">선택…</option>
                  {f.options.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
                </select>
              ) : f.type === "checkbox" ? (
                <label className="a-check"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setField(f.key, e.target.checked)} /> 사용</label>
              ) : (
                <input type={f.type === "url" ? "url" : "text"} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} placeholder={f.placeholder || ""} readOnly={f.readOnly} />
              )}
            </>
          )}
        </div>
      ))}
      {err && <div className="a-err">{err}</div>}
      <div className="a-form__actions">
        <button className="a-btn a-btn--primary" onClick={onSave} disabled={busy}>{busy ? "저장 중…" : "저장"}</button>
        <button className="a-btn" onClick={onCancel} disabled={busy}>취소</button>
      </div>
    </div>
  );
}
