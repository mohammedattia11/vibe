import { MainBackground } from "@/features/home/components/main-background";
import { Navbar } from "@/features/home/components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col">
      <MainBackground>
        <Navbar />
        <div className="flex w-full flex-1 flex-col justify-center">
          {children}
        </div>
      </MainBackground>
    </main>
  );
};

export default Layout;
