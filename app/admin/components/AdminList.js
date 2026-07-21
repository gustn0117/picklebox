"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import Icon from "./Icon";
import RichText from "./RichText";

const api = (slug, path = "") => `/api/admin/${slug}${path}`;

// 문구 그룹 표시명 / 표시 순서
const GROUP_LABELS = {
  site: "사이트 정보", home: "홈", about: "소개", founder: "대표", community: "커뮤니티",
  partners: "파트너", events: "이벤트", journal: "저널", visit: "오시는 길", goods: "굿즈", tours: "투어",
};
const GROUP_ORDER = Object.keys(GROUP_LABELS);

function emptyForm(fields) {
  const f = {};
  for (const fl of fields) f[fl.key] = fl.type === "checkbox" ? false : "";
  return f;
}
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
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [dragId, setDragId] = useState(null);
  const [overId, setOverId] = useState(null);

  // 끌어놓기로 순서 변경 — 놓는 순간 전체 순서를 한 번에 저장
  async function dropOn(targetId) {
    if (dragId == null || dragId === targetId) { setDragId(null); setOverId(null); return; }
    const ids = rows.map((r) => r.id);
    const from = ids.indexOf(dragId), to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    ids.splice(to, 0, ids.splice(from, 1)[0]);
    setRows(ids.map((id) => rows.find((r) => r.id === id)));
    setDragId(null); setOverId(null);
    await fetch(api(slug), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "reorder", ids }),
    });
    reload();
  }

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

  // ── 문구·사이트 정보: 그룹 탭 + 인라인 편집
  if (config.grouped) {
    return <GroupedCopy slug={slug} config={config} rows={rows} onSaved={reload} />;
  }

  return (
    <div>
      <div className="a-head">
        <h1><Icon name={config.icon} size={22} /> {config.label}</h1>
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
              <div
                className={`a-row${config.hasVisible && !row.visible ? " a-row--hidden" : ""}${overId === row.id ? " a-row--over" : ""}${dragId === row.id ? " a-row--dragging" : ""}`}
                draggable={!!config.ordered}
                onDragStart={() => setDragId(row.id)}
                onDragOver={(e) => { if (config.ordered) { e.preventDefault(); setOverId(row.id); } }}
                onDragLeave={() => setOverId((v) => (v === row.id ? null : v))}
                onDrop={(e) => { e.preventDefault(); dropOn(row.id); }}
                onDragEnd={() => { setDragId(null); setOverId(null); }}
              >
                {config.ordered && <span className="a-grip" title="끌어서 순서 변경">⠿</span>}
                {row.imageUrl || row.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="a-thumb" src={row.imageUrl || row.logoUrl} alt="" />
                ) : (
                  <div className="a-thumb a-thumb--empty"><Icon name={config.icon} size={22} /></div>
                )}
                <div className="a-row__body">
                  <div className="a-row__title">
                    {row[config.titleKey] || "(제목 없음)"}
                    {row.soldOut ? <span className="a-badge">품절</span> : null}
                    {typeof row.price === "number" ? <span className="a-price">{row.price.toLocaleString()}원</span> : null}
                  </div>
                  {config.subKey && row[config.subKey] ? <div className="a-row__sub">{String(row[config.subKey])}</div> : null}
                </div>
                <div className="a-row__actions">
                  {config.hasVisible && (
                    <button className="a-icon" title={row.visible ? "노출 중(끄기)" : "숨김(켜기)"} onClick={() => toggle(row)}>
                      <Icon name={row.visible ? "eye" : "eyeOff"} size={17} />
                    </button>
                  )}
                  {config.ordered && (
                    <>
                      <button className="a-icon" title="위로" onClick={() => move(row, "up")} disabled={i === 0}><Icon name="up" size={16} /></button>
                      <button className="a-icon" title="아래로" onClick={() => move(row, "down")} disabled={i === rows.length - 1}><Icon name="down" size={16} /></button>
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

// ── 문구 · 사이트 정보 (그룹 탭 + 항목별 인라인 저장)
function GroupedCopy({ slug, config, rows, onSaved }) {
  const groups = GROUP_ORDER.filter((g) => rows.some((r) => r.group === g));
  const [active, setActive] = useState(groups[0] || "site");
  const list = rows.filter((r) => r.group === active).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <div className="a-head">
        <h1><Icon name={config.icon} size={22} /> {config.label}</h1>
      </div>
      <p className="a-hintline">수정할 페이지를 고른 뒤 문구를 바꾸고 저장하세요. 비워두면 기본 문구가 표시됩니다.</p>

      <div className="a-tabs">
        {groups.map((g) => (
          <button key={g} className={`a-tab${g === active ? " a-tab--on" : ""}`} onClick={() => setActive(g)}>
            {GROUP_LABELS[g] || g}
          </button>
        ))}
      </div>

      <div className="a-copylist">
        {list.map((row) => <CopyRow key={row.id} slug={slug} row={row} onSaved={onSaved} />)}
      </div>
    </div>
  );
}

function CopyRow({ slug, row, onSaved }) {
  const [val, setVal] = useState(row.value ?? "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const dirty = val !== (row.value ?? "");

  async function save() {
    setBusy(true); setDone(false);
    const r = await fetch(api(slug, `/${row.id}`), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ value: val }),
    });
    setBusy(false);
    if (r.ok) { setDone(true); setTimeout(() => setDone(false), 1800); onSaved && onSaved(); }
  }

  return (
    <div className="a-copyrow">
      <div className="a-copyrow__head">
        <label>{row.label}</label>
        {dirty && <button className="a-btn a-btn--primary a-btn--sm" onClick={save} disabled={busy}>{busy ? "저장 중…" : "저장"}</button>}
        {done && <span className="a-saved">저장됨</span>}
      </div>
      {row.kind === "textarea" ? (
        <textarea rows={3} value={val} onChange={(e) => setVal(e.target.value)} />
      ) : (
        <input type={row.kind === "url" ? "url" : "text"} value={val} onChange={(e) => setVal(e.target.value)} />
      )}
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
            <ImageUpload name={f.key} label={f.label} hint={f.hint} aspect={f.aspect} value={form[f.key]} onChange={(url) => setField(f.key, url)} />
          ) : (
            <>
              <label>{f.label}</label>
              {f.type === "rich" ? (
                <RichText value={form[f.key]} onChange={(html) => setField(f.key, html)} placeholder={f.placeholder} />
              ) : f.type === "textarea" || f.type === "videoIds" ? (
                <textarea rows={3} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} placeholder={f.placeholder || ""} />
              ) : f.type === "select" ? (
                <select value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)}>
                  <option value="">선택…</option>
                  {f.options.map((o) => <option key={o.v} value={o.v}>{o.t}</option>)}
                </select>
              ) : f.type === "checkbox" ? (
                <label className="a-check"><input type="checkbox" checked={!!form[f.key]} onChange={(e) => setField(f.key, e.target.checked)} /> 사용</label>
              ) : f.type === "number" ? (
                <input type="number" value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} placeholder={f.placeholder || ""} />
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
