import SiteHeader from "@/src/components/custom/SiteHeader";
import SiteFooter from "@/src/components/site-footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <SiteHeader/>
        {children}
        <SiteFooter/>
    </div>
  );
}
