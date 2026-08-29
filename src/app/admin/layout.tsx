export const metadata = { title: "GIZMONEPAL Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto min-h-screen max-w-[1360px] bg-bg">{children}</div>;
}
