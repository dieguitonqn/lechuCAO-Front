
import Navbar from "../components/navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="">
            <div className="mb-20">
                <Navbar />
            </div>


            {children}
        </div>
    );
}