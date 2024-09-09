
import Header from "@/components/@me/layout/assets/Header";

export const metadata = {
  title: "ChatterBox",
  description: "",
  metadataBase: new URL('https://chat.ppekkungz.in.th'),

  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'th-TH': '/th-TH',
    },
  },
  openGraph: {
    url: 'https://chat.ppekkungz.in.th',
    type: 'website',
    locale: 'th-TH',
    title: "ChatterBox",
    description: "",
    images: [
      {
        url: '',
        width: 200,
        height: 200,
        alt: 'ChatterBox',
      },
    ],
  },
  twitter: {
    title: "ChatterBox",
    description: "",
    card: 'summary_large_image',
    site: '@ChatterBox',
    creator: '@ChatterBox',
    images: [
      '',
    ],
  },
}
export default function Home() {
  return (
    <>
        <Header label="Home" />
    </>
  );
}
