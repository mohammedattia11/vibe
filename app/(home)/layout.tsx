import { Navbar } from "@/modules/home/ui/Components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className=" flex flex-col min-h-screen max-h-screen">
      <Navbar />
      <div />
      <div className="flex-1 flex flex-col pb-4">{children}</div>
    </main>
  );
};

export default Layout;
