import { Navbar } from "@/modules/home/ui/Components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className=" flex flex-col min-h-screen">
      <Navbar />
      <div className="w-full flex-1 flex flex-col justify-center">
        {children}
      </div>
    </main>
  );
};

export default Layout;
