import { Navbar } from "@/modules/home/ui/Components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex w-full flex-1 flex-col justify-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;
