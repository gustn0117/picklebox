"use client";
import { useState } from "react";
import ImageUpload from "./ImageUpload";
import Icon from "./Icon";
import RichText from "./RichText";
import CardsEditor from "./CardsEditor";

const api = (slug, path = "") => `/api/admin/${slug}${path}`;

// 문구 그룹 표시명 / 표시 순서
const GROUP_LABELS = {
  site: "사이트 정보", home: "홈", about: "소개", founder: "대표", community: "커뮤니티",
  partners: "파트너", events: "이벤트", journal: "저널", visit: "오시는 길", goods: "굿즈", tours: "투어",
};
const GROUP_ORDER = Object.keys(GROUP_LABELS);

function emptyForm(fields) {
  const f = {};
  for (const fl of fields) f[fl.key] = fl.type === "checkbox" ? false : fl.type === "cards" ? "[]" : "";
  return f;
}
function rowToForm(fields, row) {
  const f = {};
  for (const fl of fields) {
    if (fl.type === "checkbox") f[fl.key] = !!row[fl.key];
    else if (fl.type === "cards") f[fl.key] = row[fl.key] ?? "[]";
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
  const [trash, setTrash] = useState(false);      // 휴지통 보기
  const [history, setHistory] = useState(null);   // { row, items }
  const [pub, setPub] = useState({ visible: true, publishAt: "" }); // 저장 시 공개 설정

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

  async function reload(showTrash = trash) {
    const r = await fetch(api(slug) + (showTrash ? "?trash=1" : ""));
    const d = await r.json();
    setRows(d.rows || []);
  }

  function startNew() { setEditing("new"); setForm(emptyForm(config.fields)); setPub({ visible: true, publishAt: "" }); setErr(""); }
  function startEdit(row) {
    setEditing(row.id); setForm(rowToForm(config.fields, row)); setErr("");
    setPub({ visible: row.visible !== false, publishAt: row.publishAt ? String(row.publishAt).slice(0, 16) : "" });
  }
  function cancel() { setEditing(null); setErr(""); }
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true); setErr("");
    const isNew = editing === "new";
    const r = await fetch(isNew ? api(slug) : api(slug, `/${editing}`), {
      method: isNew ? "POST" : "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(config.hasVisible ? { ...form, ...pub } : form),
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
    if (!confirm("휴지통으로 보낼까요? 나중에 복구할 수 있습니다.")) return;
    await fetch(api(slug, `/${row.id}`), { method: "DELETE" });
    reload();
  }
  async function restore(row) {
    await fetch(api(slug, `/${row.id}`), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "restore" }) });
    reload();
  }
  async function purge(row) {
    if (!confirm("영구 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) return;
    await fetch(api(slug, `/${row.id}?purge=1`), { method: "DELETE" });
    reload();
  }
  async function openHistory(row) {
    const r = await fetch(api(slug, `/${row.id}?revisions=1`));
    const d = await r.json().catch(() => ({}));
    setHistory({ row, items: d.revisions || [] });
  }
  async function revertTo(revisionId) {
    await fetch(api(slug, `/${history.row.id}`), { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "revert", revisionId }) });
    setHistory(null); reload();
  }
  function toggleTrash() {
    const next = !trash; setTrash(next); setEditing(null); reload(next);
  }

  // ── 문구·사이트 정보: 그룹 탭 + 인라인 편집
  if (config.grouped) {
    return <GroupedCopy slug={slug} config={config} rows={rows} onSaved={reload} />;
  }

  return (
    <div>
      <div className="a-head">
        <h1><Icon name={config.icon} size={22} /> {config.label}{trash ? " · 휴지통" : ""}</h1>
        <div style={{ display: "flex", gap: 8 }}>
          {config.canDelete && (
            <button className="a-btn" onClick={toggleTrash}>{trash ? "← 목록으로" : "휴지통"}</button>
          )}
          {config.canCreate && !trash && editing !== "new" && (
            <button className="a-btn a-btn--primary" onClick={startNew}>+ 새로 추가</button>
          )}
        </div>
      </div>

      {editing === "new" && (
        <FormCard title="새 항목" fields={config.fields} form={form} setField={setField} onSave={save} onCancel={cancel} busy={busy} err={err} pub={config.hasVisible ? pub : null} setPub={setPub} />
      )}

      <div className="a-list">
        {rows.length === 0 && editing !== "new" && <div className="a-empty">{trash ? "휴지통이 비어 있습니다." : "아직 항목이 없습니다. “새로 추가”를 눌러 등록하세요."}</div>}
        {rows.map((row, i) => (
          <div key={row.id}>
            {editing === row.id ? (
              <FormCard title="수정" fields={config.fields} form={form} setField={setField} onSave={save} onCancel={cancel} busy={busy} err={err} pub={config.hasVisible ? pub : null} setPub={setPub} />
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
                    {config.hasVisible && !row.visible ? <span className="a-badge a-badge--muted">비공개</span> : null}
                    {row.publishAt && new Date(row.publishAt) > new Date()
                      ? <span className="a-badge a-badge--soon">예약 {new Date(row.publishAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                      : null}
                    {row.soldOut ? <span className="a-badge">품절</span> : null}
                    {typeof row.price === "number" ? <span className="a-price">{row.price.toLocaleString()}원</span> : null}
                  </div>
                  {config.subKey && row[config.subKey] ? <div className="a-row__sub">{String(row[config.subKey])}</div> : null}
                </div>
                <div className="a-row__actions">
                  {trash ? (
                    <>
                      <button className="a-btn a-btn--primary" onClick={() => restore(row)}>복구</button>
                      <button className="a-btn a-btn--danger" onClick={() => purge(row)}>영구 삭제</button>
                    </>
                  ) : (
                  <>
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
                  <button className="a-btn" onClick={() => openHistory(row)}>이력</button>
                  {config.canDelete && <button className="a-btn a-btn--danger" onClick={() => remove(row)}>삭제</button>}
                  </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {history && (
        <div className="cropper" onClick={(e) => { if (e.target === e.currentTarget) setHistory(null); }}>
          <div className="cropper__panel">
            <div className="cropper__title">수정 이력</div>
            <p className="cropper__help">되돌릴 시점을 고르세요. 되돌리기 전 상태도 이력에 남습니다.</p>
            <div className="a-histlist">
              {history.items.length === 0 && <div className="a-empty">아직 이력이 없습니다.</div>}
              {history.items.map((h) => (
                <div key={h.id} className="a-histrow">
                  <span>{new Date(h.createdAt).toLocaleString("ko-KR")}<em>{h.action === "delete" ? " · 삭제됨" : ""}</em></span>
                  <button className="a-btn a-btn--sm" onClick={() => revertTo(h.id)}>이 내용으로 되돌리기</button>
                </div>
              ))}
            </div>
            <div className="cropper__actions"><button className="a-btn" onClick={() => setHistory(null)}>닫기</button></div>
          </div>
        </div>
      )}
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

// 이미지 문구 키별 권장 크기 안내
const COPY_IMG_HINT = {
  "home.hero.bg": "가로 1920×1200 권장 (첫 화면 배경)",
  "home.bento.about.img": "가로 1200×1200 권장",
  "home.bento.visit.img": "가로 1600×900 권장",
  "events.next.img": "가로 1600×900 권장",
  "founder.photo": "세로형 1000×1250 권장 (4:5)",
};

function CopyRow({ slug, row, onSaved }) {
  const meta = { ...row, hint: COPY_IMG_HINT[row.key], placeholder: row.kind === "list" ? "한 줄에 하나씩 입력하세요" : "" };
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
      {row.kind === "image" ? (
        <ImageUpload label="" hint={meta.hint} value={val} onChange={(url) => setVal(url)} />
      ) : row.kind === "textarea" || row.kind === "list" ? (
        <textarea rows={row.kind === "list" ? 6 : 3} value={val} onChange={(e) => setVal(e.target.value)} placeholder={meta.placeholder} />
      ) : (
        <input type={row.kind === "url" ? "url" : "text"} value={val} onChange={(e) => setVal(e.target.value)} />
      )}
    </div>
  );
}

function FormCard({ title, fields, form, setField, onSave, onCancel, busy, err, pub, setPub }) {
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
              {f.type === "cards" ? (
                <CardsEditor value={form[f.key]} onChange={(json) => setField(f.key, json)} />
              ) : f.type === "rich" ? (
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
      {pub && (
        <div className="a-publish">
          <div className="a-publish__row">
            <label className="a-check">
              <input type="checkbox" checked={pub.visible} onChange={(e) => setPub({ ...pub, visible: e.target.checked })} />
              지금 공개하기 <span className="a-publish__hint">(끄면 비공개로 저장 — 사이트에 안 보임)</span>
            </label>
          </div>
          <div className="a-publish__row">
            <label>예약 공개 (선택)</label>
            <input type="datetime-local" value={pub.publishAt} onChange={(e) => setPub({ ...pub, publishAt: e.target.value })} />
            {pub.publishAt && <button type="button" className="a-btn a-btn--sm" onClick={() => setPub({ ...pub, publishAt: "" })}>지우기</button>}
          </div>
        </div>
      )}
      {err && <div className="a-err">{err}</div>}
      <div className="a-form__actions">
        <button className="a-btn a-btn--primary" onClick={onSave} disabled={busy}>{busy ? "저장 중…" : (pub && !pub.visible ? "비공개로 저장" : "저장")}</button>
        <button className="a-btn" onClick={onCancel} disabled={busy}>취소</button>
      </div>
    </div>
  );
}
