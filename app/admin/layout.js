import "./admin.css";

export const metadata = {
  title: "PICKLEBOX 관리자",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
