import "../globals.css";

import GoogleAnalytics from '../components/google/GoogleAnalytics';
import GoogleAdsense from '../components/google/GoogleAdsense';
import {Providers} from "../providers";

import MyNavbar from '../components/ui/MyNavbar';
import MyFooter from '../components/ui/MyFooter';


export const metadata = {
    title: {
      default: 'TwitterXDownload', // 当页面没有指定title时使用的默认标题
      template: '%s | TwitterXDownload' // 当页面指定了title时,会用页面的title替换 %s
      // 例如: 页面设置 title: "Home" 
      // 最终显示: "Home | TwitterXDownload"
    },
    description: 'Download TwitterX videos and images'
};

export default function RootLayout({ children, params }) {
    const locale = params?.locale || 'en';

    return (
      <html lang={locale} suppressHydrationWarning>
        <head>
            <GoogleAdsense />
            <GoogleAnalytics />
        </head>
        <body className="bg-background text-foreground">
            <Providers>
                <MyNavbar locale={locale} />
                {children}
                <MyFooter locale={locale} />
            </Providers>
        </body>
      </html>
    );
  }